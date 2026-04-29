const path = require('path');
const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin();

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      urlPattern: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-font-assets',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    {
      urlPattern: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-image-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
    {
      urlPattern: /^https?.*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 24 * 60 * 60, // 24 hours
        },
      },
    },
  ],
});

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname),
  outputFileTracingIncludes: {
    '/': ['./public/**/*', './content/**/*'],
  },
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  turbopack: {},
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/ensinamentos',
        permanent: true,
      },
      {
        source: '/:locale/blog',
        destination: '/:locale/ensinamentos',
        permanent: true,
      },
      {
        source: '/formacao',
        destination: '/ensinamentos?tab=caminhos',
        permanent: true,
      },
      {
        source: '/formacao/santos',
        destination: '/ensinamentos/santos',
        permanent: true,
      },
      {
        source: '/formacao/:path*',
        destination: '/ensinamentos/caminhos/:path*',
        permanent: true,
      },
      // Caminho path renames (PRD §2.5 — thematic naming)
      {
        source: '/:locale/ensinamentos/caminhos/iniciante/:slug*',
        destination: '/:locale/ensinamentos/caminhos/primeiros-passos/:slug*',
        permanent: true,
      },
      {
        source: '/:locale/ensinamentos/caminhos/intermediario/:slug*',
        destination: '/:locale/ensinamentos/caminhos/aprofundando/:slug*',
        permanent: true,
      },
      {
        source: '/:locale/ensinamentos/caminhos/avancado/:slug*',
        destination: '/:locale/ensinamentos/caminhos/misterios-vivos/:slug*',
        permanent: true,
      },
    ];
  },
};

module.exports = withNextIntl(withPWA(withMDX(nextConfig)));
