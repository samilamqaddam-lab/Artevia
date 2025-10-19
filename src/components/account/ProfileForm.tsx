'use client';

import {useState, useEffect, type ChangeEvent, type FormEvent} from 'react';
import {useTranslations} from 'next-intl';
import {Button} from '@/components/ui/Button';
import {useToast} from '@/components/Providers';
import type {Profile} from '@/lib/supabase/profiles';
import {logger} from '@/lib/logger';

interface ProfileFormProps {
  locale: string;
}

export function ProfileForm({locale}: ProfileFormProps) {
  const t = useTranslations('account.profile');
  const {pushToast} = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const [form, setForm] = useState({
    full_name: '',
    company_name: '',
    phone: '',
    locale: locale as 'fr' | 'ar'
  });

  // Fetch profile on mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const response = await fetch('/api/profile');
        if (!response.ok) throw new Error('Erreur lors du chargement du profil');

        const data = await response.json();
        setProfile(data.profile);
        setForm({
          full_name: data.profile.full_name || '',
          company_name: data.profile.company_name || '',
          phone: data.profile.phone || '',
          locale: data.profile.locale || locale
        });
      } catch (err) {
        logger.error('Error fetching profile:', err);
        pushToast({
          title: t('error'),
          description: err instanceof Error ? err.message : 'Erreur inconnue'
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [locale, t, pushToast]);

  const handleChange = (field: keyof typeof form) => (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({...prev, [field]: event.target.value}));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');

      const data = await response.json();
      setProfile(data.profile);
      pushToast({title: t('saved')});
    } catch (err) {
      logger.error('Error saving profile:', err);
      pushToast({
        title: t('error'),
        description: err instanceof Error ? err.message : 'Erreur inconnue'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      pushToast({title: t('error'), description: t('invalidFileType')});
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      pushToast({title: t('error'), description: t('fileTooLarge')});
      return;
    }

    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/profile/avatar', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Erreur lors de l\'upload');

      const data = await response.json();
      setProfile(data.profile);
      pushToast({title: t('avatarUploaded')});
    } catch (err) {
      logger.error('Error uploading avatar:', err);
      pushToast({
        title: t('error'),
        description: err instanceof Error ? err.message : 'Erreur inconnue'
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm(t('confirmRemoveAvatar'))) return;

    setUploadingAvatar(true);

    try {
      const response = await fetch('/api/profile/avatar', {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      const data = await response.json();
      setProfile(data.profile);
      pushToast({title: t('avatarRemoved')});
    } catch (err) {
      logger.error('Error removing avatar:', err);
      pushToast({
        title: t('error'),
        description: err instanceof Error ? err.message : 'Erreur inconnue'
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <div className="relative">
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt={profile.full_name || 'Avatar'}
              className="h-24 w-24 rounded-full object-cover ring-2 ring-slate-200 dark:ring-white/10"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-200 text-3xl font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              {(profile?.full_name || profile?.email || 'U')[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer">
            <span className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand px-3 text-sm font-medium text-charcoal transition-colors hover:bg-brand-light">
              {uploadingAvatar ? (
                <span className="inline-flex h-3 w-3 animate-spin rounded-full border-2 border-white/50 border-t-white" />
              ) : null}
              {t('uploadAvatar')}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
              disabled={uploadingAvatar}
            />
          </label>
          {profile?.avatar_url && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveAvatar}
              loading={uploadingAvatar}
            >
              {t('removeAvatar')}
            </Button>
          )}
          <p className="text-xs text-slate-500">{t('avatarHint')}</p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-slate-900 dark:text-white">{t('fullName')}</span>
          <input
            type="text"
            value={form.full_name}
            onChange={handleChange('full_name')}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-slate-900 dark:text-white">{t('companyName')}</span>
          <input
            type="text"
            value={form.company_name}
            onChange={handleChange('company_name')}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-slate-900 dark:text-white">{t('phone')}</span>
          <input
            type="tel"
            value={form.phone}
            onChange={handleChange('phone')}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-slate-900 dark:text-white">{t('preferredLanguage')}</span>
          <select
            value={form.locale}
            onChange={handleChange('locale')}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 dark:border-white/10 dark:bg-[#0f0f0f] dark:text-white"
          >
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </select>
        </label>

        <div className="flex gap-3 pt-4">
          <Button type="submit" size="md" loading={saving}>
            {t('save')}
          </Button>
        </div>
      </form>

      {/* Email (read-only) */}
      <div className="border-t border-slate-200 pt-6 dark:border-white/10">
        <label className="flex flex-col gap-2 text-sm">
          <span className="font-medium text-slate-900 dark:text-white">{t('email')}</span>
          <input
            type="email"
            value={profile?.email || ''}
            disabled
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400"
          />
          <span className="text-xs text-slate-500">{t('emailHint')}</span>
        </label>
      </div>
    </div>
  );
}
