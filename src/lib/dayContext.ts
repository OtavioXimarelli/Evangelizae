import {getCalendarDateInTimeZone} from '@/lib/date';
import {getDailyMysteryType} from '@/services/rosaryEngine';

export type Daypart = 'dawn' | 'morning' | 'afternoon' | 'night';
export type LiturgicalSeason = 'advent' | 'christmas' | 'lent' | 'easter' | 'ordinary';

export interface DayContext {
  daypart: Daypart;
  season: LiturgicalSeason;
  mystery: ReturnType<typeof getDailyMysteryType>;
}

export function getDaypart(hour: number): Daypart {
  if (hour < 5) return 'dawn';
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'night';
}

function addDays(base: Date, days: number): Date {
  return new Date(base.getFullYear(), base.getMonth(), base.getDate() + days);
}

/**
 * Meeus/Jones/Butcher algorithm for Gregorian Easter Sunday.
 */
export function computeEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

/**
 * First Sunday of Advent: the Sunday on or nearest to November 30.
 */
export function computeFirstAdventSunday(year: number): Date {
  const nov30 = new Date(year, 10, 30);
  const back = nov30.getDay();
  const forward = (7 - back) % 7;
  return addDays(nov30, forward < back ? forward : -back);
}

/**
 * Feast of the Baptism of the Lord closes Christmas time:
 * the Sunday after January 6, or January 7 when Epiphany falls on a Sunday.
 */
export function computeBaptismOfTheLord(year: number): Date {
  const epiphany = new Date(year, 0, 6);
  const dow = epiphany.getDay();
  if (dow === 0) return new Date(year, 0, 7);
  return addDays(epiphany, 7 - dow);
}

interface SeasonSegment {
  season: LiturgicalSeason;
  start: Date;
  end: Date;
}

function buildSegments(year: number): SeasonSegment[] {
  const easter = computeEasterSunday(year);
  const ashWednesday = addDays(easter, -46);
  const pentecost = addDays(easter, 49);
  const adventStart = computeFirstAdventSunday(year);
  const baptismNextYear = computeBaptismOfTheLord(year + 1);

  return [
    {season: 'lent', start: ashWednesday, end: easter},
    {season: 'easter', start: easter, end: addDays(pentecost, 1)},
    {season: 'advent', start: adventStart, end: new Date(year, 11, 25)},
    {season: 'christmas', start: new Date(year, 11, 25), end: addDays(baptismNextYear, 1)},
    {season: 'ordinary', start: new Date(year, 0, 1), end: ashWednesday},
    {season: 'ordinary', start: addDays(pentecost, 1), end: adventStart},
  ];
}

export function getLiturgicalSeason(date: Date): LiturgicalSeason {
  for (const offset of [-1, 0, 1]) {
    const year = date.getFullYear() + offset;
    for (const segment of buildSegments(year)) {
      if (date >= segment.start && date < segment.end) return segment.season;
    }
  }
  return 'ordinary';
}

export function getDayContext(now: Date = new Date()): DayContext {
  const calendarDate = getCalendarDateInTimeZone(now);
  const hour = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    hour: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(now));
  return {
    daypart: getDaypart(Number(hour)),
    season: getLiturgicalSeason(calendarDate),
    mystery: getDailyMysteryType(calendarDate),
  };
}
