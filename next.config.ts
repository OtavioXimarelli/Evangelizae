import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import withSerwistInit from '@serwist/next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  disable: process.env.NODE_ENV === 'development',
  additionalPrecacheEntries: [
    { url: '/pt/offline', revision: '1' },
    { url: '/pt/rosary', revision: '1' },
  ],
});

const nextConfig: NextConfig = {
  output: 'standalone',
  // Turbopack misinferred the workspace root (stray pnpm-workspace.yaml/package.json
  // in $HOME) and hung compiling while scanning the whole home directory.
  turbopack: {
    root: __dirname,
  },
  allowedDevOrigins: ['127.0.0.1'],
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default withSerwist(withNextIntl(nextConfig));
