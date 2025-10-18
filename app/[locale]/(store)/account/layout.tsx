'use client';

import {redirect, usePathname} from 'next/navigation';
import Link from 'next/link';
import {createClient} from '@/lib/supabase/client';
import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import type {Locale} from '@/i18n/settings';
import type {User} from '@supabase/supabase-js';

export default function AccountLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: {locale: Locale};
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const t = useTranslations('account');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({data: {user}}) => {
      if (!user) {
        redirect(`/${params.locale}/auth/login`);
      }
      setUser(user);
      setLoading(false);
    });
  }, [params.locale]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Chargement...</div>;
  }

  if (!user) return null;

  const navItems = [
    {href: `/${params.locale}/account/designs`, label: t('nav.designs')},
    {href: `/${params.locale}/account/orders`, label: t('nav.orders')}
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="rounded-[36px] border border-slate-200 bg-white p-6 shadow-[0_35px_80px_-60px_rgba(0,0,0,0.1)] dark:border-white/10 dark:bg-[#121212] dark:shadow-[0_35px_80px_-60px_rgba(0,0,0,0.9)] sm:p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{t('title')}</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{user.email}</p>
        </header>

        <nav className="mb-8 flex gap-4 border-b border-slate-200 dark:border-white/10">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b-2 px-4 pb-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-brand text-brand'
                    : 'border-transparent text-slate-600 hover:border-brand hover:text-brand dark:text-slate-300 dark:hover:text-brand'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {children}
      </div>
    </div>
  );
}
