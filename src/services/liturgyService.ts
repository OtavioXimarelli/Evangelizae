/**
 * liturgyService.ts
 * ─────────────────────────────────────────────────────────────────
 * Client-side Daily Liturgy Engine for Evangelizae
 *
 * Architecture (zero backend):
 *  1. Check localStorage for today's cached liturgy data
 *  2. If no cache → fetch from public CORS-enabled API
 *     Primary:   https://liturgia.up.railway.app/
 *  3. Cache the result in localStorage keyed by YYYY-MM-DD
 *  4. If offline or API error → return pre-bundled fallback data
 *
 * All data is typed. The caller just awaits getDailyLiturgy().
 */

export type LiturgicalColor = 'green' | 'purple' | 'white' | 'red' | 'rose';

export interface Reading {
  /** Display title, e.g. "1ª Leitura (Deuteronômio 30, 10-14)" */
  title: string;
  /** Short biblical reference, e.g. "Dt 30, 10-14" */
  ref: string;
  /** Full text of the reading */
  text: string;
}

export interface DailyLiturgyData {
  /** ISO date string YYYY-MM-DD */
  date: string;
  /** Liturgical weekday label, e.g. "15ª Semana do Tempo Comum" */
  liturgicalDay: string;
  /** Liturgical season color */
  color: LiturgicalColor;
  /** Friendly liturgical season label */
  colorLabel: string;
  /** Saint of the Day — name */
  saintName: string;
  /** Saint of the Day — short title/description */
  saintTitle: string;
  /** Optional saint quote */
  saintQuote?: string;
  firstReading: Reading;
  psalm: Reading & { response: string };
  secondReading?: Reading;
  gospel: Reading;
  /** True if data came from cache/offline fallback */
  isOfflineFallback?: boolean;
}

// ─────────────────────────────────────────────────────────────────
// OFFLINE FALLBACK — pre-bundled data shown when the API is down
// This is a liturgically-accurate example set, not meant to be a
// permanent replacement. API data takes precedence always.
// ─────────────────────────────────────────────────────────────────
const OFFLINE_FALLBACK: DailyLiturgyData = {
  date: new Date().toISOString().split('T')[0],
  liturgicalDay: 'Tempo Comum',
  color: 'green',
  colorLabel: 'Verde — Esperança e Vida',
  saintName: 'Nossa Senhora',
  saintTitle: 'Mãe de Deus e da Igreja',
  saintQuote: '"Fazei o que Ele vos disser." (João 2, 5)',
  firstReading: {
    title: '1ª Leitura (Colossenses 1, 15-20)',
    ref: 'Cl 1, 15-20',
    text: 'Irmãos: Cristo é a imagem do Deus invisível, o primogênito de toda a criatura; porque nele foram criadas todas as coisas, nos céus e na terra, as visíveis e as invisíveis: Tronos, Soberanias, Principados, Potestades. Tudo foi criado por meio dele e para ele.\n\nEle existe antes de todas as coisas e nele tudo subsiste. Ele é também a Cabeça do corpo, que é a Igreja. Ele é o Princípio, o primogênito dentre os mortos, de sorte que em tudo tem a primazia, porque aprouve a Deus fazer habitar nele toda a plenitude e por ele reconciliar consigo todas as coisas, pacificando pelo sangue da sua cruz tanto as coisas da terra como as dos céus.',
  },
  psalm: {
    title: 'Salmo 99(100)',
    ref: 'Sl 99',
    response: 'R. O Senhor é bom, seu amor é eterno!',
    text: 'Aclamai ao Senhor, toda a terra! Servi o Senhor com alegria; apresentai-vos diante dele com júbilo!\n\nSabei que o Senhor é Deus: ele nos criou e nós somos dele; seu povo e o rebanho de seu pasto. Entrai pelas suas portas com ações de graças, por seus átrios com louvores; dai-lhe graças, bendizei seu nome!',
  },
  gospel: {
    title: 'Santo Evangelho segundo São João (1, 1-18)',
    ref: 'Jo 1, 1-18',
    text: 'No princípio era o Verbo, e o Verbo estava junto de Deus, e o Verbo era Deus. No princípio ele estava junto de Deus. Tudo foi feito por meio dele, e sem ele nada foi feito. O que foi feito nele era a vida, e a vida era a luz dos homens.\n\nE a Palavra se fez carne e habitou entre nós. E nós vimos a sua glória, glória que recebe do Pai como Filho único, cheio de graça e de verdade.',
  },
  isOfflineFallback: true,
};

// ─────────────────────────────────────────────────────────────────
// API RESPONSE SHAPE from https://liturgia.up.railway.app/
// ─────────────────────────────────────────────────────────────────
interface ApiResponse {
  data?: string;
  liturgia?: string;
  cor?: string;
  primeiraLeitura?: { referencia?: string; titulo?: string; texto?: string };
  salmo?: { referencia?: string; titulo?: string; refrao?: string; texto?: string };
  segundaLeitura?: { referencia?: string; titulo?: string; texto?: string };
  evangelho?: { referencia?: string; titulo?: string; texto?: string };
  santo?: string;
  // Possible alternative keys from the API
  leituras?: {
    primeiraLeitura?: { referencia?: string; titulo?: string; texto?: string };
    salmo?: { referencia?: string; refrao?: string; texto?: string };
    segundaLeitura?: { referencia?: string; titulo?: string; texto?: string };
    evangelho?: { referencia?: string; titulo?: string; texto?: string };
  };
}

function liturgicalColorLabel(cor?: string): { color: LiturgicalColor; label: string } {
  const c = (cor ?? '').toLowerCase();
  if (c.includes('roxo') || c.includes('purpura') || c.includes('violeta')) return { color: 'purple', label: 'Roxo — Penitência e Espera' };
  if (c.includes('branco') || c.includes('dourado') || c.includes('amarelo')) return { color: 'white', label: 'Branco — Alegria e Solenidade' };
  if (c.includes('vermelho') || c.includes('red')) return { color: 'red', label: 'Vermelho — Espírito Santo e Mártires' };
  if (c.includes('rosa') || c.includes('rose')) return { color: 'rose', label: 'Rosa — Alegria no Meio da Espera' };
  return { color: 'green', label: 'Verde — Esperança e Tempo Comum' };
}

function mapApiToLiturgy(api: ApiResponse, dateStr: string): DailyLiturgyData {
  const { color, label } = liturgicalColorLabel(api.cor);

  // Handle both flat and nested leituras structures
  const primeiraLeitura = api.primeiraLeitura ?? api.leituras?.primeiraLeitura;
  const salmo = api.salmo ?? api.leituras?.salmo;
  const segundaLeitura = api.segundaLeitura ?? api.leituras?.segundaLeitura;
  const evangelho = api.evangelho ?? api.leituras?.evangelho;

  return {
    date: dateStr,
    liturgicalDay: api.liturgia ?? api.data ?? 'Tempo Comum',
    color,
    colorLabel: label,
    saintName: api.santo ?? 'Santo do Dia',
    saintTitle: '',
    firstReading: {
      title: `1ª Leitura (${primeiraLeitura?.referencia ?? ''})`,
      ref: primeiraLeitura?.referencia ?? '',
      text: primeiraLeitura?.texto ?? '',
    },
    psalm: {
      title: `Salmo Responsorial (${salmo?.referencia ?? ''})`,
      ref: salmo?.referencia ?? '',
      response: salmo?.refrao ?? '',
      text: salmo?.texto ?? '',
    },
    secondReading: segundaLeitura?.texto
      ? {
          title: `2ª Leitura (${segundaLeitura.referencia ?? ''})`,
          ref: segundaLeitura.referencia ?? '',
          text: segundaLeitura.texto,
        }
      : undefined,
    gospel: {
      title: `Santo Evangelho (${evangelho?.referencia ?? ''})`,
      ref: evangelho?.referencia ?? '',
      text: evangelho?.texto ?? '',
    },
  };
}

const CACHE_KEY_PREFIX = 'evangelizae-liturgy-';
const API_URLS = ['https://liturgia.up.railway.app/'];

async function fetchFromApi(dateStr: string): Promise<DailyLiturgyData | null> {
  for (const baseUrl of API_URLS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(baseUrl, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);

      if (!res.ok) continue;

      const data: ApiResponse = await res.json();
      const mapped = mapApiToLiturgy(data, dateStr);

      // Validate we got meaningful data
      if (!mapped.gospel.text && !mapped.firstReading.text) continue;

      return mapped;
    } catch {
      // Network error, timeout, or CORS — try next URL or return null
      continue;
    }
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────
export async function getDailyLiturgy(): Promise<DailyLiturgyData> {
  if (typeof window === 'undefined') {
    // SSR safety — return offline fallback during server render
    return OFFLINE_FALLBACK;
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const cacheKey = `${CACHE_KEY_PREFIX}${dateStr}`;

  // 1. Check cache first
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached) as DailyLiturgyData;
      // Validate cached data has real content
      if (parsed.gospel?.text || parsed.firstReading?.text) {
        return parsed;
      }
    }
  } catch {
    // localStorage may be blocked in some browsers
  }

  // 2. Fetch from API
  const fromApi = await fetchFromApi(dateStr);
  if (fromApi) {
    try {
      localStorage.setItem(cacheKey, JSON.stringify(fromApi));
      // Clean up yesterday's cache to save space
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = `${CACHE_KEY_PREFIX}${yesterday.toISOString().split('T')[0]}`;
      localStorage.removeItem(yesterdayKey);
    } catch {
      // Storage full or blocked — silently continue
    }
    return fromApi;
  }

  // 3. Return offline fallback with today's date
  return { ...OFFLINE_FALLBACK, date: dateStr };
}

/** Clear today's cached liturgy (useful for a manual refresh button) */
export function clearLiturgyCache() {
  if (typeof window === 'undefined') return;
  const dateStr = new Date().toISOString().split('T')[0];
  localStorage.removeItem(`${CACHE_KEY_PREFIX}${dateStr}`);
}
