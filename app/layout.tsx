import type {Metadata} from 'next';
import {headers} from 'next/headers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Arteva | Objets Publicitaires Personnalisés Entreprise Maroc',
  description:
    'Objets publicitaires personnalisés pour entreprises au Maroc. Designer en ligne, accompagnement personnalisé, qualité premium. Devis gratuit.',
  metadataBase: new URL('https://arteva.ma'),
  icons: {
    icon: [
      {url: '/icons/icon.svg', type: 'image/svg+xml'},
      {url: '/icons/icon.svg', sizes: '32x32', type: 'image/svg+xml'},
      {url: '/icons/icon.svg', sizes: '16x16', type: 'image/svg+xml'}
    ],
    shortcut: '/icons/icon.svg',
    apple: '/icons/icon.svg'
  },
  openGraph: {
    type: 'website',
    locale: 'fr_MA',
    url: 'https://arteva.ma/fr',
    siteName: 'Arteva',
    title: 'Arteva | Objets Publicitaires Personnalisés Maroc',
    description:
      'Objets publicitaires personnalisés pour entreprises au Maroc. Designer en ligne, accompagnement personnalisé, qualité premium.',
    images: [
      {
        url: '/images/blog/objets-publicitaires-guide.jpg',
        width: 1200,
        height: 630,
        alt: 'Arteva — Objets publicitaires personnalisés au Maroc',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arteva | Objets Publicitaires Personnalisés Maroc',
    description:
      'Objets publicitaires personnalisés pour entreprises au Maroc. Designer en ligne, accompagnement personnalisé, qualité premium.',
    images: ['/images/blog/objets-publicitaires-guide.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  alternates: {
    canonical: 'https://arteva.ma/fr',
    languages: {
      'fr-MA': 'https://arteva.ma/fr',
      'ar-MA': 'https://arteva.ma/ar'
    }
  }
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Detect locale from URL path for proper lang/dir attributes
  const headersList = await headers();
  const pathname = headersList.get('x-next-intl-locale') || headersList.get('x-invoke-path') || '';
  const isArabic = pathname === 'ar' || pathname.startsWith('/ar');
  const lang = isArabic ? 'ar' : 'fr';

  return (
    <html lang={lang} dir={isArabic ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://images.pexels.com" />
        <link rel="dns-prefetch" href="https://images.pexels.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
