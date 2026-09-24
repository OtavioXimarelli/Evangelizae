import {getDateKeyInTimeZone} from '@/lib/date';
import {getEmbeddedDailyLiturgy} from '@/data/embeddedDailyLiturgy';

export type LiturgicalColor = 'GREEN' | 'WHITE' | 'RED' | 'PURPLE' | 'ROSE';
export type ReadingKind = 'FIRST_READING' | 'PSALM' | 'SECOND_READING' | 'GOSPEL' | 'EXTRA';

export interface LiturgyReadingDto {
  title: string;
  reference?: string;
  text: string;
  refrain?: string;
}

export interface LiturgyGroupDto {
  kind: ReadingKind;
  items: LiturgyReadingDto[];
}

export interface DailyLiturgyDto {
  date: string;
  title: string;
  color: LiturgicalColor;
  prayers: {
    collect?: string;
    offerings?: string;
    communion?: string;
  };
  groups: LiturgyGroupDto[];
  source: {
    provider: string;
    fetchedAt: string;
    freshness: 'LIVE' | 'CACHED' | 'EMBEDDED';
  };
}

const CACHE_PREFIX = 'evangelizae-liturgy-v2-';
const LITURGY_PATH = '/liturgy/today';
const TIME_ZONE = 'America/Sao_Paulo';
const LOCALE = 'pt-BR';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isLiturgicalColor(value: unknown): value is LiturgicalColor {
  return value === 'GREEN' || value === 'WHITE' || value === 'RED' || value === 'PURPLE' || value === 'ROSE';
}

function isReadingKind(value: unknown): value is ReadingKind {
  return value === 'FIRST_READING' || value === 'PSALM' || value === 'SECOND_READING' || value === 'GOSPEL' || value === 'EXTRA';
}

function isLiturgyReading(value: unknown): value is LiturgyReadingDto {
  if (!isRecord(value) || typeof value.title !== 'string' || typeof value.text !== 'string') return false;
  return value.reference === undefined || typeof value.reference === 'string';
}

function isLiturgyGroup(value: unknown): value is LiturgyGroupDto {
  return isRecord(value) && isReadingKind(value.kind) && Array.isArray(value.items) && value.items.every(isLiturgyReading);
}

function isDailyLiturgy(value: unknown, expectedDate: string): value is DailyLiturgyDto {
  if (!isRecord(value) || value.date !== expectedDate || typeof value.title !== 'string' || !isLiturgicalColor(value.color)) return false;
  if (!isRecord(value.prayers) || !Array.isArray(value.groups) || !value.groups.every(isLiturgyGroup)) return false;
  if (!isRecord(value.source) || typeof value.source.provider !== 'string' || typeof value.source.fetchedAt !== 'string') return false;
  return value.source.freshness === 'LIVE' || value.source.freshness === 'CACHED';
}

function getApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!baseUrl) throw new Error('LITURGY_API_URL_MISSING');
  return baseUrl.replace(/\/+$/, '');
}

function getCacheKey(date: string): string {
  return `${CACHE_PREFIX}${date}`;
}

function readCache(date: string): DailyLiturgyDto | null {
  if (typeof window === 'undefined') return null;
  try {
    const value: unknown = JSON.parse(localStorage.getItem(getCacheKey(date)) ?? 'null');
    return isDailyLiturgy(value, date) ? value : null;
  } catch {
    return null;
  }
}

function writeCache(liturgy: DailyLiturgyDto): void {
  try {
    localStorage.setItem(getCacheKey(liturgy.date), JSON.stringify(liturgy));
  } catch {
    return;
  }
}

async function fetchDailyLiturgy(date: string): Promise<DailyLiturgyDto> {
  const url = new URL(`${getApiBaseUrl()}${LITURGY_PATH}`);
  url.searchParams.set('timezone', TIME_ZONE);
  url.searchParams.set('locale', LOCALE);
  const response = await fetch(url.toString(), {cache: 'no-store'});
  if (!response.ok) throw new Error(`LITURGY_API_${response.status}`);
  const value: unknown = await response.json();
  if (!isDailyLiturgy(value, date)) throw new Error('LITURGY_RESPONSE_INVALID');
  writeCache(value);
  return value;
}

function asCached(liturgy: DailyLiturgyDto): DailyLiturgyDto {
  return {...liturgy, source: {...liturgy.source, freshness: 'CACHED'}};
}

export async function getDailyLiturgy(options: {force?: boolean} = {}): Promise<DailyLiturgyDto> {
  if (typeof window === 'undefined') throw new Error('LITURGY_CLIENT_ONLY');
  const date = getDateKeyInTimeZone();
  const embedded = getEmbeddedDailyLiturgy(date);
  if (embedded) return embedded;
  const cached = options.force ? null : readCache(date);
  if (cached) return asCached(cached);
  try {
    return await fetchDailyLiturgy(date);
  } catch (error) {
    const fallback = readCache(date);
    if (fallback) return asCached(fallback);
    throw error;
  }
}

export function clearLiturgyCache() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(getCacheKey(getDateKeyInTimeZone()));
  }
}
