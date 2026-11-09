import {getInternalApiBaseUrl} from '@/services/apiBase';

export interface DailyReflectionDto {
  date: string;
  text: string;
  attribution: string;
  reference?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReflectionUpsertPayload {
  text: string;
  attribution: string;
  reference?: string;
}

const TOKEN_KEY = 'evangelizae-reflection-admin-token';
const REQUEST_TIMEOUT_MS = 12_000;
const MISSING_URL_ERROR = 'REFLECTION_API_URL_MISSING';

export function getAdminToken(): string {
  if (typeof window === 'undefined') return '';
  return window.sessionStorage.getItem(TOKEN_KEY) ?? '';
}

export function setAdminToken(token: string): void {
  if (typeof window !== 'undefined') window.sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  if (typeof window !== 'undefined') window.sessionStorage.removeItem(TOKEN_KEY);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isDailyReflection(value: unknown): value is DailyReflectionDto {
  if (!isRecord(value) || typeof value.date !== 'string' || typeof value.text !== 'string') return false;
  return typeof value.attribution === 'string' && (value.reference === undefined || typeof value.reference === 'string');
}

async function request(path: string, init: RequestInit, token: string): Promise<unknown> {
  const url = `${getInternalApiBaseUrl(MISSING_URL_ERROR)}${path}`;
  const controller = new AbortController();
  let timedOut = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        ...(init.body ? {'Content-Type': 'application/json'} : {}),
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 401 || response.status === 403) throw new Error('REFLECTION_UNAUTHORIZED');
    if (response.status === 404) throw new Error('REFLECTION_NOT_FOUND');
    if (response.status === 422) throw new Error('REFLECTION_INVALID');
    if (!response.ok) throw new Error(`REFLECTION_API_${response.status}`);
    if (response.status === 204) return null;
    const value: unknown = await response.json();
    return value;
  } catch (error) {
    if (timedOut) throw new Error('REFLECTION_API_TIMEOUT');
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function listReflections(range: {from: string; to: string}, token: string): Promise<DailyReflectionDto[]> {
  const params = new URLSearchParams({from: range.from, to: range.to});
  const value = await request(`/reflections?${params.toString()}`, {method: 'GET'}, token);
  if (!isRecord(value) || !Array.isArray(value.reflections) || !value.reflections.every(isDailyReflection)) {
    throw new Error('REFLECTION_RESPONSE_INVALID');
  }
  return value.reflections;
}

export async function upsertReflection(date: string, payload: ReflectionUpsertPayload, token: string): Promise<DailyReflectionDto> {
  const value = await request(`/reflections/${date}`, {method: 'PUT', body: JSON.stringify(payload)}, token);
  if (!isDailyReflection(value)) throw new Error('REFLECTION_RESPONSE_INVALID');
  return value;
}

export async function deleteReflection(date: string, token: string): Promise<void> {
  await request(`/reflections/${date}`, {method: 'DELETE'}, token);
}
