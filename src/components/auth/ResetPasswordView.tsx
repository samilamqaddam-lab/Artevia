'use client';

import {useState, type ChangeEvent, type FormEvent} from 'react';
import {useRouter} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/Button';
import {useToast, useSupabase} from '@/components/Providers';
import type {Locale} from '@/i18n/settings';

interface ResetPasswordViewProps {
  locale: Locale;
}

export function ResetPasswordView({locale}: ResetPasswordViewProps) {
  const t = useTranslations('auth.resetPassword');
  const supabase = useSupabase();
  const router = useRouter();
  const {pushToast} = useToast();

  const [form, setForm] = useState({password: '', confirmPassword: ''});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange =
    (field: 'password' | 'confirmPassword') => (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({...prev, [field]: event.target.value}));
      setError(null);
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError(t('passwordMismatch'));
      pushToast({title: t('passwordMismatch')});
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError(t('passwordTooShort'));
      pushToast({title: t('passwordTooShort')});
      setLoading(false);
      return;
    }

    const {error: updateError} = await supabase.auth.updateUser({
      password: form.password
    });

    if (updateError) {
      setError(updateError.message);
      pushToast({title: t('error'), description: updateError.message});
      setLoading(false);
      return;
    }

    pushToast({title: t('success')});
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
          <span className="font-medium text-slate-900 dark:text-white">{t('newPassword')}</span>
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
          <span className="font-medium text-slate-900 dark:text-white">
            {t('confirmPassword')}
          </span>
          <input
            type="password"
            value={form.confirmPassword}
            onChange={handleChange('confirmPassword')}
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
    </section>
  );
}
