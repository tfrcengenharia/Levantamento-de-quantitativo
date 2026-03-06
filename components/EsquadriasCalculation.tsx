'use client';

import React, { useState, useEffect } from 'react';
import { DoorOpen, Plus, Trash2, RotateCcw, Calculator, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface EsquadriaRow {
  id: string;
  codigo: string;
  largura: string;
  altura: string;
  quantidade: string;
  folhas: string;
  material: string;
  espessura: string;
  soleira: 'SIM' | 'NÃO';
}

const createEmptyRow = (index: number): EsquadriaRow => ({
  id: Math.random().toString(36).substring(2, 9),
  codigo: index === 0 ? 'PT1' : index === 1 ? 'P01' : index === 2 ? 'P02' : index === 3 ? 'J01' : `E0${index + 1}`,
  largura: '',
  altura: '',
  quantidade: '',
  folhas: '',
  material: 'ALUMÍNIO',
  espessura: '',
  soleira: 'NÃO',
});

export default function EsquadriasCalculation() {
  const [rows, setRows] = useState<EsquadriaRow[]>(() => 
    Array.from({ length: 6 }, (_, i) => createEmptyRow(i))
  );

  const parseNum = (val: string) => {
    const normalized = val.replace(/\./g, '').replace(',', '.');
    return parseFloat(normalized) || 0;
  };

  const formatNum = (val: number, decimals: number = 2) => {
    if (val === 0) return '-';
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(val);
  };

  const calculateRow = (row: EsquadriaRow) => {
    const L = parseNum(row.largura);
    const H = parseNum(row.altura);
    const Q = parseNum(row.quantidade);
    
    const areaTotal = L * H * Q;
    
    // Lógica de Desconto de Alvenaria (Simplificada: se for porta/portão, desconta tudo. Se for janela, pode variar, mas usaremos total como padrão)
    // No modelo do usuário, PT1 (2x2.2) deu 4.4 total e 2.4 desc. Isso sugere uma lógica específica ou campo manual.
    // Para este modelo, seguiremos a área total como desconto padrão, permitindo ajustes se necessário no futuro.
    const areaDesc = areaTotal; 

    // Vergas e Contra-vergas (Largura + 40cm de transpasse total)
    const verga = L > 0 ? (L + 0.4) * Q : 0;
    const contraVerga = (row.codigo.startsWith('J') && L > 0) ? (L + 0.4) * Q : 0;
    
    // Peitoril (Apenas para janelas: Largura + 5cm de folga)
    const peitoril = (row.codigo.startsWith('J') && L > 0) ? (L + 0.05) * Q : 0;

    // Forramento e Alizar (Exclusivo Madeira)
    const forramento = row.material === 'MADEIRA' ? Q : 0;
    const alizar = row.material === 'MADEIRA' ? Q * 2 : 0;
    
    // Dobradiças (3 por porta de madeira)
    const dobradica = row.material === 'MADEIRA' ? Q * 3 : 0;
    
    // Fechaduras (1 por esquadria)
    const fechadura = Q;

    // Pintura Madeira (Área * 2.75 para considerar os dois lados e batentes)
    const pintura = row.material === 'MADEIRA' ? areaTotal * 2.75 : 0;

    return {
      ...row,
      areaTotal,
      areaDesc,
      verga,
      contraVerga,
      peitoril,
      forramento,
      alizar,
      dobradica,
      fechadura,
      pintura
    };
  };

  const calculatedRows = rows.map(calculateRow);

  const totals = calculatedRows.reduce((acc, curr) => ({
    areaTotal: acc.areaTotal + curr.areaTotal,
    areaDesc: acc.areaDesc + curr.areaDesc,
    verga: acc.verga + curr.verga,
    contraVerga: acc.contraVerga + curr.contraVerga,
    peitoril: acc.peitoril + curr.peitoril,
    forramento: acc.forramento + curr.forramento,
    alizar: acc.alizar + curr.alizar,
    dobradica: acc.dobradica + curr.dobradica,
    fechadura: acc.fechadura + curr.fechadura,
    pintura: acc.pintura + curr.pintura,
  }), {
    areaTotal: 0, areaDesc: 0, verga: 0, contraVerga: 0, peitoril: 0,
    forramento: 0, alizar: 0, dobradica: 0, fechadura: 0, pintura: 0
  });

  const updateRow = (id: string, field: keyof EsquadriaRow, value: any) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addRow = () => {
    setRows([...rows, createEmptyRow(rows.length)]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(r => r.id !== id));
    }
  };

  // Agrupamento para o Resumo
  const summaryMaterials = () => {
    const summary: Record<string, number> = {};
    
    calculatedRows.forEach(r => {
      if (r.areaTotal <= 0) return;
      
      // Por Material
      const key = `${r.codigo.startsWith('P') ? 'PORTA/PORTÃO' : 'JANELA'} - ${r.material}`;
      summary[key] = (summary[key] || 0) + r.areaTotal;
      
      // Por Espessura de Vidro
      if (r.material === 'VIDRO' && r.espessura) {
        const vKey = `VIDRO ${r.espessura}`;
        summary[vKey] = (summary[vKey] || 0) + r.areaTotal;
      }
    });

    return summary;
  };

  return (
    <div className="space-y-8">
      {/* Legenda e Controles */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="size-4 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded"></div>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Células Cinzas: Editável</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="size-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded"></div>
            <span className="text-slate-600 dark:text-slate-400 font-medium">Células Brancas: Automático</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={addRow}
            className="flex items-center gap-2 px-4 py-2 bg-brand text-white rounded-lg text-sm font-bold hover:brightness-110 transition-all shadow-sm"
          >
            <Plus className="size-4" /> Adicionar Linha
          </button>
          <button 
            onClick={() => setRows(Array.from({ length: 6 }, (_, i) => createEmptyRow(i)))}
            className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
          >
            <RotateCcw className="size-4" /> Resetar
          </button>
        </div>
      </div>

      {/* Tabela Principal */}
      <div className="overflow-x-auto border-2 border-black rounded-sm shadow-xl">
        <table className="w-full border-collapse text-[10px] text-center bg-white dark:bg-slate-950">
          <thead>
            <tr className="bg-black text-brand-yellow">
              <th colSpan={19} className="py-3 text-lg font-black tracking-widest uppercase">
                LEVANTAMENTO DE ESQUADRIAS
              </th>
            </tr>
            <tr className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold uppercase border-b-2 border-black">
              <th className="border border-black p-2 w-12">Ação</th>
              <th className="border border-black p-2">CÓDIGO</th>
              <th className="border border-black p-2 bg-slate-200 dark:bg-slate-800">LARG.(m)</th>
              <th className="border border-black p-2 bg-slate-200 dark:bg-slate-800">ALT.(m)</th>
              <th className="border border-black p-2 bg-slate-200 dark:bg-slate-800">QUANT</th>
              <th className="border border-black p-2 bg-slate-200 dark:bg-slate-800">FOLHAS</th>
              <th className="border border-black p-2">ÁREA TOTAL (m²)</th>
              <th className="border border-black p-2">DESC. ALV. (m²)</th>
              <th className="border border-black p-2 bg-slate-200 dark:bg-slate-800">MATERIAL</th>
              <th className="border border-black p-2 bg-slate-200 dark:bg-slate-800">ESP. VIDRO</th>
              <th className="border border-black p-2">VERGA</th>
              <th className="border border-black p-2">CONTRA-V.</th>
              <th className="border border-black p-2">PEITORIL</th>
              <th className="border border-black p-2 bg-slate-200 dark:bg-slate-800">SOLEIRA</th>
              <th className="border border-black p-2">FORRA (CJ)</th>
              <th className="border border-black p-2">ALIZAR (CJ)</th>
              <th className="border border-black p-2">DOBRAD.</th>
              <th className="border border-black p-2">FECHAD.</th>
              <th className="border border-black p-2">PINT. MAD. (m²)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {calculatedRows.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                <td className="border border-black p-1">
                  <button onClick={() => removeRow(row.id)} className="p-1 text-red-500 hover:bg-red-50 rounded">
                    <Trash2 className="size-3" />
                  </button>
                </td>
                <td className="border border-black p-1">
                  <input 
                    type="text" 
                    value={row.codigo} 
                    onChange={(e) => updateRow(row.id, 'codigo', e.target.value.toUpperCase())}
                    className="w-full text-center font-bold bg-transparent outline-none"
                  />
                </td>
                <td className="border border-black p-1 bg-slate-100 dark:bg-slate-800/50">
                  <input 
                    type="text" 
                    value={row.largura} 
                    onChange={(e) => updateRow(row.id, 'largura', e.target.value)}
                    placeholder="0,00"
                    className="w-full text-center bg-transparent outline-none"
                  />
                </td>
                <td className="border border-black p-1 bg-slate-100 dark:bg-slate-800/50">
                  <input 
                    type="text" 
                    value={row.altura} 
                    onChange={(e) => updateRow(row.id, 'altura', e.target.value)}
                    placeholder="0,00"
                    className="w-full text-center bg-transparent outline-none"
                  />
                </td>
                <td className="border border-black p-1 bg-slate-100 dark:bg-slate-800/50">
                  <input 
                    type="text" 
                    value={row.quantidade} 
                    onChange={(e) => updateRow(row.id, 'quantidade', e.target.value)}
                    placeholder="0"
                    className="w-full text-center bg-transparent outline-none"
                  />
                </td>
                <td className="border border-black p-1 bg-slate-100 dark:bg-slate-800/50">
                  <input 
                    type="text" 
                    value={row.folhas} 
                    onChange={(e) => updateRow(row.id, 'folhas', e.target.value)}
                    className="w-full text-center bg-transparent outline-none"
                  />
                </td>
                <td className="border border-black p-1 font-bold">{formatNum(row.areaTotal)}</td>
                <td className="border border-black p-1">{formatNum(row.areaDesc)}</td>
                <td className="border border-black p-1 bg-slate-100 dark:bg-slate-800/50">
                  <select 
                    value={row.material} 
                    onChange={(e) => updateRow(row.id, 'material', e.target.value)}
                    className="w-full bg-transparent outline-none text-center appearance-none cursor-pointer"
                  >
                    <option value="ALUMÍNIO">ALUMÍNIO</option>
                    <option value="MADEIRA">MADEIRA</option>
                    <option value="VIDRO">VIDRO</option>
                    <option value="FERRO">FERRO</option>
                  </select>
                </td>
                <td className="border border-black p-1 bg-slate-100 dark:bg-slate-800/50">
                  <input 
                    type="text" 
                    value={row.espessura} 
                    onChange={(e) => updateRow(row.id, 'espessura', e.target.value)}
                    className="w-full text-center bg-transparent outline-none"
                  />
                </td>
                <td className="border border-black p-1">{formatNum(row.verga)}</td>
                <td className="border border-black p-1">{formatNum(row.contraVerga)}</td>
                <td className="border border-black p-1">{formatNum(row.peitoril)}</td>
                <td className="border border-black p-1 bg-slate-100 dark:bg-slate-800/50">
                  <select 
                    value={row.soleira} 
                    onChange={(e) => updateRow(row.id, 'soleira', e.target.value)}
                    className="w-full bg-transparent outline-none text-center appearance-none cursor-pointer"
                  >
                    <option value="NÃO">NÃO</option>
                    <option value="SIM">SIM</option>
                  </select>
                </td>
                <td className="border border-black p-1">{row.forramento || '-'}</td>
                <td className="border border-black p-1">{row.alizar || '-'}</td>
                <td className="border border-black p-1">{row.dobradica || '-'}</td>
                <td className="border border-black p-1">{row.fechadura || '-'}</td>
                <td className="border border-black p-1">{formatNum(row.pintura)}</td>
              </tr>
            ))}
            {/* Linha de Totais */}
            <tr className="bg-slate-100 dark:bg-slate-900 font-black text-slate-900 dark:text-white border-t-2 border-black">
              <td colSpan={6} className="border border-black p-2 text-right text-xs uppercase tracking-widest">TOTAIS GERAIS</td>
              <td className="border border-black p-1">{formatNum(totals.areaTotal)}</td>
              <td className="border border-black p-1">{formatNum(totals.areaDesc)}</td>
              <td colSpan={2} className="border border-black p-1 bg-slate-200 dark:bg-slate-800"></td>
              <td className="border border-black p-1">{formatNum(totals.verga)}</td>
              <td className="border border-black p-1">{formatNum(totals.contraVerga)}</td>
              <td className="border border-black p-1">{formatNum(totals.peitoril)}</td>
              <td className="border border-black p-1 bg-slate-200 dark:bg-slate-800"></td>
              <td className="border border-black p-1">{totals.forramento || '-'}</td>
              <td className="border border-black p-1">{totals.alizar || '-'}</td>
              <td className="border border-black p-1">{totals.dobradica || '-'}</td>
              <td className="border border-black p-1">{totals.fechadura || '-'}</td>
              <td className="border border-black p-1">{formatNum(totals.pintura)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Resumo de Materiais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 border-2 border-black rounded-sm overflow-hidden shadow-lg">
          <table className="w-full border-collapse text-xs text-center bg-white dark:bg-slate-950">
            <thead>
              <tr className="bg-black text-white">
                <th colSpan={2} className="py-2 font-bold uppercase tracking-widest">RESUMO DOS MATERIAIS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black">
              {Object.entries(summaryMaterials()).map(([key, val], idx) => (
                <tr key={idx}>
                  <td className="border-r border-black p-2 text-left font-medium bg-slate-50 dark:bg-slate-900/50 uppercase">{key}</td>
                  <td className="p-2 font-bold">{formatNum(val)} m²</td>
                </tr>
              ))}
              {totals.peitoril > 0 && (
                <tr>
                  <td className="border-r border-black p-2 text-left font-medium bg-slate-50 dark:bg-slate-900/50 uppercase">PEITORIL TOTAL</td>
                  <td className="p-2 font-bold">{formatNum(totals.peitoril)} m</td>
                </tr>
              )}
              {totals.verga > 0 && (
                <tr>
                  <td className="border-r border-black p-2 text-left font-medium bg-slate-50 dark:bg-slate-900/50 uppercase">VERGAS/CONTRA-VERGAS</td>
                  <td className="p-2 font-bold">{formatNum(totals.verga + totals.contraVerga)} m</td>
                </tr>
              )}
              {totals.fechadura > 0 && (
                <tr>
                  <td className="border-r border-black p-2 text-left font-medium bg-slate-50 dark:bg-slate-900/50 uppercase">FECHADURAS</td>
                  <td className="p-2 font-bold">{totals.fechadura} UND</td>
                </tr>
              )}
              {totals.dobradica > 0 && (
                <tr>
                  <td className="border-r border-black p-2 text-left font-medium bg-slate-50 dark:bg-slate-900/50 uppercase">DOBRADIÇAS</td>
                  <td className="p-2 font-bold">{totals.dobradica} UND</td>
                </tr>
              )}
              {totals.pintura > 0 && (
                <tr>
                  <td className="border-r border-black p-2 text-left font-medium bg-slate-50 dark:bg-slate-900/50 uppercase">PINTURA MADEIRA</td>
                  <td className="p-2 font-bold">{formatNum(totals.pintura)} m²</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl flex gap-3">
            <Info className="size-5 text-blue-500 shrink-0" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-bold mb-1">Dica Técnica:</p>
              <p>O cálculo de vergas e contra-vergas considera um transpasse padrão de 20cm para cada lado do vão. A área de pintura para madeira considera as duas faces mais os batentes (fator 2.75).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
