import {describe, expect, it} from 'vitest';
import {getDateKeyInTimeZone, getLocalDateKey} from './date';

describe('calendar date by timezone', () => {
  it('keeps the São Paulo day before local midnight', () => {
    expect(getDateKeyInTimeZone(new Date('2026-08-26T02:59:59Z'))).toBe('2026-08-25');
    expect(getDateKeyInTimeZone(new Date('2026-08-26T03:00:00Z'))).toBe('2026-08-26');
  });

  it('uses the São Paulo day for local prayer dates', () => {
    expect(getLocalDateKey(new Date('2026-08-26T02:59:59Z'))).toBe('2026-08-25');
  });
});
