'use client';

import React, { useState, useEffect } from 'react';
import { LayoutGrid, Database, Calculator, HelpCircle, Plus, Trash2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BRICK_DATABASE } from '@/data/brickDatabase';
import MaterialSummary from './MaterialSummary';
import TechnicalConsultation from './TechnicalConsultation';

interface Aditivo {
  id: string;
  nome: string;
  rendimento: string; // L/SACA
}

interface WallRow {
  id: string;
  selected: boolean;
  idParede: string;
  comprimento: string;
  altura: string;
  selectedBrickType: string;
  assentamentoType: '1/2 VEZ' | '1 VEZ';
  rebocoGessoType: 'NÃO HÁ' | '1 LADO' | '2 LADOS';
  isDiscountRow?: boolean;
  manualArea?: string;
}

const createEmptyRow = (): WallRow => ({
  id: Math.random().toString(36).substring(2, 9),
  selected: false,
  idParede: '',
  comprimento: '',
  altura: '',
  selectedBrickType: BRICK_DATABASE[0].type,
  assentamentoType: '1/2 VEZ',
  rebocoGessoType: 'NÃO HÁ',
});

export default function MaterialCalculation() {
  const [activeTab, setActiveTab] = useState<'calc' | 'data'>('calc');
  const [showTooltip, setShowTooltip] = useState(false);

  const [rows, setRows] = useState<WallRow[]>(() => 
    Array.from({ length: 10 }, (_, i) => ({
      ...createEmptyRow(),
      id: `initial-${i}` // Stable ID for hydration
    }))
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const [discountRow, setDiscountRow] = useState<WallRow>(() => ({
    ...createEmptyRow(),
    id: 'discount-row',
    idParede: 'DESCONTO',
    isDiscountRow: true,
    manualArea: '2,90',
  }));

  // Data Model Dinâmico (Aditivos)
  const [aditivos, setAditivos] = useState<Aditivo[]>([
    { id: '1', nome: 'QUIMIKAL', rendimento: '0,20' },
    { id: '2', nome: 'VEDALIT', rendimento: '0,12' },
    { id: '3', nome: 'VIACAL', rendimento: '0,10' },
    { id: '4', nome: 'SIKANOL', rendimento: '0,10' },
  ]);
  const [newAditivoNome, setNewAditivoNome] = useState('');
  const [newAditivoRendimento, setNewAditivoRendimento] = useState('');

  const handleNewAditivoNomeChange = (val: string) => {
    setNewAditivoNome(val);
    const nomeUpper = val.toUpperCase();
    
    const defaults: Record<string, string> = {
      'QUIMIKAL': '0,20',
      'VEDALIT': '0,12',
      'VIACAL': '0,10',
      'SIKANOL': '0,10'
    };
    
    if (defaults[nomeUpper]) {
      setNewAditivoRendimento(defaults[nomeUpper]);
    } else {
      // Se não for um dos padrões, limpamos apenas se o campo estiver vazio ou se o usuário estiver digitando algo novo
      // Mas a regra diz: "Se o usuário digitar uma marca que não está nessa lista padrão, o campo de rendimento deve ficar em branco"
      setNewAditivoRendimento('');
    }
  };

  // Grupo 1: ARGAMASSA DE ASSENTAMENTO
  const [aditivoAssentamento, setAditivoAssentamento] = useState<'SIM' | 'NÃO' | ''>('');
  const [nomeAditivoAssentamento, setNomeAditivoAssentamento] = useState<string>('');
  const [tracoAssentamentoCimento, setTracoAssentamentoCimento] = useState<string>('1');
  const [tracoAssentamentoCal, setTracoAssentamentoCal] = useState<string>('');
  const [tracoAssentamentoAreia, setTracoAssentamentoAreia] = useState<string>('6');

  // Grupo 2: CHAPISCO
  const [rendimentoCimentoChapisco, setRendimentoCimentoChapisco] = useState<string>('30');
  const [tracoChapiscoCimento, setTracoChapiscoCimento] = useState<string>('1');
  const [tracoChapiscoAreia, setTracoChapiscoAreia] = useState<string>('3');

  // Grupo 3: REBOCO
  const [aditivoReboco, setAditivoReboco] = useState<'SIM' | 'NÃO' | ''>('');
  const [nomeAditivoReboco, setNomeAditivoReboco] = useState<string>('');
  const [rendimentoCimentoReboco, setRendimentoCimentoReboco] = useState<string>('11');
  const [tracoRebocoCimento, setTracoRebocoCimento] = useState<string>('1');
  const [tracoRebocoCal, setTracoRebocoCal] = useState<string>('0');
  const [tracoRebocoAreia, setTracoRebocoAreia] = useState<string>('6');
  const [rendimentoGesso, setRendimentoGesso] = useState<string>('2,5');

  // Helper to parse Brazilian formatted numbers
  const parseNum = (val: string) => {
    const normalized = val.replace(/\./g, '').replace(',', '.');
    return parseFloat(normalized) || 0;
  };

  // Helper to format numbers to Brazilian standard
  const formatNum = (val: number, decimals: number = 2) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(val);
  };

  // Row management
  const addRow = () => {
    setRows([...rows, createEmptyRow()]);
  };

  const addAditivo = () => {
    if (!newAditivoNome || !newAditivoRendimento) return;
    const nomeUpper = newAditivoNome.toUpperCase();
    
    setAditivos(prev => {
      const index = prev.findIndex(a => a.nome === nomeUpper);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = { ...updated[index], rendimento: newAditivoRendimento };
        return updated;
      } else {
        return [...prev, { 
          id: Date.now().toString(),
          nome: nomeUpper, 
          rendimento: newAditivoRendimento 
        }];
      }
    });
    
    setNewAditivoNome('');
    setNewAditivoRendimento('');
  };

  const deleteRow = (id: string) => {
    setRows(prevRows => {
      const remainingRows = prevRows.filter(row => row.id !== id);
      return remainingRows.length > 0 ? remainingRows : Array.from({ length: 10 }, () => createEmptyRow());
    });
  };

  const deleteSelectedRows = () => {
    const selectedCount = rows.filter(r => r.selected).length;
    if (selectedCount === 0) return;
    
    if (window.confirm(`Tem certeza que deseja excluir as ${selectedCount} paredes selecionadas?`)) {
      setRows(prevRows => {
        const remainingRows = prevRows.filter(r => !r.selected);
        return remainingRows.length > 0 ? remainingRows : Array.from({ length: 10 }, () => createEmptyRow());
      });
    }
  };

  const clearTable = () => {
    if (window.confirm('Tem certeza que deseja apagar todos os dados e resetar a tabela?')) {
      setRows(Array.from({ length: 10 }, () => createEmptyRow()));
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    setRows(prevRows => prevRows.map(row => ({ ...row, selected: checked })));
  };

  const updateRow = (id: string, field: keyof WallRow, value: any) => {
    if (id === 'discount-row') {
      setDiscountRow(prev => ({ ...prev, [field]: value }));
      return;
    }
    setRows(prevRows => prevRows.map(row => {
      if (row.id === id) {
        if (field === 'idParede' && typeof value === 'string') return { ...row, [field]: value.toUpperCase() };
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  // Calculations per row
  const calculateRowData = (row: WallRow) => {
    const isDiscount = row.isDiscountRow;
    const compVal = parseNum(row.comprimento);
    const altVal = parseNum(row.altura);
    const areaVal = isDiscount ? parseNum(row.manualArea || '0') : compVal * altVal;
    
    const selectedBrick = BRICK_DATABASE.find(b => b.type === row.selectedBrickType) || BRICK_DATABASE[0];
    const brickQtyPerM2 = row.assentamentoType === '1/2 VEZ' ? selectedBrick.qtyHalf : selectedBrick.qtyFull;
    const cementYield = row.assentamentoType === '1/2 VEZ' ? selectedBrick.yieldHalf : selectedBrick.yieldFull;

    const totalBricksExact = areaVal * brickQtyPerM2;
    const totalBricksCommercial = Math.ceil(totalBricksExact);

    // Assentamento
    const cimentoKg = cementYield > 0 ? (50 / cementYield) * areaVal : 0;
    const propCimAssent = parseNum(tracoAssentamentoCimento) || 1;
    const propCalVal = parseNum(tracoAssentamentoCal);
    const propAreiaVal = parseNum(tracoAssentamentoAreia);
    const calM3 = aditivoAssentamento === 'SIM' ? 0 : (0.036 / 50) * cimentoKg * (propCalVal / propCimAssent);
    const areiaM3 = (0.036 / 50) * cimentoKg * (propAreiaVal / propCimAssent);
    
    const aditivoAssentObj = aditivos.find(a => a.nome === nomeAditivoAssentamento);
    const yieldAssent = aditivoAssentObj ? parseNum(aditivoAssentObj.rendimento) : 0;
    const aditivoAssentamentoLitros = aditivoAssentamento === 'SIM' ? (cimentoKg / 50) * yieldAssent : 0;

    // Gesso
    let areaGessoVal = 0;
    if (row.rebocoGessoType === '1 LADO') areaGessoVal = areaVal;
    else if (row.rebocoGessoType === '2 LADOS') areaGessoVal = areaVal * 2;
    
    const rendGessoVal = parseNum(rendimentoGesso) || 2.5;
    const gessoKgVal = rendGessoVal > 0 ? (40 / rendGessoVal) * areaGessoVal : 0;

    // Chapisco
    const rendCimChapVal = parseNum(rendimentoCimentoChapisco);
    const propCimChap = parseNum(tracoChapiscoCimento) || 1;
    const tracoAreiaChapVal = parseNum(tracoChapiscoAreia);
    const areaChapiscoVal = (areaVal * 2) - areaGessoVal;
    const cimentoChapiscoKg = rendCimChapVal > 0 ? (50 / rendCimChapVal) * areaChapiscoVal : 0;
    const areiaChapiscoM3 = (0.036 / 50) * cimentoChapiscoKg * (tracoAreiaChapVal / propCimChap);

    // Reboco
    const rendCimRebocoVal = parseNum(rendimentoCimentoReboco);
    const propCimReboco = parseNum(tracoRebocoCimento) || 1;
    const propCalReboco = parseNum(tracoRebocoCal);
    const propAreiaReboco = parseNum(tracoRebocoAreia);
    
    // Reboco is zero for discount row
    const areaRebocoVal = isDiscount ? 0 : areaChapiscoVal; 
    const cimentoRebocoKg = !isDiscount && rendCimRebocoVal > 0 ? (50 / rendCimRebocoVal) * areaRebocoVal : 0;
    const calRebocoM3 = !isDiscount && aditivoReboco === 'SIM' ? 0 : (0.036 / 50) * cimentoRebocoKg * (propCalReboco / propCimReboco);
    const areiaRebocoM3 = !isDiscount ? (0.036 / 50) * cimentoRebocoKg * (propAreiaReboco / propCimReboco) : 0;

    const aditivoRebocoObj = aditivos.find(a => a.nome === nomeAditivoReboco);
    const yieldReboco = aditivoRebocoObj ? parseNum(aditivoRebocoObj.rendimento) : 0;
    const aditivoRebocoLitros = !isDiscount && aditivoReboco === 'SIM' ? (cimentoRebocoKg / 50) * yieldReboco : 0;

    return {
      ...row,
      areaVal,
      totalBricksExact,
      totalBricksCommercial,
      cimentoKg,
      calM3,
      areiaM3,
      aditivoAssentamentoLitros,
      areaGessoVal,
      gessoKgVal,
      areaChapiscoVal,
      cimentoChapiscoKg,
      areiaChapiscoM3,
      areaRebocoVal,
      cimentoRebocoKg,
      calRebocoM3,
      areiaRebocoM3,
      aditivoRebocoLitros
    };
  };

  const calculatedRows = rows.map(calculateRowData);
  const calculatedDiscountRow = calculateRowData(discountRow);

  // Totals for summary
  const normalTotals = calculatedRows.reduce((acc, curr) => ({
    areaAlvenaria: acc.areaAlvenaria + curr.areaVal,
    totalBricksExact: acc.totalBricksExact + curr.totalBricksExact,
    totalBricksCommercial: acc.totalBricksCommercial + curr.totalBricksCommercial,
    cimentoKg: acc.cimentoKg + curr.cimentoKg,
    cimentoChapiscoKg: acc.cimentoChapiscoKg + curr.cimentoChapiscoKg,
    calM3: acc.calM3 + curr.calM3,
    areiaM3: acc.areiaM3 + curr.areiaM3,
    aditivoAssentamentoLitros: acc.aditivoAssentamentoLitros + curr.aditivoAssentamentoLitros,
    areiaChapiscoM3: acc.areiaChapiscoM3 + curr.areiaChapiscoM3,
    areaChapiscoVal: acc.areaChapiscoVal + curr.areaChapiscoVal,
    areaGessoVal: acc.areaGessoVal + curr.areaGessoVal,
    gessoKg: acc.gessoKg + curr.gessoKgVal,
    areaRebocoVal: acc.areaRebocoVal + curr.areaRebocoVal,
    cimentoRebocoKg: acc.cimentoRebocoKg + curr.cimentoRebocoKg,
    calRebocoM3: acc.calRebocoM3 + curr.calRebocoM3,
    areiaRebocoM3: acc.areiaRebocoM3 + curr.areiaRebocoM3,
    aditivoRebocoLitros: acc.aditivoRebocoLitros + curr.aditivoRebocoLitros
  }), {
    areaAlvenaria: 0,
    totalBricksExact: 0,
    totalBricksCommercial: 0,
    cimentoKg: 0,
    cimentoChapiscoKg: 0,
    calM3: 0,
    areiaM3: 0,
    aditivoAssentamentoLitros: 0,
    areaChapiscoVal: 0,
    areiaChapiscoM3: 0,
    areaGessoVal: 0,
    gessoKg: 0,
    areaRebocoVal: 0,
    cimentoRebocoKg: 0,
    calRebocoM3: 0,
    areiaRebocoM3: 0,
    aditivoRebocoLitros: 0
  });

  const totals = {
    areaAlvenaria: Math.max(0, normalTotals.areaAlvenaria - calculatedDiscountRow.areaVal),
    totalBricksExact: Math.max(0, normalTotals.totalBricksExact - calculatedDiscountRow.totalBricksExact),
    totalBricksCommercial: Math.max(0, normalTotals.totalBricksCommercial - calculatedDiscountRow.totalBricksCommercial),
    cimentoKg: Math.max(0, normalTotals.cimentoKg - calculatedDiscountRow.cimentoKg),
    cimentoChapiscoKg: Math.max(0, normalTotals.cimentoChapiscoKg - calculatedDiscountRow.cimentoChapiscoKg),
    calM3: Math.max(0, normalTotals.calM3 - calculatedDiscountRow.calM3),
    areiaM3: Math.max(0, normalTotals.areiaM3 - calculatedDiscountRow.areiaM3),
    aditivoAssentamentoLitros: Math.max(0, normalTotals.aditivoAssentamentoLitros - calculatedDiscountRow.aditivoAssentamentoLitros),
    areaChapiscoVal: Math.max(0, normalTotals.areaChapiscoVal - calculatedDiscountRow.areaChapiscoVal),
    areiaChapiscoM3: Math.max(0, normalTotals.areiaChapiscoM3 - calculatedDiscountRow.areiaChapiscoM3),
    areaGessoVal: Math.max(0, normalTotals.areaGessoVal - calculatedDiscountRow.areaGessoVal),
    gessoKg: Math.max(0, normalTotals.gessoKg - calculatedDiscountRow.gessoKgVal),
    areaRebocoVal: Math.max(0, normalTotals.areaRebocoVal - calculatedDiscountRow.areaRebocoVal),
    cimentoRebocoKg: Math.max(0, normalTotals.cimentoRebocoKg - calculatedDiscountRow.cimentoRebocoKg),
    calRebocoM3: Math.max(0, normalTotals.calRebocoM3 - calculatedDiscountRow.calRebocoM3),
    areiaRebocoM3: Math.max(0, normalTotals.areiaRebocoM3 - calculatedDiscountRow.areiaRebocoM3),
    aditivoRebocoLitros: Math.max(0, normalTotals.aditivoRebocoLitros - calculatedDiscountRow.aditivoRebocoLitros)
  };

  // Helper to display empty if zero or near zero
  const displayValue = (val: number, decimals: number = 2) => {
    if (val === undefined || val === null || isNaN(val)) return '';
    const factor = Math.pow(10, decimals);
    const rounded = Math.round(val * factor) / factor;
    if (rounded === 0) return '';
    return formatNum(val, decimals);
  };

  // Helper for totals - shows 0,00 if there is any data in the table
  const displayTotal = (val: number, decimals: number = 2) => {
    if (normalTotals.areaAlvenaria === 0) return '';
    return formatNum(val, decimals);
  };

  // Rule 1: Validation and Table Locking
  const isConfigComplete = 
    aditivoAssentamento !== '' && 
    aditivoReboco !== '' &&
    tracoAssentamentoCimento !== '' &&
    tracoAssentamentoAreia !== '' &&
    rendimentoCimentoChapisco !== '' &&
    tracoChapiscoCimento !== '' &&
    tracoChapiscoAreia !== '' &&
    rendimentoCimentoReboco !== '' &&
    tracoRebocoCimento !== '' &&
    tracoRebocoAreia !== '' &&
    rendimentoGesso !== '';

  // Handle input changes
  const handleInputChange = (val: string, setter: (v: string) => void) => {
    const cleanVal = val.replace(/[^\d,.]/g, '');
    setter(cleanVal);
  };

  if (!isMounted) return null;

  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden space-y-0">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => setActiveTab('calc')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${activeTab === 'calc' ? 'bg-brand text-white' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Calculator className="size-4" />
          Orçamento / Cálculo
        </button>
        <button 
          onClick={() => setActiveTab('data')}
          className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${activeTab === 'data' ? 'bg-brand text-white' : 'text-slate-500 hover:bg-slate-50'}`}
        >
          <Database className="size-4" />
          Dados (Banco de Dados)
        </button>
      </div>

      {activeTab === 'calc' ? (
        <div className="space-y-6 p-6">
          <div className="flex items-center gap-2 text-brand">
            <LayoutGrid className="size-5" />
            <h2 className="text-lg font-bold">Cálculo de Alvenaria</h2>
          </div>

          {/* 1. DADOS (Parâmetros Globais) */}
          <div className="pt-2 space-y-4">
            <div className="flex items-center gap-2 text-slate-400 mb-2">
              <Database className="size-4" />
              <h3 className="text-sm font-bold uppercase tracking-wider">Dados (Parâmetros Globais)</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Grupo 1: ARGAMASSA DE ASSENTAMENTO */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <h4 className="text-[11px] font-black text-brand uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                  1. Argamassa de Assentamento
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">ADITIVO NA ARGAMASSA DE ASSENTAMENTO?</label>
                    <select 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-brand outline-none font-bold"
                      value={aditivoAssentamento}
                      onChange={(e) => setAditivoAssentamento(e.target.value as any)}
                    >
                      <option value="">SELECIONE...</option>
                      <option value="NÃO">NÃO</option>
                      <option value="SIM">SIM</option>
                    </select>
                  </div>
                  {aditivoAssentamento === 'SIM' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">ADITIVO USADO NA ARGAMASSA DE ASSENTAMENTO</label>
                      <select 
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-brand outline-none font-bold text-brand"
                        value={nomeAditivoAssentamento}
                        onChange={(e) => setNomeAditivoAssentamento(e.target.value)}
                      >
                        <option value="">SELECIONE O ADITIVO...</option>
                        {aditivos.map(a => (
                          <option key={a.id} value={a.nome}>{a.nome} ({a.rendimento} L/SACA)</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">TRAÇO DO DA ARGAMASSA DE ASSENTAMENTO</label>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 block text-center uppercase">Cim</span>
                        <input 
                          type="text"
                          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-brand outline-none font-bold"
                          value={tracoAssentamentoCimento}
                          onChange={(e) => handleInputChange(e.target.value, setTracoAssentamentoCimento)}
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 block text-center uppercase">Cal</span>
                        <input 
                          type="text"
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-brand outline-none font-bold"
                          value={tracoAssentamentoCal}
                          onChange={(e) => handleInputChange(e.target.value, setTracoAssentamentoCal)}
                          placeholder="VAZIO"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 block text-center uppercase">Areia</span>
                        <input 
                          type="text"
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-brand outline-none font-bold"
                          value={tracoAssentamentoAreia}
                          onChange={(e) => handleInputChange(e.target.value, setTracoAssentamentoAreia)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grupo 2: CHAPISCO */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <h4 className="text-[11px] font-black text-brand uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                  2. Chapisco
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase leading-tight">CHAPISCO: RENDIMENTO DE UMA SACA DE CIMENTO POR M²</label>
                    <input 
                      type="text"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-brand outline-none font-bold"
                      value={rendimentoCimentoChapisco}
                      onChange={(e) => handleInputChange(e.target.value, setRendimentoCimentoChapisco)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">TRAÇO DO CHAPISCO</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 block text-center uppercase">Cimento</span>
                        <input 
                          type="text"
                          className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-brand outline-none font-bold"
                          value={tracoChapiscoCimento}
                          onChange={(e) => handleInputChange(e.target.value, setTracoChapiscoCimento)}
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 block text-center uppercase">Areia</span>
                        <input 
                          type="text"
                          className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-brand outline-none font-bold"
                          value={tracoChapiscoAreia}
                          onChange={(e) => handleInputChange(e.target.value, setTracoChapiscoAreia)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grupo 3: REBOCO */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
                <h4 className="text-[11px] font-black text-brand uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">
                  3. Reboco
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">ADITIVO NO REBOCO?</label>
                    <select 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-brand outline-none font-bold"
                      value={aditivoReboco}
                      onChange={(e) => setAditivoReboco(e.target.value as any)}
                    >
                      <option value="">SELECIONE...</option>
                      <option value="NÃO">NÃO</option>
                      <option value="SIM">SIM</option>
                    </select>
                  </div>
                  {aditivoReboco === 'SIM' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase leading-tight">ADITIVO USADO NA ARGAMASSA DE ASSENTAMENTO</label>
                      <select 
                        className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-brand outline-none font-bold text-brand"
                        value={nomeAditivoReboco}
                        onChange={(e) => setNomeAditivoReboco(e.target.value)}
                      >
                        <option value="">SELECIONE O ADITIVO...</option>
                        {aditivos.map(a => (
                          <option key={a.id} value={a.nome}>{a.nome} ({a.rendimento} L/SACA)</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase leading-tight">REBOCO: RENDIMENTO DE UMA SACA DE CIMENTO POR M²</label>
                    <input 
                      type="text"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-brand outline-none font-bold"
                      value={rendimentoCimentoReboco}
                      onChange={(e) => handleInputChange(e.target.value, setRendimentoCimentoReboco)}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase leading-tight">REBOCO DE GESSO: RENDIMENTO DE UMA SACA DE GESSO POR M²</label>
                    <input 
                      type="text"
                      className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-brand outline-none font-bold"
                      value={rendimentoGesso}
                      onChange={(e) => handleInputChange(e.target.value, setRendimentoGesso)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Cadastro de Novos Aditivos */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 space-y-3">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cadastrar Novo Aditivo</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Nome da Marca</label>
                  <input 
                    type="text"
                    list="aditivos-padrao"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-brand outline-none font-bold"
                    value={newAditivoNome}
                    onChange={(e) => handleNewAditivoNomeChange(e.target.value)}
                    placeholder="EX: QUIMIKAL"
                  />
                  <datalist id="aditivos-padrao">
                    <option value="QUIMIKAL" />
                    <option value="VEDALIT" />
                    <option value="VIACAL" />
                    <option value="SIKANOL" />
                  </datalist>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Rendimento (L/SACA)</label>
                  <input 
                    type="text"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-brand outline-none font-bold"
                    value={newAditivoRendimento}
                    onChange={(e) => setNewAditivoRendimento(e.target.value)}
                    placeholder="EX: 0,10"
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={addAditivo}
                    className="w-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-bold py-1.5 rounded hover:bg-brand hover:text-white transition-all uppercase"
                  >
                    Salvar / Adicionar Aditivo
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Tabela de Paredes */}
          <div className="space-y-4">
            <div className="overflow-x-auto border rounded-lg border-slate-100 dark:border-slate-800 relative">
              <table className="w-full text-[10px] text-left border-collapse min-w-[1600px]">
                <thead>
                  {/* Nível 1: Título Geral */}
                  <tr className="bg-black">
                    <th colSpan={24} className="py-2 text-center font-bold text-[#ffff00] uppercase tracking-widest">
                      PAREDES
                    </th>
                  </tr>
                  {/* Nível 2: Categorias de Processo */}
                  <tr className="bg-slate-700 text-white font-bold">
                    <th className="p-2 border-r border-slate-600 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-400 text-brand focus:ring-brand"
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        checked={rows.length > 0 && rows.every(r => r.selected)}
                      />
                    </th>
                    <th colSpan={6} className="p-2 border-r border-slate-600 text-center uppercase">ALVENARIA</th>
                    <th colSpan={3} className="p-2 border-r border-slate-600 text-center uppercase">REBOCO DE GESSO</th>
                    <th colSpan={2} className="p-2 border-r border-slate-600 text-center uppercase">TIJOLOS (und)</th>
                    <th colSpan={3} className="p-2 border-r border-slate-600 text-center uppercase">ARGAMASSA DE ASSENTAMENTO</th>
                    <th colSpan={3} className="p-2 border-r border-slate-600 text-center uppercase">CHAPISCO</th>
                    <th colSpan={1} className="p-2 border-r border-slate-600 text-center uppercase">EMBOÇO</th>
                    <th colSpan={4} className="p-2 border-r border-slate-600 text-center uppercase">REBOCO</th>
                    <th colSpan={1} className="p-2 text-center uppercase">AÇÕES</th>
                  </tr>
                  {/* Nível 3: Subgrupos */}
                  <tr className="bg-[#fff8dc] text-black">
                    <th className="p-1 border-r border-slate-300"></th>
                    <th colSpan={4} className="p-1 border-r border-slate-300 text-center font-bold">DIMENSÕES PAREDE</th>
                    <th colSpan={2} className="p-1 border-r border-slate-300 text-center font-bold">TIPO DE TIJOLO</th>
                    <th colSpan={3} className="p-1 border-r border-slate-300"></th>
                    <th colSpan={2} className="p-1 border-r border-slate-300"></th>
                    <th colSpan={3} className="p-1 border-r border-slate-300"></th>
                    <th colSpan={3} className="p-1 border-r border-slate-300"></th>
                    <th colSpan={1} className="p-1 border-r border-slate-300"></th>
                    <th colSpan={4} className="p-1 border-r border-slate-300"></th>
                    <th colSpan={1} className="p-1"></th>
                  </tr>
                  {/* Nível 4: Colunas de Dados */}
                  <tr className="bg-white text-black border-b border-slate-200">
                    <th className="p-1 border-r border-slate-200 text-center">Sel.</th>
                    <th className="p-1 border-r border-slate-200 text-center relative group">
                      <div className="flex items-center justify-center gap-1">
                        Identificação da Parede
                        <button 
                          onMouseEnter={() => setShowTooltip(true)}
                          onMouseLeave={() => setShowTooltip(false)}
                          onClick={() => setShowTooltip(!showTooltip)}
                          className="text-brand hover:text-brand-dark transition-colors"
                        >
                          <HelpCircle className="size-3" />
                        </button>
                      </div>
                      <AnimatePresence>
                        {showTooltip && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute z-50 left-0 top-full mt-2 w-64 p-3 bg-slate-800 text-white text-[10px] leading-relaxed rounded-lg shadow-xl font-normal text-left"
                          >
                            Use este campo para se organizar. Padrão sugerido: PA + Número + V ou H (Ex: PA1V ou PA2H). 
                            Use &apos;V&apos; (Vertical) para paredes medidas de fora a fora, e &apos;H&apos; (Horizontal) para medidas por dentro. 
                            Isso é apenas um lembrete visual para ajudar você a inserir as medidas corretas e evitar a contagem dupla nos cantos da alvenaria.
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </th>
                    <th className="p-1 border-r border-slate-200 text-center">Comprimento (m)</th>
                    <th className="p-1 border-r border-slate-200 text-center">Altura (m)</th>
                    <th className="p-1 border-r border-slate-200 text-center">Área de Alvenaria (m²)</th>
                    <th className="p-1 border-r border-slate-200">Tijolo (L x A x C)</th>
                    <th className="p-1 border-r border-slate-200 text-center">Assentamento</th>
                    <th className="p-1 border-r border-slate-200 text-center">Paredes com reboco de gesso</th>
                    <th className="p-1 border-r border-slate-200 text-center">Área com reboco de Gesso (m²)</th>
                    <th className="p-1 border-r border-slate-200 text-center">Gesso (kg)</th>
                    <th className="p-1 border-r border-slate-200 text-center font-bold">Tijolos (und)</th>
                    <th className="p-1 border-r border-slate-200 text-center font-bold">Tijolos (unidade inteira)</th>
                    <th className="p-1 border-r border-slate-200 text-center">Cimento (Kg)</th>
                    <th className="p-1 border-r border-slate-200 text-center">Cal (m³)</th>
                    <th className="p-1 border-r border-slate-200 text-center">Areia (m³)</th>
                    <th className="p-1 border-r border-slate-200 text-center">Área de Chapisco (m²)</th>
                    <th className="p-1 border-r border-slate-200 text-center">Cimento / Chapisco (kg)</th>
                    <th className="p-1 border-r border-slate-200 text-center">Areia / Chapisco (m³)</th>
                    <th className="p-1 border-r border-slate-200 text-center">Área de Emboço (m²) - Calculado na Aba Emboço</th>
                    <th className="p-1 border-r border-slate-200 text-center">Reboco: Chapisco - Emboço (m²)</th>
                    <th className="p-1 border-r border-slate-200 text-center">Cimento (kg)</th>
                    <th className="p-1 border-r border-slate-200 text-center">Cal (m³)</th>
                    <th className="p-1 border-r border-slate-200 text-center">Areia (m³)</th>
                    <th className="p-1 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className={`divide-y divide-slate-100 dark:divide-slate-800 ${!isConfigComplete ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                  {calculatedRows.map((row) => (
                    <tr key={row.id} className={`${row.selected ? 'bg-brand-light/10 dark:bg-brand/5' : ''} hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors`}>
                      <td className="p-1 border-r text-center">
                        <input 
                          type="checkbox" 
                          disabled={!isConfigComplete}
                          className="rounded border-slate-300 text-brand focus:ring-brand disabled:opacity-50"
                          checked={row.selected}
                          onChange={(e) => updateRow(row.id, 'selected', e.target.checked)}
                        />
                      </td>
                      <td className="p-1 border-r bg-white dark:bg-slate-900">
                        <input 
                          disabled={!isConfigComplete}
                          className="w-full bg-transparent border-none p-0 text-[10px] text-center font-bold text-brand focus:ring-0 uppercase disabled:cursor-not-allowed" 
                          type="text" 
                          value={row.idParede}
                          onChange={(e) => updateRow(row.id, 'idParede', e.target.value)}
                          placeholder="EX: PA1V"
                        />
                      </td>
                      <td className="p-1 border-r bg-white dark:bg-slate-900">
                        <input 
                          disabled={!isConfigComplete}
                          className="w-full bg-transparent border-none p-0 text-[10px] text-center font-bold text-brand focus:ring-0 disabled:cursor-not-allowed" 
                          type="text" 
                          value={row.comprimento}
                          onChange={(e) => updateRow(row.id, 'comprimento', e.target.value.replace(/[^\d,.]/g, ''))}
                          onBlur={() => {
                            if (row.comprimento !== '') {
                              updateRow(row.id, 'comprimento', formatNum(parseNum(row.comprimento)));
                            }
                          }}
                        />
                      </td>
                      <td className="p-1 border-r bg-white dark:bg-slate-900">
                        <input 
                          disabled={!isConfigComplete}
                          className="w-full bg-transparent border-none p-0 text-[10px] text-center font-bold text-brand focus:ring-0 disabled:cursor-not-allowed" 
                          type="text" 
                          value={row.altura}
                          onChange={(e) => updateRow(row.id, 'altura', e.target.value.replace(/[^\d,.]/g, ''))}
                          onBlur={() => {
                            if (row.altura !== '') {
                              updateRow(row.id, 'altura', formatNum(parseNum(row.altura)));
                            }
                          }}
                        />
                      </td>
                      <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">
                        {formatNum(row.areaVal)}
                      </td>
                      <td className="p-1 border-r bg-white dark:bg-slate-900">
                        <select 
                          disabled={!isConfigComplete}
                          className="w-full bg-transparent border-none p-0 text-[10px] focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                          value={row.selectedBrickType}
                          onChange={(e) => updateRow(row.id, 'selectedBrickType', e.target.value)}
                        >
                          {BRICK_DATABASE.map(brick => (
                            <option key={brick.type} value={brick.type}>{brick.type}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-1 border-r bg-white dark:bg-slate-900 text-center">
                        <select 
                          disabled={!isConfigComplete}
                          className="w-full bg-transparent border-none p-0 text-[10px] text-center focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                          value={row.assentamentoType}
                          onChange={(e) => updateRow(row.id, 'assentamentoType', e.target.value as any)}
                        >
                          <option value="1/2 VEZ">1/2 VEZ</option>
                          <option value="1 VEZ">1 VEZ</option>
                        </select>
                      </td>
                      <td className="p-1 border-r bg-white dark:bg-slate-900 text-center">
                        <select 
                          disabled={!isConfigComplete}
                          className="w-full bg-transparent border-none p-0 text-[10px] text-center focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                          value={row.rebocoGessoType}
                          onChange={(e) => updateRow(row.id, 'rebocoGessoType', e.target.value as any)}
                        >
                          <option value="NÃO HÁ">NÃO HÁ</option>
                          <option value="1 LADO">1 LADO</option>
                          <option value="2 LADOS">2 LADOS</option>
                        </select>
                      </td>
                      <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center text-slate-500 cursor-not-allowed">{displayValue(row.areaGessoVal)}</td>
                      <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">{displayValue(row.gessoKgVal)}</td>
                      <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">{displayValue(row.totalBricksExact)}</td>
                      <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">{row.totalBricksCommercial || ''}</td>
                      <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center text-slate-500 cursor-not-allowed">{displayValue(row.cimentoKg)}</td>
                      <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center text-slate-500 cursor-not-allowed">{displayValue(row.calM3, 2)}</td>
                      <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center text-slate-500 cursor-not-allowed">{displayValue(row.areiaM3, 2)}</td>
                      <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center text-slate-500 cursor-not-allowed">{displayValue(row.areaChapiscoVal)}</td>
                      <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center text-slate-500 cursor-not-allowed">{displayValue(row.cimentoChapiscoKg)}</td>
                      <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center text-slate-500 cursor-not-allowed">{displayValue(row.areiaChapiscoM3, 2)}</td>
                      <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center text-slate-500 cursor-not-allowed"></td>
                      <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center text-slate-500 cursor-not-allowed"></td>
                      <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center text-slate-500 cursor-not-allowed"></td>
                      <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center text-slate-500 cursor-not-allowed"></td>
                      <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center text-slate-500 cursor-not-allowed"></td>
                      <td className="p-1 text-center">
                        <button 
                          onClick={() => deleteRow(row.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          title="Excluir Parede"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* Linha de Desconto Fixa */}
                  <tr className="bg-slate-100 dark:bg-slate-800/80 font-bold border-t-2 border-slate-300 dark:border-slate-600">
                    <td colSpan={4} className="p-2 border-r border-slate-300 dark:border-slate-600 text-right text-[10px] uppercase">
                      ÁREA DESCONTADA DE ALVENARIA &gt; 2,00 M² (Aba Esquadrias)
                    </td>
                    <td 
                      className="p-1 border-r border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-red-600 cursor-not-allowed"
                      data-integracao="soma-esquadrias"
                      title="O valor 2.90 é temporário. No futuro, essa variável será alimentada automaticamente pelo resultado da soma total da aba/tabela de Esquadrias."
                    >
                      {/* TODO: INTEGRAÇÃO ESQUADRIAS */}
                      {discountRow.manualArea}
                    </td>
                    <td className="p-1 border-r border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900">
                      <select 
                        className="w-full bg-transparent border-none p-0 text-[10px] focus:ring-0 cursor-pointer"
                        value={discountRow.selectedBrickType}
                        onChange={(e) => updateRow(discountRow.id, 'selectedBrickType', e.target.value)}
                      >
                        {BRICK_DATABASE.map(brick => (
                          <option key={brick.type} value={brick.type}>{brick.type}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-1 border-r border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-center">
                      <select 
                        className="w-full bg-transparent border-none p-0 text-[10px] text-center focus:ring-0 cursor-pointer"
                        value={discountRow.assentamentoType}
                        onChange={(e) => updateRow(discountRow.id, 'assentamentoType', e.target.value as any)}
                      >
                        <option value="1/2 VEZ">1/2 VEZ</option>
                        <option value="1 VEZ">1 VEZ</option>
                      </select>
                    </td>
                    <td className="p-1 border-r border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-center">
                      <select 
                        className="w-full bg-transparent border-none p-0 text-[10px] text-center focus:ring-0 cursor-pointer"
                        value={discountRow.rebocoGessoType}
                        onChange={(e) => updateRow(discountRow.id, 'rebocoGessoType', e.target.value as any)}
                      >
                        <option value="NÃO HÁ">NÃO HÁ</option>
                        <option value="1 LADO">1 LADO</option>
                        <option value="2 LADOS">2 LADOS</option>
                      </select>
                    </td>
                    <td className="p-1 border-r border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center text-red-600">{displayValue(calculatedDiscountRow.areaGessoVal)}</td>
                    <td className="p-1 border-r border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-red-600">{displayValue(calculatedDiscountRow.gessoKgVal)}</td>
                    <td className="p-1 border-r border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-red-600">{displayValue(calculatedDiscountRow.totalBricksExact)}</td>
                    <td className="p-1 border-r border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-red-600">{calculatedDiscountRow.totalBricksCommercial || ''}</td>
                    <td className="p-1 border-r border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center text-red-600">{displayValue(calculatedDiscountRow.cimentoKg)}</td>
                    <td className="p-1 border-r border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center text-red-600">{displayValue(calculatedDiscountRow.calM3, 2)}</td>
                    <td className="p-1 border-r border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center text-red-600">{displayValue(calculatedDiscountRow.areiaM3, 2)}</td>
                    <td className="p-1 border-r border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center text-red-600">{displayValue(calculatedDiscountRow.areaChapiscoVal)}</td>
                    <td className="p-1 border-r border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center text-red-600">{displayValue(calculatedDiscountRow.cimentoChapiscoKg)}</td>
                    <td className="p-1 border-r border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center text-red-600">{displayValue(calculatedDiscountRow.areiaChapiscoM3, 2)}</td>
                    <td className="p-1 border-r border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center text-red-600"></td>
                    <td className="p-1 border-r border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 text-center text-red-600"></td>
                    <td className="p-1 text-center"></td>
                  </tr>
                  {/* Linha de Total com Desconto */}
                  <tr className="bg-brand/10 dark:bg-brand/20 font-black border-t-2 border-brand/30">
                    <td colSpan={4} className="p-2 border-r border-brand/30 text-right text-[10px] uppercase text-brand">
                      TOTAL (COM DESCONTO)
                    </td>
                    <td className="p-1 border-r border-brand/30 text-center text-brand">
                      {formatNum(totals.areaAlvenaria)}
                    </td>
                    <td className="p-1 border-r border-brand/30"></td>
                    <td className="p-1 border-r border-brand/30"></td>
                    <td className="p-1 border-r border-brand/30 text-center text-brand"></td>
                    <td className="p-1 border-r border-brand/30 text-center text-brand">{displayValue(totals.areaGessoVal)}</td>
                    <td className="p-1 border-r border-brand/30 text-center text-brand">{displayValue(totals.gessoKg)}</td>
                    <td className="p-1 border-r border-brand/30 text-center text-brand">{displayTotal(totals.totalBricksExact)}</td>
                    <td className="p-1 border-r border-brand/30 text-center text-brand">{normalTotals.areaAlvenaria > 0 ? totals.totalBricksCommercial : ''}</td>
                    <td className="p-1 border-r border-brand/30 text-center text-brand">{displayTotal(totals.cimentoKg)}</td>
                    <td className="p-1 border-r border-brand/30 text-center text-brand">{displayValue(totals.calM3, 2)}</td>
                    <td className="p-1 border-r border-brand/30 text-center text-brand">{displayTotal(totals.areiaM3, 2)}</td>
                    <td className="p-1 border-r border-brand/30 text-center text-brand">{displayTotal(totals.areaChapiscoVal)}</td>
                    <td className="p-1 border-r border-brand/30 text-center text-brand">{displayTotal(totals.cimentoChapiscoKg)}</td>
                    <td className="p-1 border-r border-brand/30 text-center text-brand">{displayTotal(totals.areiaChapiscoM3, 2)}</td>
                    <td className="p-1 border-r border-brand/30 text-center text-brand"></td>
                    <td className="p-1 border-r border-brand/30 text-center text-brand">{displayTotal(totals.areaRebocoVal)}</td>
                    <td className="p-1 border-r border-brand/30 text-center text-brand">{displayTotal(totals.cimentoRebocoKg)}</td>
                    <td className="p-1 border-r border-brand/30 text-center text-brand">{displayValue(totals.calRebocoM3, 2)}</td>
                    <td className="p-1 border-r border-brand/30 text-center text-brand">{displayTotal(totals.areiaRebocoM3, 2)}</td>
                    <td className="p-1 text-center"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Table Controls */}
            <div className="flex flex-col gap-2">
              {!isConfigComplete && (
                <p className="text-[10px] font-bold text-red-500 animate-pulse">
                  ⚠️ Preencha as configurações de argamassa, chapisco e reboco acima para liberar a tabela.
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={addRow}
                  disabled={!isConfigComplete}
                  className="flex items-center gap-2 px-4 py-2 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <Plus className="size-4" />
                  Adicionar Nova Parede
                </button>
                <button 
                  onClick={deleteSelectedRows}
                  disabled={!isConfigComplete || !rows.some(r => r.selected)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  <Trash2 className="size-4" />
                  Excluir Linhas Selecionadas
                </button>
                <button 
                  onClick={clearTable}
                  disabled={!isConfigComplete}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <RotateCcw className="size-4" />
                  Limpar Tabela
                </button>
              </div>
            </div>
          </div>

          {/* 3. Resumo de Materiais e Consulta Técnica */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            <MaterialSummary 
              calculatedRows={calculatedRows}
              calculatedDiscountRow={calculatedDiscountRow}
              totals={totals}
              nomeAditivoAssentamento={nomeAditivoAssentamento}
              nomeAditivoReboco={nomeAditivoReboco}
            />
            <TechnicalConsultation />
          </div>
        </div>
      ) : (
        <div className="p-6 overflow-x-auto">
          <div className="flex items-center gap-2 text-brand mb-6">
            <Database className="size-5" />
            <h2 className="text-lg font-bold">Banco de Dados de Tijolos</h2>
          </div>
          
          <table className="w-full text-xs border-collapse border border-slate-200">
            <thead>
              <tr className="bg-slate-100">
                <th className="border border-slate-300 p-2 text-center font-bold uppercase" rowSpan={2}>Tipos de Tijolos (L x A x C)</th>
                <th className="border border-slate-300 p-2 text-center font-bold uppercase" colSpan={2}>Quantidade por m²</th>
                <th className="border border-slate-300 p-2 text-center font-bold uppercase" colSpan={2}>Alvenaria (Rendimento Cimento m²/saca)</th>
              </tr>
              <tr className="bg-slate-50">
                <th className="border border-slate-300 p-2 text-center font-bold">1/2 VEZ</th>
                <th className="border border-slate-300 p-2 text-center font-bold">1 VEZ</th>
                <th className="border border-slate-300 p-2 text-center font-bold">1/2 VEZ</th>
                <th className="border border-slate-300 p-2 text-center font-bold">1 VEZ</th>
              </tr>
            </thead>
            <tbody>
              {BRICK_DATABASE.map((brick, index) => (
                <tr key={brick.type} className="hover:bg-slate-50 transition-colors">
                  <td className={`border border-slate-300 p-2 text-center font-medium bg-yellow-100 ${index === 0 ? 'border-2 border-green-500' : ''}`}>
                    {brick.type}
                  </td>
                  <td className="border border-slate-300 p-2 text-center">{brick.qtyHalf}</td>
                  <td className="border border-slate-300 p-2 text-center">{brick.qtyFull}</td>
                  <td className="border border-slate-300 p-2 text-center">{brick.yieldHalf}</td>
                  <td className="border border-slate-300 p-2 text-center">{brick.yieldFull}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}


