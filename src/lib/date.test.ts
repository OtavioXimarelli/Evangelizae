import {describe, expect, it} from 'vitest';
import {getDateKeyFromLocalDate, getDateKeyInTimeZone, getLocalDateKey} from './date';

describe('calendar date by timezone', () => {
  it('keeps the São Paulo day before local midnight', () => {
    expect(getDateKeyInTimeZone(new Date('2026-08-26T02:59:59Z'))).toBe('2026-08-25');
    expect(getDateKeyInTimeZone(new Date('2026-08-26T03:00:00Z'))).toBe('2026-08-26');
  });

  it('uses the São Paulo day for local prayer dates', () => {
    expect(getLocalDateKey(new Date('2026-08-26T02:59:59Z'))).toBe('2026-08-25');
  });

  it('builds calendar keys from local date parts without reconverting them', () => {
    expect(getDateKeyFromLocalDate(new Date(2026, 8, 24, 12))).toBe('2026-09-24');
  });
});
