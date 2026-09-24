import {describe, expect, it} from 'vitest';
import {
  computeBaptismOfTheLord,
  computeEasterSunday,
  computeFirstAdventSunday,
  getDayContext,
  getDaypart,
  getLiturgicalSeason
} from './dayContext';

const d = (year: number, month: number, day: number) => new Date(year, month - 1, day);

describe('daypart', () => {
  it('splits the liturgical hours of the day', () => {
    expect(getDaypart(0)).toBe('dawn');
    expect(getDaypart(4)).toBe('dawn');
    expect(getDaypart(5)).toBe('morning');
    expect(getDaypart(11)).toBe('morning');
    expect(getDaypart(12)).toBe('afternoon');
    expect(getDaypart(17)).toBe('afternoon');
    expect(getDaypart(18)).toBe('night');
    expect(getDaypart(23)).toBe('night');
  });
});

describe('Easter computation (Meeus/Jones/Butcher)', () => {
  it('matches the official Gregorian dates for 2026-2030', () => {
    expect(computeEasterSunday(2026)).toEqual(d(2026, 4, 5));
    expect(computeEasterSunday(2027)).toEqual(d(2027, 3, 28));
    expect(computeEasterSunday(2028)).toEqual(d(2028, 4, 16));
    expect(computeEasterSunday(2029)).toEqual(d(2029, 4, 1));
    expect(computeEasterSunday(2030)).toEqual(d(2030, 4, 21));
  });

  it('always lands on a Sunday across a century', () => {
    for (let year = 2001; year <= 2100; year++) {
      expect(computeEasterSunday(year).getDay()).toBe(0);
    }
  });
});

describe('season boundaries', () => {
  it('starts Advent on the Sunday nearest November 30', () => {
    expect(computeFirstAdventSunday(2025)).toEqual(d(2025, 11, 30));
    expect(computeFirstAdventSunday(2026)).toEqual(d(2026, 11, 29));
    expect(computeFirstAdventSunday(2027)).toEqual(d(2027, 11, 28));
    expect(computeFirstAdventSunday(2030)).toEqual(d(2030, 12, 1));
  });

  it('closes Christmas with the Baptism of the Lord', () => {
    expect(computeBaptismOfTheLord(2027)).toEqual(d(2027, 1, 10));
    expect(computeBaptismOfTheLord(2029)).toEqual(d(2029, 1, 7));
  });

  it('classifies representative dates of every season', () => {
    // Lent: Ash Wednesday 2026 is February 18; Easter Sunday April 5.
    expect(getLiturgicalSeason(d(2026, 2, 17))).toBe('ordinary');
    expect(getLiturgicalSeason(d(2026, 2, 18))).toBe('lent');
    expect(getLiturgicalSeason(d(2026, 4, 4))).toBe('lent');
    // Easter season through Pentecost (May 24, 2026).
    expect(getLiturgicalSeason(d(2026, 4, 5))).toBe('easter');
    expect(getLiturgicalSeason(d(2026, 5, 24))).toBe('easter');
    expect(getLiturgicalSeason(d(2026, 5, 25))).toBe('ordinary');
    // Advent and Christmas spanning the year boundary.
    expect(getLiturgicalSeason(d(2026, 11, 28))).toBe('ordinary');
    expect(getLiturgicalSeason(d(2026, 11, 29))).toBe('advent');
    expect(getLiturgicalSeason(d(2026, 12, 24))).toBe('advent');
    expect(getLiturgicalSeason(d(2026, 12, 25))).toBe('christmas');
    expect(getLiturgicalSeason(d(2027, 1, 10))).toBe('christmas');
    expect(getLiturgicalSeason(d(2027, 1, 11))).toBe('ordinary');
  });
});

describe('getDayContext', () => {
  it('composes daypart, season and daily mystery from one date', () => {
    const context = getDayContext(new Date(2026, 11, 27, 19, 30));
    expect(context.daypart).toBe('night');
    expect(context.season).toBe('christmas');
    expect(context.mystery).toBe('gloriosos');
  });

  it('uses the São Paulo calendar day at the UTC boundary', () => {
    const context = getDayContext(new Date('2026-12-27T02:30:00Z'));
    expect(context.daypart).toBe('night');
    expect(context.season).toBe('christmas');
    expect(context.mystery).toBe('gozosos');
  });
});
