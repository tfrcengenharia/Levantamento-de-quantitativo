'use client';

import React from 'react';
import { BRICK_DATABASE } from '@/data/brickDatabase';

interface MaterialSummaryProps {
  calculatedRows: any[];
  calculatedDiscountRow: any;
  totals: any;
  nomeAditivoAssentamento?: string;
  nomeAditivoReboco?: string;
}

export default function MaterialSummary({ 
  calculatedRows, 
  calculatedDiscountRow, 
  totals,
  nomeAditivoAssentamento,
  nomeAditivoReboco
}: MaterialSummaryProps) {
  // Group bricks by type
  const brickSummary = BRICK_DATABASE.map(brick => {
    const totalForType = calculatedRows
      .filter(row => row.selectedBrickType === brick.type)
      .reduce((acc, curr) => acc + curr.totalBricksExact, 0);
    
    const discountForType = calculatedDiscountRow.selectedBrickType === brick.type 
      ? calculatedDiscountRow.totalBricksExact 
      : 0;

    return {
      type: brick.type,
      quantity: Math.ceil(totalForType - discountForType)
    };
  });

  const formatNum = (val: number, decimals: number = 2) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(val);
  };

  const hasData = totals.areaAlvenaria > 0;

  if (!hasData) return null;

  return (
    <div className="mt-8 space-y-4">
      <div className="overflow-x-auto border-2 border-black">
        <table className="w-full text-[11px] border-collapse bg-white">
          <thead>
            <tr className="bg-black text-white border-b-2 border-black">
              <th colSpan={4} className="py-1.5 text-center font-bold uppercase tracking-widest text-xs">
                RESUMO DOS MATERIAIS
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black">
            {/* Bricks */}
            {brickSummary.map((brick, index) => (
              <tr key={index} className="border-b border-black">
                <td className="p-1.5 border-r border-black font-bold uppercase w-1/4 bg-white">TIJOLO</td>
                <td className="p-1.5 border-r border-black w-1/3 bg-white">{brick.type}</td>
                <td className="p-1.5 border-r border-black text-center font-bold w-1/4 bg-white text-sm">
                  {brick.quantity > 0 ? formatNum(brick.quantity, 0) : ''}
                </td>
                <td className="p-1.5 text-center font-bold w-1/6 bg-white">Und</td>
              </tr>
            ))}

            {/* Cimento */}
            <tr className="border-b border-black">
              <td className="p-1.5 border-r border-black font-bold uppercase bg-white">CIMENTO</td>
              <td className="p-1.5 border-r border-black bg-white"></td>
              <td className="p-1.5 border-r border-black text-center font-bold bg-white text-sm">
                {formatNum(Math.ceil((totals.cimentoKg + totals.cimentoChapiscoKg + totals.cimentoRebocoKg) / 50), 0)}
              </td>
              <td className="p-1.5 text-center font-bold bg-white">SACA</td>
            </tr>

            {/* Areia */}
            <tr className="border-b border-black">
              <td className="p-1.5 border-r border-black font-bold uppercase bg-white">AREIA</td>
              <td className="p-1.5 border-r border-black bg-white"></td>
              <td className="p-1.5 border-r border-black text-center font-bold bg-white text-sm">
                {formatNum(totals.areiaM3 + totals.areiaChapiscoM3 + totals.areiaRebocoM3, 2)}
              </td>
              <td className="p-1.5 text-center font-bold bg-white">m³</td>
            </tr>

            {/* Gesso */}
            <tr className="border-b border-black">
              <td className="p-1.5 border-r border-black font-bold uppercase bg-white">GESSO PARA REBOCO</td>
              <td className="p-1.5 border-r border-black bg-white"></td>
              <td className="p-1.5 border-r border-black text-center font-bold bg-white text-sm">
                {formatNum(Math.ceil(totals.gessoKg / 40), 0)}
              </td>
              <td className="p-1.5 text-center font-bold bg-white">SACA 40KG</td>
            </tr>

            {/* Aditivo */}
            <tr className="border-b border-black">
              <td className="p-1.5 border-r border-black font-bold uppercase bg-white">
                {nomeAditivoAssentamento || nomeAditivoReboco || 'ADITIVO'}
              </td>
              <td className="p-1.5 border-r border-black bg-white"></td>
              <td className="p-1.5 border-r border-black text-center font-bold bg-white text-sm">
                {formatNum(totals.aditivoAssentamentoLitros + totals.aditivoRebocoLitros, 2)}
              </td>
              <td className="p-1.5 text-center font-bold bg-white">L</td>
            </tr>

            {/* Cal */}
            <tr>
              <td className="p-1.5 border-r border-black font-bold uppercase bg-white">CAL</td>
              <td className="p-1.5 border-r border-black bg-white"></td>
              <td className="p-1.5 border-r border-black text-center font-bold bg-white text-sm">
                {formatNum(Math.ceil((totals.calM3 + totals.calRebocoM3) / 0.036), 0)}
              </td>
              <td className="p-1.5 text-center font-bold bg-white">SACA</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
