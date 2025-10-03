import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {SiteShell} from '@/components/layout/SiteShell';
import {Providers} from '@/components/Providers';
import {locales, type Locale} from '@/i18n/settings';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: {locale: string};
}) {
  const locale = params.locale as Locale;
  if (!locales.includes(locale)) {
    notFound();
  }
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Africa/Casablanca">
      <Providers locale={locale}>
        <SiteShell>{children}</SiteShell>
      </Providers>
    </NextIntlClientProvider>
  );
}
