'use client';

import React from 'react';
import { motion } from 'motion/react';
import Header from '@/components/Header';
import { DoorOpen, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import EsquadriasCalculation from '@/components/EsquadriasCalculation';

export default function EsquadriasPage() {
  return (
    <div className="flex h-full grow flex-col bg-white dark:bg-slate-950 min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto w-full p-4 lg:p-10 space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center justify-between">
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
                  Levantamento de Esquadrias
                </h1>
              </div>
            </div>
            
            <Link 
              href="/"
              className="px-6 py-2 bg-black text-brand-yellow font-bold rounded-lg hover:bg-slate-800 transition-all shadow-lg text-sm uppercase tracking-widest"
            >
              Menu Principal
            </Link>
          </div>
          
          <EsquadriasCalculation />
        </motion.div>
      </main>
    </div>
  );
}
