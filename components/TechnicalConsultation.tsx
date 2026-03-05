'use client';

import React from 'react';

export default function TechnicalConsultation() {
  return (
    <div className="mt-8 space-y-8">
      {/* Tabela A: Rendimentos Básicos */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Tabela A: Rendimentos Básicos (Consulta)
        </h3>
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
          <table className="w-full text-[10px] border-collapse bg-white dark:bg-slate-900">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                <th className="p-2 text-left border-r border-slate-200 dark:border-slate-700">Aplicação</th>
                <th className="p-2 text-left border-r border-slate-200 dark:border-slate-700">Traço</th>
                <th className="p-2 text-center">Rendimento por saco de cimento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              <tr>
                <td className="p-2 border-r border-slate-200 dark:border-slate-700 font-medium">Alvenaria de tijolos de barro cozido (maciço)</td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-700">1 lata de cimento / 2 latas de cal / 8 latas de areia</td>
                <td className="p-2 text-center font-bold">10m²</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-slate-200 dark:border-slate-700 font-medium">Alvenaria de tijolos baianos ou furados</td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-700">1 lata de cimento / 2 latas de cal / 8 latas de areia</td>
                <td className="p-2 text-center font-bold">16m²</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-slate-200 dark:border-slate-700 font-medium">Alvenaria de blocos de concreto</td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-700">1 lata de cimento / 1/2 lata de cal / 6 latas de areia</td>
                <td className="p-2 text-center font-bold">30m²</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabela B: Argamassas para revestimento */}
      <div className="space-y-2">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Tabela B: Argamassas para revestimento (Consulta)
        </h3>
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
          <table className="w-full text-[10px] border-collapse bg-white dark:bg-slate-900">
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                <th className="p-2 text-left border-r border-slate-200 dark:border-slate-700">Aplicação</th>
                <th className="p-2 text-left border-r border-slate-200 dark:border-slate-700">Traço</th>
                <th className="p-2 text-center border-r border-slate-200 dark:border-slate-700">Rendimento por saco de cimento (50kg)</th>
                <th className="p-2 text-left">Dica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              <tr>
                <td className="p-2 border-r border-slate-200 dark:border-slate-700 font-medium">Chapisco</td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-700">1 lata de cimento / 3 latas de areia</td>
                <td className="p-2 text-center border-r border-slate-200 dark:border-slate-700 font-bold">30m²</td>
                <td className="p-2 text-slate-500 dark:text-slate-400 italic">O chapisco é a base do revestimento. Sem ele, as outras camadas podem descolar. Deve ser a mais fina possível.</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-slate-200 dark:border-slate-700 font-medium">Emboço (massa grossa)</td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-700">1 lata de cimento / 2 latas de cal / 8 latas de areia</td>
                <td className="p-2 text-center border-r border-slate-200 dark:border-slate-700 font-bold">17m²</td>
                <td className="p-2 text-slate-500 dark:text-slate-400 italic">Serve para regularizar a superfície. Espessura deve ser de 1cm a 2,5cm.</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-slate-200 dark:border-slate-700 font-medium">Reboco (massa fina)</td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-700">1 lata de cimento / 2 latas de cal / 9 latas de areia</td>
                <td className="p-2 text-center border-r border-slate-200 dark:border-slate-700 font-bold">35m²</td>
                <td className="p-2 text-slate-500 dark:text-slate-400 italic">Camada de acabamento final. Deve ser a mais fina possível.</td>
              </tr>
              <tr>
                <td className="p-2 border-r border-slate-200 dark:border-slate-700 font-medium">Assentamento de azulejos</td>
                <td className="p-2 border-r border-slate-200 dark:border-slate-700">1 lata de cimento / 1 1/2 lata de cal / 4 latas de areia</td>
                <td className="p-2 text-center border-r border-slate-200 dark:border-slate-700 font-bold">7m²</td>
                <td className="p-2 text-slate-500 dark:text-slate-400 italic">Azulejos devem ficar mergulhados na água por um dia antes de serem assentados.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
