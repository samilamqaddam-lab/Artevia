import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Artevia | Création Print-On-Demand Maroc',
  description:
    'Artevia permet de concevoir facilement des produits print-on-demand pour le marché marocain, avec un éditeur fluide et des exports prêts pour l’impression.'
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
