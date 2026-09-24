export function getDatePartsInTimeZone(date: Date = new Date(), timeZone = 'America/Sao_Paulo') {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
  };
}

export function getLocalDateKey(date: Date = new Date(), timeZone = 'America/Sao_Paulo'): string {
  const parts = getDatePartsInTimeZone(date, timeZone);
  return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
}

export function getDateKeyInTimeZone(
  date: Date = new Date(),
  timeZone = 'America/Sao_Paulo',
): string {
  return getLocalDateKey(date, timeZone);
}

export function getCalendarDateInTimeZone(date: Date = new Date(), timeZone = 'America/Sao_Paulo'): Date {
  const parts = getDatePartsInTimeZone(date, timeZone);
  return new Date(parts.year, parts.month - 1, parts.day, 12);
}

export function calendarDayDifference(earlier: string, later: string): number {
  const [earlierYear, earlierMonth, earlierDay] = earlier.split('-').map(Number);
  const [laterYear, laterMonth, laterDay] = later.split('-').map(Number);
  const earlierUtc = Date.UTC(earlierYear, earlierMonth - 1, earlierDay);
  const laterUtc = Date.UTC(laterYear, laterMonth - 1, laterDay);
  return Math.round((laterUtc - earlierUtc) / 86_400_000);
}

export function getResolvedTimeZone(): string {
  return 'America/Sao_Paulo';
}
