'use client';

import {useState, type ChangeEvent, type FormEvent} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/Button';
import {useToast, useSupabase} from '@/components/Providers';
import type {Locale} from '@/i18n/settings';

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

    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const redirectTo = origin ? `${origin}/${locale}/auth/callback` : undefined;

    const {error: signUpError} = await supabase.auth.signUp({
      email: form.email.trim(),
      password: form.password,
      options: {
        emailRedirectTo: redirectTo
      }
    });

    if (signUpError) {
      const message = signUpError.message || t('error');
      console.error('Supabase sign-up error', signUpError);
      setError(message);
      pushToast({title: t('error'), description: message});
      setLoading(false);
      return;
    }

    pushToast({title: t('success'), description: t('checkEmail')});
    router.push(`/${locale}/auth/login`);
  };

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
