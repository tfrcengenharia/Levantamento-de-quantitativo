'use client';

import React from 'react';
import { ClipboardList, MapPin } from 'lucide-react';

export default function ProjectData() {
  return (
    <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
        <ClipboardList className="size-5 text-brand" />
        <h2 className="text-lg font-bold">Dados do Projeto</h2>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Cliente</label>
            <input 
              className="w-full rounded-lg border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/50 focus:ring-brand focus:border-brand p-2 border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600" 
              placeholder="Nome da empresa ou pessoa" 
              type="text" 
            />
          </div>
          <div className="flex flex-col gap-2 lg:col-span-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Endereço Completo</label>
            <div className="relative">
              <input 
                className="w-full rounded-lg border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/50 focus:ring-brand focus:border-brand pl-10 p-2 border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600" 
                placeholder="Logradouro, número, bairro, cidade - UF" 
                type="text" 
              />
              <MapPin className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-600 size-4" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Data da Vistoria</label>
            <input 
              className="w-full rounded-lg border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/50 focus:ring-brand focus:border-brand p-2 border text-slate-900 dark:text-white" 
              type="date" 
            />
          </div>
          <div className="flex flex-col gap-2 lg:col-span-4">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Finalidade do Levantamento</label>
            <textarea 
              className="w-full rounded-lg border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950/50 focus:ring-brand focus:border-brand min-h-[80px] p-2 border text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600" 
              placeholder="Ex: Reforma estrutural, ampliação de área, laudo cautelar..."
            ></textarea>
          </div>
        </div>
      </div>
    </section>
  );
}
