import {NextIntlClientProvider} from 'next-intl';
import {notFound} from 'next/navigation';
import {SiteShell} from '@/components/layout/SiteShell';
import {Providers} from '@/components/Providers';
import {WhatsAppButton} from '@/components/ui/WhatsAppButton';
import {locales, type Locale} from '@/i18n/settings';

// WhatsApp business number for Arteva (Morocco format without +)
const WHATSAPP_NUMBER = '212652790322';

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
        <WhatsAppButton phoneNumber={WHATSAPP_NUMBER} locale={locale} />
      </Providers>
    </NextIntlClientProvider>
  );
}
