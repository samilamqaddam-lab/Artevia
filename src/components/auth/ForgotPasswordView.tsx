'use client';

import {useState, type ChangeEvent, type FormEvent} from 'react';
import Link from 'next/link';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/Button';
import {useToast, useSupabase} from '@/components/Providers';
import type {Locale} from '@/i18n/settings';

interface ForgotPasswordViewProps {
  locale: Locale;
}

export function ForgotPasswordView({locale}: ForgotPasswordViewProps) {
  const t = useTranslations('auth.forgotPassword');
  const supabase = useSupabase();
  const {pushToast} = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const {error} = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/${locale}/auth/reset-password`
    });

    if (error) {
      pushToast({title: t('error'), description: error.message});
      setLoading(false);
      return;
    }

    setEmailSent(true);
    pushToast({title: t('success')});
    setLoading(false);
  };

  if (emailSent) {
    return (
      <section className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center gap-8 px-4 py-12 sm:px-6">
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
            <svg
              className="h-8 w-8 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">
            {t('emailSentTitle')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">{t('emailSentMessage')}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{email}</p>
          <p className="text-sm text-slate-600 dark:text-slate-300">{t('emailSentHint')}</p>
        </div>
        <Link href={`/${locale}/auth/login`}>
          <Button variant="secondary" size="md" className="w-full">
            {t('backToLogin')}
          </Button>
        </Link>
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
            value={email}
            onChange={handleChange}
            required
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white"
            autoComplete="email"
          />
        </label>
        <Button type="submit" size="md" loading={loading} className="w-full">
          {t('cta')}
        </Button>
      </form>
      <p className="text-center text-sm text-slate-600 dark:text-slate-300">
        {t('rememberPassword')}{' '}
        <Link href={`/${locale}/auth/login`} className="font-semibold text-brand hover:underline">
          <span>{t('backToLogin')}</span>
        </Link>
      </p>
    </section>
  );
}
