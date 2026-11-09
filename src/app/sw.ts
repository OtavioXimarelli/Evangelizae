import {defaultCache} from '@serwist/next/worker';
import {NetworkOnly, Serwist, type PrecacheEntry, type SerwistGlobalConfig} from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope & typeof globalThis & {
  __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  // Internal/editorial endpoints are authenticated and must never be cached or
  // mediated by the SW (avoids noisy no-response errors when CORS/network fail).
  runtimeCaching: [
    {
      matcher({url}) {
        return url.pathname.startsWith('/internal/');
      },
      handler: new NetworkOnly(),
    },
    ...defaultCache,
  ],
  fallbacks: {
    entries: [{
      url: '/pt/offline',
      matcher({request}) {
        return request.destination === 'document';
      },
    }],
  },
});

serwist.addEventListeners();
