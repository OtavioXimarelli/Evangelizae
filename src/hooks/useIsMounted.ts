'use client';

import { useState, useEffect } from 'react';

/**
 * Hydration shield hook.
 * Prevents SSR hydration mismatches when rendering client state derived from localStorage or Zustand persist stores.
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
