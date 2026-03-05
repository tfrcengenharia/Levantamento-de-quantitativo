'use client';

import React from 'react';
import { FileText, Save } from 'lucide-react';

export default function ActionFooter() {
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-end gap-4 pb-10">
      <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition-all">
        <FileText className="size-5" />
        Exportar Relatório
      </button>
      <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-3 bg-brand text-white rounded-lg font-bold hover:brightness-110 shadow-lg shadow-brand/20 transition-all">
        <Save className="size-5" />
        Salvar Levantamento
      </button>
    </footer>
  );
}
