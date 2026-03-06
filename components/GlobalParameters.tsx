'use client';

import React from 'react';
import { Database } from 'lucide-react';
import { Aditivo, CalculationParams } from '@/lib/utils/calculations';

interface GlobalParametersProps {
  params: CalculationParams;
  updateParams: (updates: Partial<CalculationParams>) => void;
  newAditivoNome: string;
  setNewAditivoNome: (val: string) => void;
  newAditivoRendimento: string;
  setNewAditivoRendimento: (val: string) => void;
  addAditivo: () => void;
  handleNewAditivoNomeChange: (val: string) => void;
}

export default function GlobalParameters({
  params,
  updateParams,
  newAditivoNome,
  setNewAditivoNome,
  newAditivoRendimento,
  setNewAditivoRendimento,
  addAditivo,
  handleNewAditivoNomeChange
}: GlobalParametersProps) {
  
  const handleInputChange = (val: string, field: keyof CalculationParams) => {
    const cleanVal = val.replace(/[^\d,.]/g, '');
    updateParams({ [field]: cleanVal });
  };

  return (
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
                value={params.aditivoAssentamento}
                onChange={(e) => updateParams({ aditivoAssentamento: e.target.value as any })}
              >
                <option value="">SELECIONE...</option>
                <option value="NÃO">NÃO</option>
                <option value="SIM">SIM</option>
              </select>
            </div>
            {params.aditivoAssentamento === 'SIM' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">ADITIVO USADO NA ARGAMASSA DE ASSENTAMENTO</label>
                <select 
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-brand outline-none font-bold text-brand"
                  value={params.nomeAditivoAssentamento}
                  onChange={(e) => updateParams({ nomeAditivoAssentamento: e.target.value })}
                >
                  <option value="">SELECIONE O ADITIVO...</option>
                  {params.aditivos.map(a => (
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
                    value={params.tracoAssentamentoCimento}
                    onChange={(e) => handleInputChange(e.target.value, 'tracoAssentamentoCimento')}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 block text-center uppercase">Cal</span>
                  <input 
                    type="text"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-brand outline-none font-bold"
                    value={params.tracoAssentamentoCal}
                    onChange={(e) => handleInputChange(e.target.value, 'tracoAssentamentoCal')}
                    placeholder="VAZIO"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 block text-center uppercase">Areia</span>
                  <input 
                    type="text"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-brand outline-none font-bold"
                    value={params.tracoAssentamentoAreia}
                    onChange={(e) => handleInputChange(e.target.value, 'tracoAssentamentoAreia')}
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
                value={params.rendimentoCimentoChapisco}
                onChange={(e) => handleInputChange(e.target.value, 'rendimentoCimentoChapisco')}
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
                    value={params.tracoChapiscoCimento}
                    onChange={(e) => handleInputChange(e.target.value, 'tracoChapiscoCimento')}
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-400 block text-center uppercase">Areia</span>
                  <input 
                    type="text"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1 text-xs text-center focus:ring-1 focus:ring-brand outline-none font-bold"
                    value={params.tracoChapiscoAreia}
                    onChange={(e) => handleInputChange(e.target.value, 'tracoChapiscoAreia')}
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
                value={params.aditivoReboco}
                onChange={(e) => updateParams({ aditivoReboco: e.target.value as any })}
              >
                <option value="">SELECIONE...</option>
                <option value="NÃO">NÃO</option>
                <option value="SIM">SIM</option>
              </select>
            </div>
            {params.aditivoReboco === 'SIM' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase leading-tight">ADITIVO USADO NA ARGAMASSA DE ASSENTAMENTO</label>
                <select 
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-brand outline-none font-bold text-brand"
                  value={params.nomeAditivoReboco}
                  onChange={(e) => updateParams({ nomeAditivoReboco: e.target.value })}
                >
                  <option value="">SELECIONE O ADITIVO...</option>
                  {params.aditivos.map(a => (
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
                value={params.rendimentoCimentoReboco}
                onChange={(e) => handleInputChange(e.target.value, 'rendimentoCimentoReboco')}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase leading-tight">REBOCO DE GESSO: RENDIMENTO DE UMA SACA DE GESSO POR M²</label>
              <input 
                type="text"
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded px-2 py-1.5 text-xs focus:ring-1 focus:ring-brand outline-none font-bold"
                value={params.rendimentoGesso}
                onChange={(e) => handleInputChange(e.target.value, 'rendimentoGesso')}
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
  );
}
