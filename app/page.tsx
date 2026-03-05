'use client';

import React from 'react';
import { motion } from 'motion/react';
import Header from '@/components/Header';
import MaterialCalculation from '@/components/MaterialCalculation';
import SurveyItems from '@/components/SurveyItems';
import ActionFooter from '@/components/ActionFooter';

export default function Home() {
  return (
    <div className="flex h-full grow flex-col bg-white dark:bg-slate-950 min-h-screen">
      <Header />
      
      <main className="max-w-6xl mx-auto w-full p-4 lg:p-10 space-y-8">
        {/* Hero Title */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-2 text-center"
        >
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Ficha de Levantamento Quantitativo
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Cálculo de Alvenaria, Chapisco e Reboco
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <MaterialCalculation />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <SurveyItems />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ActionFooter />
        </motion.div>
      </main>
    </div>
  );
}
