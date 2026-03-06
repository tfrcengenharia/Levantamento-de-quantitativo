'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Menu, LogOut, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { logout } from '@/app/auth/actions';
import { usePathname } from 'next/navigation';

import Link from 'next/link';

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [supabase] = useState(() => createClient());
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          // Only log if it's not a missing session error
          if (error.message !== 'Auth session missing!') {
            console.error('Error fetching user:', error);
          }
          return;
        }
        setUser(data?.user);
      } catch (err) {
        console.error('Unexpected error fetching user:', err);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const navItems = [
    { name: 'Alvenaria', href: '/' },
    { name: 'Esquadrias', href: '/esquadrias' },
    { name: 'Histórico de Vistorias', href: '#' },
  ];

  return (
    <header className="flex items-center justify-between border-b border-brand/10 bg-white dark:bg-slate-900 px-6 py-4 lg:px-20">
      <div className="flex items-center gap-4">
        <div className="relative size-10 text-brand">
          <Image 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCP6l0w4b7C-dWgsNrOk7k10uxbxSF06Rj_YP3cziK9U5uEBtOdqdZnLxSHkTThSq6JemfOt2-l1AfEyY4OONlXg2jidUw00qpenHm2-To4tsmPXr275mtZ1mVcNQQ241Z_vN_zfRIDeuCyIlUO1XChDdwXnzQtPk_hJ87medUuQkNAhu9NQP5AzV0RF_jZTyY3_zR2bMQU2HDlYJr69OEHj_g41M-pSDedAsbZyKbDflMLze7-1W22v6V51oNZiUP-lzV7nt7quM3H"
            alt="TFRC Engenharia Logo"
            fill
            className="object-contain"
            referrerPolicy="no-referrer"
          />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-brand">TFRC Engenharia</h2>
      </div>
      <nav className="hidden md:flex items-center gap-8">
        {navItems.map((item) => {
          const isActive = item.href === '/' 
            ? pathname === '/' 
            : pathname.startsWith(item.href);
          
          return (
            <Link 
              key={item.name}
              href={item.href}
              className={`text-sm font-medium transition-colors pb-1 border-b-2 ${
                isActive 
                  ? 'text-brand border-brand font-semibold' 
                  : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-brand'
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold leading-none">{user?.email?.split('@')[0] || 'Engenheiro'}</p>
          <p className="text-xs text-green-600 font-medium flex items-center justify-end gap-1">
            <span className="size-1.5 bg-green-500 rounded-full"></span> Online
          </p>
        </div>
        <div className="size-10 rounded-full bg-brand/10 flex items-center justify-center overflow-hidden border border-brand/20">
          {user?.user_metadata?.avatar_url ? (
            <Image 
              className="w-full h-full object-cover" 
              src={user.user_metadata.avatar_url}
              alt="User Avatar"
              width={40}
              height={40}
              referrerPolicy="no-referrer"
              priority
            />
          ) : (
            <User className="size-5 text-brand" />
          )}
        </div>
        <button 
          onClick={() => logout()}
          className="p-2 text-slate-500 hover:text-red-600 transition-colors"
          title="Sair"
        >
          <LogOut className="size-5" />
        </button>
        <button className="md:hidden text-slate-600">
          <Menu className="size-6" />
        </button>
      </div>
    </header>
  );
}
