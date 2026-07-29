'use client';

import { useSyncExternalStore } from 'react';

const emptySubscribe = () => () => {};

/**
 * Hydration shield hook using useSyncExternalStore.
 * Returns true on client after hydration and false during SSR, with zero cascading render overhead.
 */
export function useIsMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
