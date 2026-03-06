'use client';

import React, { useState } from 'react';
import { HelpCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BRICK_DATABASE } from '@/data/brickDatabase';
import { WallRow } from '@/lib/utils/calculations';
import { formatNum, parseNum } from '@/lib/utils/numbers';

interface WallTableProps {
  rows: any[];
  discountRow: any;
  updateRow: (id: string, field: keyof WallRow, value: any) => void;
  deleteRow: (id: string) => void;
  toggleSelectAll: (checked: boolean) => void;
  isConfigComplete: boolean;
}

export default function WallTable({
  rows,
  discountRow,
  updateRow,
  deleteRow,
  toggleSelectAll,
  isConfigComplete
}: WallTableProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
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
          {rows.map((row) => (
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
              <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">
                {formatNum(row.areaGessoVal)}
              </td>
              <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">
                {formatNum(row.gessoKgVal)}
              </td>
              <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">
                {formatNum(row.totalBricksExact)}
              </td>
              <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">
                {row.totalBricksCommercial}
              </td>
              <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">
                {formatNum(row.cimentoKg)}
              </td>
              <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">
                {formatNum(row.calM3, 3)}
              </td>
              <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">
                {formatNum(row.areiaM3, 3)}
              </td>
              <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">
                {formatNum(row.areaChapiscoVal)}
              </td>
              <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">
                {formatNum(row.cimentoChapiscoKg)}
              </td>
              <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">
                {formatNum(row.areiaChapiscoM3, 3)}
              </td>
              <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">
                0,00
              </td>
              <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">
                {formatNum(row.areaRebocoVal)}
              </td>
              <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">
                {formatNum(row.cimentoRebocoKg)}
              </td>
              <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">
                {formatNum(row.calRebocoM3, 3)}
              </td>
              <td className="p-1 border-r bg-slate-50 dark:bg-slate-800/50 text-center font-bold text-slate-500 cursor-not-allowed">
                {formatNum(row.areiaRebocoM3, 3)}
              </td>
              <td className="p-1 text-center">
                <button 
                  onClick={() => deleteRow(row.id)}
                  className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                  title="Excluir Parede"
                >
                  <Trash2 className="size-3" />
                </button>
              </td>
            </tr>
          ))}

          {/* Linha de Desconto */}
          <tr className="bg-red-50/50 dark:bg-red-900/10 font-bold border-t-2 border-slate-200">
            <td className="p-1 border-r text-center"></td>
            <td className="p-1 border-r text-center text-red-600 uppercase">DESCONTO</td>
            <td className="p-1 border-r text-center text-slate-400 italic">ÁREA MANUAL</td>
            <td className="p-1 border-r text-center text-slate-400 italic">---</td>
            <td className="p-1 border-r text-center">
              <input 
                disabled={!isConfigComplete}
                className="w-full bg-transparent border-none p-0 text-[10px] text-center font-bold text-red-600 focus:ring-0 disabled:cursor-not-allowed" 
                type="text" 
                value={discountRow.manualArea}
                onChange={(e) => updateRow('discount-row', 'manualArea', e.target.value.replace(/[^\d,.]/g, ''))}
                onBlur={() => {
                  if (discountRow.manualArea !== '') {
                    updateRow('discount-row', 'manualArea', formatNum(parseNum(discountRow.manualArea)));
                  }
                }}
              />
            </td>
            <td className="p-1 border-r text-center">
              <select 
                disabled={!isConfigComplete}
                className="w-full bg-transparent border-none p-0 text-[10px] focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                value={discountRow.selectedBrickType}
                onChange={(e) => updateRow('discount-row', 'selectedBrickType', e.target.value)}
              >
                {BRICK_DATABASE.map(brick => (
                  <option key={brick.type} value={brick.type}>{brick.type}</option>
                ))}
              </select>
            </td>
            <td className="p-1 border-r text-center">
              <select 
                disabled={!isConfigComplete}
                className="w-full bg-transparent border-none p-0 text-[10px] text-center focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                value={discountRow.assentamentoType}
                onChange={(e) => updateRow('discount-row', 'assentamentoType', e.target.value as any)}
              >
                <option value="1/2 VEZ">1/2 VEZ</option>
                <option value="1 VEZ">1 VEZ</option>
              </select>
            </td>
            <td className="p-1 border-r text-center">
              <select 
                disabled={!isConfigComplete}
                className="w-full bg-transparent border-none p-0 text-[10px] text-center focus:ring-0 cursor-pointer disabled:cursor-not-allowed"
                value={discountRow.rebocoGessoType}
                onChange={(e) => updateRow('discount-row', 'rebocoGessoType', e.target.value as any)}
              >
                <option value="NÃO HÁ">NÃO HÁ</option>
                <option value="1 LADO">1 LADO</option>
                <option value="2 LADOS">2 LADOS</option>
              </select>
            </td>
            <td className="p-1 border-r text-center text-red-600">
              {formatNum(discountRow.areaGessoVal)}
            </td>
            <td className="p-1 border-r text-center text-red-600">
              {formatNum(discountRow.gessoKgVal)}
            </td>
            <td className="p-1 border-r text-center text-red-600">
              {formatNum(discountRow.totalBricksExact)}
            </td>
            <td className="p-1 border-r text-center text-red-600">
              {discountRow.totalBricksCommercial}
            </td>
            <td className="p-1 border-r text-center text-red-600">
              {formatNum(discountRow.cimentoKg)}
            </td>
            <td className="p-1 border-r text-center text-red-600">
              {formatNum(discountRow.calM3, 3)}
            </td>
            <td className="p-1 border-r text-center text-red-600">
              {formatNum(discountRow.areiaM3, 3)}
            </td>
            <td className="p-1 border-r text-center text-red-600">
              {formatNum(discountRow.areaChapiscoVal)}
            </td>
            <td className="p-1 border-r text-center text-red-600">
              {formatNum(discountRow.cimentoChapiscoKg)}
            </td>
            <td className="p-1 border-r text-center text-red-600">
              {formatNum(discountRow.areiaChapiscoM3, 3)}
            </td>
            <td className="p-1 border-r text-center">0,00</td>
            <td className="p-1 border-r text-center text-red-600">
              {formatNum(discountRow.areaRebocoVal)}
            </td>
            <td className="p-1 border-r text-center text-red-600">
              {formatNum(discountRow.cimentoRebocoKg)}
            </td>
            <td className="p-1 border-r text-center text-red-600">
              {formatNum(discountRow.calRebocoM3, 3)}
            </td>
            <td className="p-1 border-r text-center text-red-600">
              {formatNum(discountRow.areiaRebocoM3, 3)}
            </td>
            <td className="p-1"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
