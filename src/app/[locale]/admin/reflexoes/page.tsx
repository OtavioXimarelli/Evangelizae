'use client';

import {FormEvent, useEffect, useMemo, useState} from 'react';
import {useTranslations} from 'next-intl';
import {useIsMounted} from '@/hooks/useIsMounted';
import {getDateKeyInTimeZone} from '@/lib/date';
import {formatLiturgyParagraphs, tokenizeLiturgyQuotes} from '@/lib/liturgyFormat';
import {DailyLiturgyDto, getDailyLiturgy} from '@/services/liturgyService';
import {
  clearAdminToken,
  DailyReflectionDto,
  deleteReflection,
  getAdminToken,
  listReflections,
  setAdminToken,
  upsertReflection,
} from '@/services/reflectionAdminService';

const RANGE_DAYS = 3;

function shiftDateKey(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const shifted = new Date(Date.UTC(year, month - 1, day + days, 12));
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, '0')}-${String(shifted.getUTCDate()).padStart(2, '0')}`;
}

function errorKey(error: unknown, fallback: string): string {
  const code = error instanceof Error ? error.message : '';
  if (code === 'REFLECTION_UNAUTHORIZED') return 'tokenInvalid';
  if (code === 'REFLECTION_INVALID') return 'validationError';
  return fallback;
}

const emptyForm = {text: '', attribution: '', reference: ''};

export default function AdminReflectionsPage() {
  const t = useTranslations('AdminReflections');
  const mounted = useIsMounted();
  const todayKey = useMemo(() => getDateKeyInTimeZone(), []);
  const [token, setToken] = useState(() => getAdminToken());
  const [tokenInput, setTokenInput] = useState('');
  const [authed, setAuthed] = useState(() => Boolean(getAdminToken()));
  const [gateError, setGateError] = useState('');
  const [gateBusy, setGateBusy] = useState(false);
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [rangeReflections, setRangeReflections] = useState<DailyReflectionDto[]>([]);
  const [rangeLoading, setRangeLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<{tone: 'success' | 'error'; message: string} | null>(null);
  const [busy, setBusy] = useState(false);
  const [todayLiturgy, setTodayLiturgy] = useState<DailyLiturgyDto | null>(null);

  const weekDates = useMemo(
    () => Array.from({length: RANGE_DAYS * 2 + 1}, (_, index) => shiftDateKey(selectedDate, index - RANGE_DAYS)),
    [selectedDate],
  );
  const existing = rangeReflections.find((reflection) => reflection.date === selectedDate);
  const gospelReference = selectedDate === todayKey
    ? todayLiturgy?.groups.find((group) => group.kind === 'GOSPEL')?.items.at(0)?.reference
    : undefined;

  const logout = (message = '') => {
    clearAdminToken();
    setToken('');
    setAuthed(false);
    setGateError(message);
  };

  const loadRange = async (dateKey: string, authToken = token) => {
    setRangeLoading(true);
    try {
      const reflections = await listReflections({from: shiftDateKey(dateKey, -RANGE_DAYS), to: shiftDateKey(dateKey, RANGE_DAYS)}, authToken);
      setRangeReflections(reflections);
      const current = reflections.find((reflection) => reflection.date === dateKey);
      setForm(current ? {text: current.text, attribution: current.attribution, reference: current.reference ?? ''} : emptyForm);
      setStatus(null);
      return true;
    } catch (error) {
      if (error instanceof Error && error.message === 'REFLECTION_UNAUTHORIZED') {
        logout(t('tokenInvalid'));
      } else {
        setStatus({tone: 'error', message: t('loadError')});
      }
      return false;
    } finally {
      setRangeLoading(false);
    }
  };

  useEffect(() => {
    if (!mounted || !authed) return;
    let active = true;
    const timeoutId = window.setTimeout(() => {
      if (active) void loadRange(selectedDate);
    }, 0);
    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, authed, selectedDate]);

  useEffect(() => {
    if (!mounted || !authed) return;
    getDailyLiturgy().then(setTodayLiturgy).catch(() => setTodayLiturgy(null));
  }, [mounted, authed]);

  const enter = async (event: FormEvent) => {
    event.preventDefault();
    const candidate = tokenInput.trim();
    if (!candidate) return;
    setGateBusy(true);
    setGateError('');
    try {
      await listReflections({from: shiftDateKey(todayKey, -RANGE_DAYS), to: shiftDateKey(todayKey, RANGE_DAYS)}, candidate);
      setAdminToken(candidate);
      setToken(candidate);
      setTokenInput('');
      setAuthed(true);
    } catch (error) {
      setGateError(t(errorKey(error, 'tokenNetworkError')));
    } finally {
      setGateBusy(false);
    }
  };

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.text.trim() || !form.attribution.trim()) {
      setStatus({tone: 'error', message: t('requiredHint')});
      return;
    }
    setBusy(true);
    try {
      await upsertReflection(selectedDate, {
        text: form.text.trim(),
        attribution: form.attribution.trim(),
        ...(form.reference.trim() ? {reference: form.reference.trim()} : {}),
      }, token);
      await loadRange(selectedDate);
      setStatus({tone: 'success', message: t('saved')});
    } catch (error) {
      setStatus({tone: 'error', message: t(errorKey(error, 'saveError'))});
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(t('deleteConfirm', {date: selectedDate}))) return;
    setBusy(true);
    try {
      await deleteReflection(selectedDate, token);
    } catch (error) {
      if (!(error instanceof Error && error.message === 'REFLECTION_NOT_FOUND')) {
        setStatus({tone: 'error', message: t(errorKey(error, 'deleteError'))});
        setBusy(false);
        return;
      }
    }
    await loadRange(selectedDate);
    setStatus({tone: 'success', message: t('deleted')});
    setBusy(false);
  };

  if (!mounted) return <div className="page-wrap section-pad" />;

  const previewParagraphs = formatLiturgyParagraphs(form.text, 'EXTRA');

  return (
    <div className="page-wrap admin-reflections">
      <header className="page-header statement-header"><span className="eyebrow">{t('eyebrow')}</span><h1 className="page-title">{t('title')}</h1><p className="lede">{t('subtitle')}</p></header>
      {!authed ? (
        <section className="paper-panel section-pad admin-gate">
          <form className="form-stack" onSubmit={enter}>
            <div className="field">
              <label htmlFor="admin-token">{t('tokenLabel')}</label>
              <input id="admin-token" type="password" autoComplete="off" value={tokenInput} onChange={(event) => setTokenInput(event.target.value)} />
              <p className="field-hint">{t('tokenBody')}</p>
            </div>
            <button className="button" type="submit" disabled={gateBusy}>{t('tokenSubmit')}</button>
            {gateError && <p className="status-message" data-tone="error" role="alert">{gateError}</p>}
          </form>
        </section>
      ) : (
        <div className="admin-grid">
          <section className="paper-panel section-pad">
            <div className="admin-datebar">
              <button className="button button-secondary" type="button" onClick={() => setSelectedDate(shiftDateKey(selectedDate, -1))}>{t('previousDay')}</button>
              <div className="field">
                <label htmlFor="admin-date">{t('dateLabel')}</label>
                <input id="admin-date" type="date" value={selectedDate} onChange={(event) => event.target.value && setSelectedDate(event.target.value)} />
              </div>
              <button className="button button-secondary" type="button" onClick={() => setSelectedDate(shiftDateKey(selectedDate, 1))}>{t('nextDay')}</button>
            </div>
            <div className="admin-week" role="group" aria-label={t('dateLabel')}>
              {weekDates.map((dateKey) => {
                const hasReflection = rangeReflections.some((reflection) => reflection.date === dateKey);
                return (
                  <button
                    key={dateKey}
                    type="button"
                    className="admin-day"
                    data-active={dateKey === selectedDate || undefined}
                    data-filled={hasReflection || undefined}
                    title={`${dateKey}${hasReflection ? ` · ${t('hasReflection')}` : ''}`}
                    onClick={() => setSelectedDate(dateKey)}
                  >
                    {dateKey.slice(8)}
                  </button>
                );
              })}
            </div>
            {gospelReference && <p className="field-hint">{t('gospelOfTheDay', {reference: gospelReference})}</p>}
            {rangeLoading && <p className="status-message" role="status">{t('loading')}</p>}
            <form className="form-stack" onSubmit={save}>
              <div className="field">
                <label htmlFor="reflection-text">{t('textLabel')}</label>
                <textarea id="reflection-text" rows={10} value={form.text} onChange={(event) => setForm({...form, text: event.target.value})} />
              </div>
              <div className="field">
                <label htmlFor="reflection-attribution">{t('attributionLabel')}</label>
                <input id="reflection-attribution" maxLength={300} value={form.attribution} onChange={(event) => setForm({...form, attribution: event.target.value})} />
              </div>
              <div className="field">
                <label htmlFor="reflection-reference">{t('referenceLabel')}</label>
                <input id="reflection-reference" maxLength={120} value={form.reference} onChange={(event) => setForm({...form, reference: event.target.value})} />
              </div>
              <div className="admin-actions">
                <button className="button" type="submit" disabled={busy}>{t('save')}</button>
                {existing && <button className="button button-secondary" type="button" disabled={busy} onClick={() => void remove()}>{t('delete')}</button>}
                <button className="button button-secondary" type="button" onClick={() => logout()}>{t('tokenForget')}</button>
              </div>
              {status && <p className="status-message" data-tone={status.tone} role="status">{status.message}</p>}
            </form>
          </section>
          <aside className="paper-panel section-pad admin-preview">
            <span className="eyebrow">{t('preview')}</span>
            {previewParagraphs.length === 0 ? (
              <p className="field-hint">{t('previewEmpty')}</p>
            ) : (
              <div className="reading-body">
                {previewParagraphs.map((paragraph, pIndex) => (
                  <p key={pIndex} className="reading-paragraph">
                    {tokenizeLiturgyQuotes(paragraph).map((segment, segIndex) =>
                      segment.type === 'quote'
                        ? <span key={segIndex} className="liturgy-quote">{segment.value}</span>
                        : <span key={segIndex}>{segment.value}</span>,
                    )}
                  </p>
                ))}
              </div>
            )}
            {form.attribution.trim() && (
              <p className="liturgy-source reflection-attribution">
                {form.attribution.trim()}
                {form.reference.trim() ? ` · ${form.reference.trim()}` : ''}
              </p>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
