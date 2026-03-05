'use client';

import React, { useState, Suspense, useActionState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { login } from '@/app/auth/actions';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="size-12 text-brand">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="currentColor" fillRule="evenodd"></path>
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">TFRC Engenharia</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Acesse sua conta para continuar</p>
      </div>

      {state?.error && (
        <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-900/30">
          <AlertCircle className="size-4 shrink-0" />
          <p>{state.error}</p>
        </div>
      )}

      {state?.message && (
        <div className="flex items-center gap-2 p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900/30">
          <CheckCircle2 className="size-4 shrink-0" />
          <p>{state.message}</p>
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="email">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none transition-all"
              placeholder="seu@email.com"
            />
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider" htmlFor="password">Senha</label>
              <button type="button" className="text-xs font-bold text-brand hover:underline">Esqueceu a senha?</button>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand outline-none transition-all"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-brand-dark transition-all shadow-lg shadow-brand/20 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Entrar'}
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Não tem uma conta?{' '}
          <Link href="/signup" className="text-brand font-bold hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex justify-center"
      >
        <Suspense fallback={<Loader2 className="size-8 animate-spin text-brand" />}>
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
