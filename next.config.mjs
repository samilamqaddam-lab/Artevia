import createNextIntlPlugin from 'next-intl/plugin';
import bundleAnalyzer from '@next/bundle-analyzer';

const locales = ['fr', 'ar'];
const defaultLocale = 'fr';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

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

  // Code splitting optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Fabric.js dans son propre chunk (éditeur de design)
          fabric: {
            test: /[\\/]node_modules[\\/]fabric/,
            name: 'fabric',
            priority: 10,
            reuseExistingChunk: true,
          },
          // Radix UI components
          radix: {
            test: /[\\/]node_modules[\\/]@radix-ui/,
            name: 'radix-ui',
            priority: 9,
            reuseExistingChunk: true,
          },
          // Supabase dans son propre chunk
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase/,
            name: 'supabase',
            priority: 8,
            reuseExistingChunk: true,
          },
          // Autres vendors
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },

  images: {
    remotePatterns: [
      // Supabase Storage - for uploaded product images
      {protocol: 'https', hostname: 'qygpijoytpbxgbkaylkz.supabase.co'},
      // External stock image sources
      {protocol: 'https', hostname: 'images.unsplash.com'},
      {protocol: 'https', hostname: 'plus.unsplash.com'},
      {protocol: 'https', hostname: 'source.unsplash.com'},
      {protocol: 'https', hostname: 'upload.wikimedia.org'},
      {protocol: 'https', hostname: 'images.pexels.com'},
      // Allow any HTTPS domain for imported URLs (be careful with this in production)
      {protocol: 'https', hostname: '**'}
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60
  },

  // Redirections SEO
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/icons/icon.svg',
        permanent: true
      }
    ];
  },

  // Headers de sécurité et preconnect
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
          },
          {
            key: 'Link',
            value: '<https://images.pexels.com>; rel=preconnect, <https://qygpijoytpbxgbkaylkz.supabase.co>; rel=preconnect'
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

export default withBundleAnalyzer(withNextIntl(nextConfig));
