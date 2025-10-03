'use client';

import * as Popover from '@radix-ui/react-popover';
import {useLocale, useTranslations} from 'next-intl';
import {usePathname, useRouter} from 'next/navigation';
import {Button} from '@/components/ui/Button';
import {locales, type Locale} from '@/i18n/settings';
import {cn} from '@/lib/utils';

export function LanguageSwitcher() {
  const currentLocale = useLocale() as Locale;
  const t = useTranslations('common.nav');
  const pathname = usePathname();
  const router = useRouter();

  const handleSelect = (locale: Locale) => {
    if (locale === currentLocale) return;
    const parts = pathname.split('/');
    parts[1] = locale;
    const nextPath = parts.join('/') || '/';
    router.push(nextPath);
    router.refresh();
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="ghost" size="sm" aria-label={t('language')}>
          {currentLocale.toUpperCase()}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-40 rounded-2xl border border-slate-200 bg-white p-3 text-slate-900 shadow-xl data-[state=open]:animate-fade-in dark:border-white/10 dark:bg-[#1f1f1f] dark:text-slate-100"
          sideOffset={12}
          align="end"
        >
          <nav className="flex flex-col gap-1" aria-label={t('language')}>
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleSelect(locale)}
                className={cn(
                  'rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                  locale === currentLocale
                    ? 'bg-brand text-charcoal shadow-inner'
                    : 'hover:bg-brand/10 dark:hover:bg-brand/10'
                )}
              >
                {locale.toUpperCase()}
              </button>
            ))}
          </nav>
          <Popover.Arrow className="fill-white dark:fill-[#1f1f1f]" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
