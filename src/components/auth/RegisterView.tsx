'use client';

import {useState, type ChangeEvent, type FormEvent} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/Button';
import {useToast, useSupabase} from '@/components/Providers';
import type {Locale} from '@/i18n/settings';
import {logger} from '@/lib/logger';

interface RegisterViewProps {
  locale: Locale;
}

export function RegisterView({locale}: RegisterViewProps) {
  const t = useTranslations('auth.register');
  const supabase = useSupabase();
  const router = useRouter();
  const {pushToast} = useToast();

  const [form, setForm] = useState({email: '', password: '', confirm: ''});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (field: 'email' | 'password' | 'confirm') => (event: ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({...prev, [field]: event.target.value}));
    setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (form.password !== form.confirm) {
      const message = t('passwordMismatch');
      setError(message);
      pushToast({title: message});
      setLoading(false);
      return;
    }

    // Use NEXT_PUBLIC_SITE_URL if available, otherwise fallback to current origin
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : '');
    const redirectTo = siteUrl ? `${siteUrl}/${locale}/auth/callback` : undefined;

    const {error: signUpError} = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        emailRedirectTo: redirectTo
      }
    });

    if (signUpError) {
      const message = signUpError.message || t('error');
      logger.error('Supabase sign-up error', signUpError);
      setError(message);
      pushToast({title: t('error'), description: message});
      setLoading(false);
      return;
    }

    // Show confirmation screen instead of redirecting
    setShowConfirmation(true);
    setLoading(false);
  };

  // Show confirmation screen after successful signup
  if (showConfirmation) {
    return (
      <section className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center gap-8 px-4 py-12 sm:px-6">
        <div className="rounded-3xl border border-green-200 bg-green-50 p-8 text-center dark:border-green-900/30 dark:bg-green-900/10">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="mb-3 text-2xl font-semibold text-slate-900 dark:text-white">
            {t('confirmationTitle')}
          </h1>
          <p className="mb-2 text-sm text-slate-700 dark:text-slate-300">
            {t('confirmationMessage')}
          </p>
          <p className="mb-6 font-medium text-brand">{form.email}</p>
          <p className="mb-6 text-xs text-slate-600 dark:text-slate-400">
            {t('confirmationHint')}
          </p>
          <Link
            href={`/${locale}/auth/login`}
            className="inline-flex items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-medium text-charcoal transition-colors hover:bg-brand-light"
          >
            {t('backToLogin')}
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center gap-8 px-4 py-12 sm:px-6">
      <div className="space-y-3 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">{t('title')}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">{t('subtitle')}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
          <span className="font-medium text-slate-900 dark:text-white">{t('email')}</span>
          <input
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            required
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white"
            autoComplete="email"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
          <span className="font-medium text-slate-900 dark:text-white">{t('password')}</span>
          <input
            type="password"
            value={form.password}
            onChange={handleChange('password')}
            required
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white"
            autoComplete="new-password"
            minLength={6}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
          <span className="font-medium text-slate-900 dark:text-white">{t('confirm')}</span>
          <input
            type="password"
            value={form.confirm}
            onChange={handleChange('confirm')}
            required
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white"
            autoComplete="new-password"
            minLength={6}
          />
        </label>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <Button type="submit" size="md" loading={loading} className="w-full">
          {t('cta')}
        </Button>
      </form>
      <p className="text-center text-sm text-slate-600 dark:text-slate-300">
        {t('switch')}{' '}
        <Link href={`/${locale}/auth/login`} className="font-semibold text-brand hover:underline">
          <span>{t('switchCta')}</span>
        </Link>
      </p>
    </section>
  );
}
