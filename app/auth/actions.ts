'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type AuthState = {
  error?: string;
  message?: string;
} | null;

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: 'Configuração do Supabase ausente. Verifique as variáveis de ambiente no painel de Secrets.' };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    let message = error.message;
    if (message === 'Invalid login credentials') {
      message = 'E-mail ou senha incorretos. Verifique se você já confirmou seu e-mail ou se possui uma conta.';
    }
    return { error: message };
  }

  revalidatePath('/', 'layout');
  try {
    redirect('/');
  } catch (error) {
    if ((error as any).digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    throw error;
  }
}

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { error: 'Configuração do Supabase ausente. Verifique as variáveis de ambiente no painel de Secrets.' };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  return { message: 'Cadastro realizado! Verifique seu e-mail para confirmar a conta antes de fazer login.' };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  try {
    redirect('/login');
  } catch (error) {
    if ((error as any).digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    throw error;
  }
}
