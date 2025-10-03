"use client";

import Link from 'next/link';
import {useLocale, useTranslations} from 'next-intl';
import {Button} from '@/components/ui/Button';

export default function NotFound() {
  const locale = useLocale();
  const tCommon = useTranslations('common');

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-3xl font-semibold text-slate-900">404</h1>
      <p className="text-slate-600">{tCommon('comingSoon')}</p>
      <Button asChild>
        <Link href={`/${locale}`}>{tCommon('nav.home')}</Link>
      </Button>
    </div>
  );
}
