'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AuthHandler() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error && (error.message.includes('Refresh Token') || (error as any).__isAuthError)) {
          await supabase.auth.signOut();
          router.push('/login');
        }
      } catch (err) {
        // Ignore
      }
    };

    checkInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
        try {
          const { data, error } = await supabase.auth.getSession();
          if (error && (error.message.includes('Refresh Token') || (error as any).__isAuthError)) {
            await supabase.auth.signOut();
            router.push('/login');
          }
        } catch (err) {
          // Ignore
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  return null;
}
