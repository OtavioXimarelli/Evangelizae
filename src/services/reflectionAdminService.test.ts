import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {
  clearAdminToken,
  deleteReflection,
  getAdminToken,
  listReflections,
  setAdminToken,
  upsertReflection,
} from './reflectionAdminService';

const reflection = {date: '2026-11-08', text: 'Vigiai e orai.', attribution: 'Papa Bento XVI, Angelus de 6 de novembro de 2011'};
const range = {from: '2026-11-05', to: '2026-11-11'};

type FetchCall = [string, {method?: string; body?: string; headers: Record<string, string>}];

function mockFetch(payload: {ok: boolean; status: number; json?: () => Promise<unknown>}) {
  const fetchSpy = vi.fn().mockResolvedValue({json: async () => ({}), ...payload});
  vi.stubGlobal('fetch', fetchSpy);
  return fetchSpy.mock.calls as unknown as FetchCall[] & {length: number};
}

describe('reflection admin service', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.example.org/api/v1');
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('keeps the admin token in session storage only', () => {
    expect(getAdminToken()).toBe('');
    setAdminToken('segredo');
    expect(getAdminToken()).toBe('segredo');
    expect(window.localStorage.getItem('evangelizae-reflection-admin-token')).toBeNull();
    clearAdminToken();
    expect(getAdminToken()).toBe('');
  });

  it('lists reflections from the internal base URL with the bearer token', async () => {
    const calls = mockFetch({ok: true, status: 200, json: async () => ({reflections: [reflection]})});
    const result = await listReflections(range, 'segredo');
    expect(result).toEqual([reflection]);
    const [url, init] = calls[0];
    expect(url).toBe('https://api.example.org/internal/v1/reflections?from=2026-11-05&to=2026-11-11');
    expect(init.method).toBe('GET');
    expect(init.headers.Authorization).toBe('Bearer segredo');
    expect(init.headers['Content-Type']).toBeUndefined();
  });

  it('upserts a reflection with a JSON body', async () => {
    const calls = mockFetch({ok: true, status: 200, json: async () => reflection});
    const result = await upsertReflection('2026-11-08', {text: 'Vigiai e orai.', attribution: 'Papa Bento XVI, Angelus de 6 de novembro de 2011'}, 'segredo');
    expect(result).toEqual(reflection);
    const [url, init] = calls[0];
    expect(url).toBe('https://api.example.org/internal/v1/reflections/2026-11-08');
    expect(init.method).toBe('PUT');
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(JSON.parse(init.body ?? '')).toEqual({text: 'Vigiai e orai.', attribution: 'Papa Bento XVI, Angelus de 6 de novembro de 2011'});
  });

  it.each([[401], [403]])('maps %i to REFLECTION_UNAUTHORIZED', async (status) => {
    mockFetch({ok: false, status});
    await expect(listReflections(range, 'x')).rejects.toThrow('REFLECTION_UNAUTHORIZED');
  });

  it('maps 422 to REFLECTION_INVALID', async () => {
    mockFetch({ok: false, status: 422});
    await expect(upsertReflection('2026-11-08', {text: '', attribution: ''}, 'x')).rejects.toThrow('REFLECTION_INVALID');
  });

  it('maps 404 to REFLECTION_NOT_FOUND on delete', async () => {
    mockFetch({ok: false, status: 404});
    await expect(deleteReflection('2026-11-08', 'x')).rejects.toThrow('REFLECTION_NOT_FOUND');
  });

  it('resolves delete on 204 without reading a body', async () => {
    mockFetch({ok: true, status: 204, json: async () => { throw new Error('no body'); }});
    await expect(deleteReflection('2026-11-08', 'x')).resolves.toBeUndefined();
  });

  it('rejects a malformed list payload', async () => {
    mockFetch({ok: true, status: 200, json: async () => ({reflections: [{date: '2026-11-08'}]})});
    await expect(listReflections(range, 'x')).rejects.toThrow('REFLECTION_RESPONSE_INVALID');
  });

  it('fails when the API URL is missing', async () => {
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', '');
    mockFetch({ok: true, status: 200});
    await expect(listReflections(range, 'x')).rejects.toThrow('REFLECTION_API_URL_MISSING');
  });
});
