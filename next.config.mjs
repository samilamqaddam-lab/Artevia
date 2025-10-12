import createNextIntlPlugin from 'next-intl/plugin';

const locales = ['fr', 'ar'];
const defaultLocale = 'fr';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  reactStrictMode: true,

  // Optimisations Vercel
  poweredByHeader: false,
  compress: true,

  experimental: {
    typedRoutes: true,
    serverActions: {
      bodySizeLimit: '2mb'
    }
  },

  images: {
    remotePatterns: [
      {protocol: 'https', hostname: 'images.unsplash.com'},
      {protocol: 'https', hostname: 'plus.unsplash.com'},
      {protocol: 'https', hostname: 'source.unsplash.com'},
      {protocol: 'https', hostname: 'upload.wikimedia.org'},
      {protocol: 'https', hostname: 'images.pexels.com'}
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60
  },

  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      },
      {
        source: '/service-worker.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate'
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/'
          }
        ]
      }
    ];
  }
};

export default withNextIntl(nextConfig);
