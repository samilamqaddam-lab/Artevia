import Link from 'next/link';
import {useLocale, useTranslations} from 'next-intl';

export function Footer() {
  const t = useTranslations('common');
  const locale = useLocale();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#111111]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-slate-300">
        <p className="font-medium text-slate-700 dark:text-white">© {new Date().getFullYear()} {t('brand')} · {t('tagline')}</p>
        <nav className="flex flex-wrap gap-4">
          <Link href={`/${locale}/catalog`} className="transition-colors hover:text-brand">
            {t('nav.catalog')}
          </Link>
          <Link href={`/${locale}/occasions`} className="transition-colors hover:text-brand">
            {t('nav.occasions')}
          </Link>
          <Link href={`/${locale}/designs`} className="transition-colors hover:text-brand">
            {t('nav.saved')}
          </Link>
          <a href="mailto:hello@artevia.ma" className="transition-colors hover:text-brand">
            hello@artevia.ma
          </a>
        </nav>
      </div>
    </footer>
  );
}
