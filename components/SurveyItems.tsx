'use client';

import React, { useState } from 'react';
import { ListTodo, Plus, Trash2, PlusCircle } from 'lucide-react';

interface SurveyItem {
  id: string;
  description: string;
  unit: string;
  quantity: string; // Changed to string to handle formatting
  dimensions: string;
  observations: string;
}

export default function SurveyItems() {
  const [items, setItems] = useState<SurveyItem[]>([
    {
      id: '1',
      description: 'Pintura acrílica fosca interna',
      unit: 'm²',
      quantity: '145,50',
      dimensions: 'Ex: 5.0 x 3.2m',
      observations: 'Notas adicionais...',
    },
    {
      id: '2',
      description: 'Remoção de entulho',
      unit: 'm³',
      quantity: '12,00',
      dimensions: '---',
      observations: 'Caçambas padrão de 5m³',
    },
  ]);

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

  const addItem = () => {
    const newItem: SurveyItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      unit: 'm²',
      quantity: '0,00',
      dimensions: '',
      observations: '',
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItemQuantity = (id: string, val: string) => {
    // Allow only digits, dots, and one comma during typing
    const cleanVal = val.replace(/[^\d,.]/g, '');
    setItems(items.map(item => item.id === id ? { ...item, quantity: cleanVal } : item));
  };

  const formatItemQuantity = (id: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return { ...item, quantity: formatNum(parseNum(item.quantity)) };
      }
      return item;
    }));
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTodo className="size-5 text-brand" />
          <h2 className="text-lg font-bold">Itens do Levantamento</h2>
        </div>
        <button 
          onClick={addItem}
          className="flex items-center gap-2 bg-brand/10 hover:bg-brand/20 text-brand px-4 py-2 rounded-lg text-sm font-bold transition-all"
        >
          <Plus className="size-4" />
          Adicionar Novo Item
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição do Serviço</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-24 text-center">Unid.</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-32 text-center">Qtd</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-40">Dimensões</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Observações</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-20">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4">
                  <input 
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm" 
                    type="text" 
                    defaultValue={item.description}
                  />
                </td>
                <td className="px-6 py-4">
                  <select 
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-center"
                    defaultValue={item.unit}
                  >
                    <option value="m²">m²</option>
                    <option value="m³">m³</option>
                    <option value="un">un</option>
                    <option value="kg">kg</option>
                  </select>
                </td>
                <td className="px-6 py-4">
                  <input 
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm text-center font-medium" 
                    type="text" 
                    value={item.quantity}
                    onChange={(e) => updateItemQuantity(item.id, e.target.value)}
                    onBlur={() => formatItemQuantity(item.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <input 
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm" 
                    placeholder="Ex: 5.0 x 3.2m" 
                    type="text" 
                    defaultValue={item.dimensions}
                  />
                </td>
                <td className="px-6 py-4">
                  <input 
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm italic text-slate-500" 
                    placeholder="Notas adicionais..." 
                    type="text" 
                    defaultValue={item.observations}
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-6 bg-white dark:bg-slate-800/30 flex justify-center border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={addItem}
          className="text-slate-500 dark:text-slate-400 text-sm font-medium hover:text-brand flex items-center gap-1 transition-colors"
        >
          <PlusCircle className="size-4" />
          Clique para inserir uma nova linha
        </button>
      </div>
    </section>
  );
}

