'use client';

import {useEffect, useState} from 'react';
import {getDayContext, type DayContext} from '@/lib/dayContext';

function snapshot(): DayContext {
  return getDayContext(new Date());
}

export function useDayContext(): DayContext {
  const [context, setContext] = useState<DayContext>(snapshot);

  useEffect(() => {
    const intervalId = setInterval(() => setContext(snapshot()), 60_000);
    return () => clearInterval(intervalId);
  }, []);

  return context;
}
