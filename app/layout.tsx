import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Artevia | Objets Publicitaires Personnalisés Entreprise Maroc',
  description:
    'Fournitures bureau et objets publicitaires personnalisés pour entreprises au Maroc. Designer en ligne, petites quantités, livraison 48h. BAT sous 24h. Devis gratuit.'
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
