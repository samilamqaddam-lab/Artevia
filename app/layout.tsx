import type {Metadata} from 'next';
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
    url: 'https://arteva.ma',
    siteName: 'Arteva',
    title: 'Arteva | Objets Publicitaires Personnalisés Maroc',
    description:
      'Objets publicitaires personnalisés pour entreprises au Maroc. Designer en ligne, accompagnement personnalisé, qualité premium.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arteva | Objets Publicitaires Personnalisés Maroc',
    description:
      'Objets publicitaires personnalisés pour entreprises au Maroc. Designer en ligne, accompagnement personnalisé, qualité premium.'
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
    canonical: 'https://arteva.ma'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
