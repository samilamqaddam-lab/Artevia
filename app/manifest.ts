import type {MetadataRoute} from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Arteva - Print-On-Demand Maroc',
    short_name: 'Arteva',
    description:
      'Créez des designs print-on-demand bilingues pour le marché marocain avec exports prêts pour l’impression.',
    start_url: '/fr',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1f6f8b',
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'any'
      }
    ]
  };
}
