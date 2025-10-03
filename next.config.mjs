import createNextIntlPlugin from 'next-intl/plugin';

const locales = ['fr', 'ar'];
const defaultLocale = 'fr';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig = {
  reactStrictMode: true,
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
    ]
  }
};

export default withNextIntl(nextConfig);
