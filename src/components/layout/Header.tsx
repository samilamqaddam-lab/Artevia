/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import * as Dialog from '@radix-ui/react-dialog';
import {Menu, ShoppingBag, X} from 'lucide-react';
import Link from 'next/link';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from 'next/navigation';
import {useEffect, useMemo, useState} from 'react';
import {Button} from '@/components/ui/Button';
import {useQuoteStore} from '@/stores/quote-store';
import {cn, isRTL} from '@/lib/utils';
import {LanguageSwitcher} from './LanguageSwitcher';
import {ThemeToggle} from './ThemeToggle';
import {useToast, useSupabase} from '@/components/Providers';

export function Header() {
  const t = useTranslations('common');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const navItems = useMemo(
    () => [
      {href: `/${locale}`, label: t('nav.home')},
      {href: `/${locale}/catalog`, label: t('nav.catalog')},
      {href: `/${locale}/occasions`, label: t('nav.occasions')},
      {href: `/${locale}/designs`, label: t('nav.projects')},
      {href: `/${locale}/rfq`, label: t('nav.quotes')}
    ],
    [locale, t]
  );
  const cartCount = useQuoteStore((state) => state.totalQuantity());
  const dir = isRTL(locale as 'fr' | 'ar') ? 'rtl' : 'ltr';
  const supabase = useSupabase();
  const {pushToast} = useToast();
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setMounted(true);

    // Get initial session
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: {subscription}
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    pushToast({title: t('status.signedOut')});
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 text-slate-900 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:border-white/10 dark:bg-[#171717]/95 dark:text-slate-100 dark:supports-[backdrop-filter]:bg-[#171717]/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href={`/${locale}` as any} className="flex items-center gap-2 text-lg font-semibold" dir={dir}>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand text-charcoal shadow-floating">
            A
          </span>
          <span className="hidden sm:block text-slate-900 dark:text-white">{t('brand')}</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex" aria-label="Main">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href as any}
              className={cn(
                'transition-colors hover:text-brand',
                pathname === item.href ? 'text-brand' : 'text-slate-700 dark:text-slate-300'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/rfq` as any}
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 transition-colors hover:border-brand hover:text-brand dark:border-white/10 dark:text-white"
            aria-label={t('nav.quotes')}
          >
            <ShoppingBag size={20} aria-hidden />
            {cartCount > 0 && (
              <span className="absolute -top-1 -end-1 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-accent text-xs font-semibold text-charcoal">
                {cartCount}
              </span>
            )}
          </Link>
          {mounted ? (
            session ? (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href={`/${locale}/account/orders` as any}
                  className="text-sm font-semibold text-slate-700 transition-colors hover:text-brand dark:text-slate-200"
                >
                  {t('nav.account')}
                </Link>
                <Button size="sm" variant="ghost" onClick={handleSignOut}>
                  {t('nav.logout')}
                </Button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 md:flex">
                <Link
                  href={`/${locale}/auth/login` as any}
                  className="text-sm font-semibold text-slate-700 transition-colors hover:text-brand dark:text-slate-200"
                >
                  {t('nav.login')}
                </Link>
                <Button asChild size="sm">
                  <Link href={`/${locale}/auth/register` as any}>{t('nav.register')}</Link>
                </Button>
              </div>
            )
          ) : null}
          <ThemeToggle />
          <LanguageSwitcher />
          <div className="md:hidden">
            <MobileNav navItems={navItems} locale={locale} />
          </div>
        </div>
      </div>
    </header>
  );
}

type NavItem = {
  href: string;
  label: string;
};

function MobileNav({navItems, locale}: {navItems: NavItem[]; locale: string}) {
  const t = useTranslations('common');
  const supabase = useSupabase();
  const {pushToast} = useToast();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    setMounted(true);

    // Get initial session
    supabase.auth.getSession().then(({data: {session}}) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: {subscription}
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    pushToast({title: t('status.signedOut')});
    router.refresh();
  };
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="sm" aria-label="Menu">
          <Menu size={18} aria-hidden />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-900/40 data-[state=open]:animate-fade-in dark:bg-[#171717]/80" />
        <Dialog.Content className="fixed right-4 top-4 z-50 w-[280px] rounded-3xl border border-slate-200 bg-white p-4 text-slate-900 shadow-2xl focus-visible:outline-none dark:border-white/10 dark:bg-[#1f1f1f] dark:text-slate-100">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-lg font-semibold text-slate-900 dark:text-white">{t('brand')}</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="sm" aria-label="Fermer">
                <X size={18} aria-hidden />
              </Button>
            </Dialog.Close>
          </div>
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href as any}
                className="text-base font-medium text-slate-800 dark:text-slate-200"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6">
            <Button asChild variant="primary" size="md">
              <Link href={`/${locale}/catalog` as any}>{t('actions.viewCatalog')}</Link>
            </Button>
          </div>
          {mounted ? (
            session ? (
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href={`/${locale}/account/orders` as any}
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  {t('nav.account')}
                </Link>
                <Button size="sm" variant="ghost" onClick={handleSignOut}>
                  {t('nav.logout')}
                </Button>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-3">
                <Button asChild size="sm" variant="ghost">
                  <Link href={`/${locale}/auth/login` as any}>{t('nav.login')}</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={`/${locale}/auth/register` as any}>{t('nav.register')}</Link>
                </Button>
              </div>
            )
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
