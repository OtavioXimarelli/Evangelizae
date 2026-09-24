import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {getDailyLiturgy} from './liturgyService';

function apiLiturgy(date: string, freshness: 'LIVE' | 'CACHED' = 'LIVE') {
  return {
    date,
    title: 'Liturgia de teste',
    color: 'GREEN',
    prayers: {},
    groups: [{kind: 'GOSPEL', items: [{title: 'Evangelho', reference: 'Jo 1,1', text: 'No princípio era o Verbo.'}]}],
    source: {provider: 'API de teste', fetchedAt: `${date}T12:00:00.000Z`, freshness},
  };
}

describe('daily liturgy client', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', '');
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it('returns the embedded readings when the API URL is unavailable', async () => {
    vi.setSystemTime(new Date('2026-08-26T15:00:00Z'));
    const fetchSpy = vi.fn();
    vi.stubGlobal('fetch', fetchSpy);
    const result = await getDailyLiturgy({force: true});
    expect(result.date).toBe('2026-08-26');
    expect(result.groups.map((group) => group.kind)).toEqual(['FIRST_READING', 'PSALM', 'GOSPEL']);
    expect(result.source.freshness).toBe('EMBEDDED');
    expect(result.source.provider).toContain('Pe. António Pereira de Figueiredo');
    expect(result.source.provider).toContain('Vulgata');
    expect(result.source.provider).not.toContain('Bíblia Livre');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('prefers API data over embedded content during the bridge', async () => {
    vi.setSystemTime(new Date('2026-08-26T15:00:00Z'));
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.example.org/api/v1');
    const fetchSpy = vi.fn().mockResolvedValue({ok: true, status: 200, json: async () => apiLiturgy('2026-08-26')});
    vi.stubGlobal('fetch', fetchSpy);

    const result = await getDailyLiturgy();

    expect(result.title).toBe('Liturgia de teste');
    expect(result.source.freshness).toBe('LIVE');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['2026-08-25', '2Ts 2,1-3a.14-17', 'Mt 23,23-26'],
    ['2026-08-26', '2Ts 3,6-10.16-18', 'Mt 23,27-32'],
    ['2026-08-27', '1Cor 1,1-9', 'Mt 24,42-51'],
    ['2026-08-28', '1Cor 1,17-25', 'Mt 25,1-13'],
    ['2026-08-29', 'Jr 1,17-19', 'Mc 6,17-29'],
    ['2026-08-30', 'Jr 20,7-9', 'Mt 16,21-27'],
    ['2026-08-31', '1Cor 2,1-5', 'Lc 4,16-30'],
    ['2026-09-01', '1Cor 2,10b-16', 'Lc 4,31-37'],
  ])('keeps the reviewed references for %s', async (date, firstReading, gospel) => {
    vi.setSystemTime(new Date(`${date}T15:00:00Z`));
    const result = await getDailyLiturgy();
    expect(result.date).toBe(date);
    expect(result.groups.at(0)?.items.at(0)?.reference).toBe(firstReading);
    expect(result.groups.at(-1)?.items.at(0)?.reference).toBe(gospel);
  });

  it('uses the America/Sao_Paulo calendar day at the UTC boundary', async () => {
    vi.setSystemTime(new Date('2026-08-26T02:30:00Z'));
    await expect(getDailyLiturgy()).resolves.toMatchObject({date: '2026-08-25'});
  });

  it('fails closed after the declared embedded range when the API is unavailable', async () => {
    vi.setSystemTime(new Date('2026-09-02T15:00:00Z'));
    await expect(getDailyLiturgy()).rejects.toThrow('LITURGY_API_URL_MISSING');
  });

  it('fetches the current day from the external API and caches it', async () => {
    vi.setSystemTime(new Date('2026-09-02T15:00:00Z'));
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.example.org/api/v1');
    const fetchSpy = vi.fn().mockResolvedValue({ok: true, status: 200, json: async () => apiLiturgy('2026-09-02')});
    vi.stubGlobal('fetch', fetchSpy);

    const first = await getDailyLiturgy();
    const second = await getDailyLiturgy();

    expect(first.source.freshness).toBe('LIVE');
    expect(second.source.freshness).toBe('CACHED');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy).toHaveBeenCalledWith(
      expect.stringContaining('/liturgy/today?timezone=America%2FSao_Paulo&locale=pt-BR'),
      expect.objectContaining({cache: 'no-store'}),
    );
  });

  it('returns the same-day cache when the API is unavailable', async () => {
    vi.setSystemTime(new Date('2026-09-02T15:00:00Z'));
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.example.org/api/v1');
    const fetchSpy = vi.fn()
      .mockResolvedValueOnce({ok: true, status: 200, json: async () => apiLiturgy('2026-09-02')})
      .mockRejectedValueOnce(new Error('network down'));
    vi.stubGlobal('fetch', fetchSpy);

    await getDailyLiturgy();
    const result = await getDailyLiturgy({force: true});

    expect(result.source.freshness).toBe('CACHED');
    expect(result.date).toBe('2026-09-02');
  });

  it.each([
    ['refrain', (value: ReturnType<typeof apiLiturgy>) => ({...value, groups: [{...value.groups[0], items: [{...value.groups[0].items[0], refrain: 42}]}]})],
    ['prayers', (value: ReturnType<typeof apiLiturgy>) => ({...value, prayers: {collect: 42}})],
    ['fetchedAt', (value: ReturnType<typeof apiLiturgy>) => ({...value, source: {...value.source, fetchedAt: 'not-a-date'}})],
  ])('rejects a response with invalid %s', async (_field, mutate) => {
    vi.setSystemTime(new Date('2026-09-02T15:00:00Z'));
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.example.org/api/v1');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok: true, status: 200, json: async () => mutate(apiLiturgy('2026-09-02'))}));

    await expect(getDailyLiturgy()).rejects.toThrow('LITURGY_RESPONSE_INVALID');
  });

  it('rejects a response for another date', async () => {
    vi.setSystemTime(new Date('2026-09-02T15:00:00Z'));
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.example.org/api/v1');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok: true, status: 200, json: async () => apiLiturgy('2026-09-01')}));

    await expect(getDailyLiturgy()).rejects.toThrow('LITURGY_RESPONSE_INVALID');
  });

  it('rejects an API request that exceeds the timeout', async () => {
    vi.setSystemTime(new Date('2026-09-02T15:00:00Z'));
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.example.org/api/v1');
    vi.stubGlobal('fetch', vi.fn((_url: string, options: {signal?: AbortSignal}) => new Promise((_, reject) => {
      options.signal?.addEventListener('abort', () => reject(new Error('aborted')));
    })));
    const request = getDailyLiturgy();
    const rejection = expect(request).rejects.toThrow('LITURGY_API_TIMEOUT');
    await vi.advanceTimersByTimeAsync(12_000);
    await rejection;
  });

  it('rejects an API response when no same-day cache exists', async () => {
    vi.setSystemTime(new Date('2026-09-02T15:00:00Z'));
    vi.stubEnv('NEXT_PUBLIC_API_BASE_URL', 'https://api.example.org/api/v1');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ok: false, status: 503}));

    await expect(getDailyLiturgy()).rejects.toThrow('LITURGY_API_503');
  });
});
