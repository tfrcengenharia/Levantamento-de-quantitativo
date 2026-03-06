'use client';

import React from 'react';
import { motion } from 'motion/react';
import Header from '@/components/Header';
import { DoorOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EsquadriasPage() {
  return (
    <div className="flex h-full grow flex-col bg-white dark:bg-slate-950 min-h-screen">
      <Header />
      
      <main className="max-w-6xl mx-auto w-full p-4 lg:p-10 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
            >
              <ArrowLeft className="size-5" />
            </Link>
            <div className="flex items-center gap-2 text-brand">
              <DoorOpen className="size-6" />
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight">
                Esquadrias
              </h1>
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-20 flex flex-col items-center justify-center text-center gap-4">
            <div className="size-16 bg-brand/10 rounded-full flex items-center justify-center text-brand">
              <DoorOpen className="size-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Página em Desenvolvimento</h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Esta aba será utilizada para o levantamento detalhado de portas, janelas e vãos, integrando automaticamente os descontos na aba de Alvenaria.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
