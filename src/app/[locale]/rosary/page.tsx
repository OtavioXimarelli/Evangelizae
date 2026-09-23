'use client';

import {FormEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ArrowLeft, ArrowRight} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import {useIsMounted} from '@/hooks/useIsMounted';
import {useDayContext} from '@/hooks/useDayContext';
import {SacredOrnament} from '@/components/brand/SacredOrnament';
import {buildRosarySequence, MysteryType, ROSARY_MYSTERIES} from '@/services/rosaryEngine';
import {usePrayerStore} from '@/store/usePrayerStore';

const mysteryTranslation = {gozosos: 'joyful', luminosos: 'luminous', dolorosos: 'sorrowful', gloriosos: 'glorious'} as const;

export function MysteryGate({todayMystery}: {todayMystery: MysteryType}) {
  const t = useTranslations('Rosary');
  const locale = useLocale();
  const prayer = usePrayerStore();

  return (
    <div className="reading-wrap section-pad mystery-gate">
      <div className="mystery-gate-card">
        <span className="eyebrow">{t('gateEyebrow')}</span>
        <h1 className="page-title">{t('chooseMystery')}</h1>
        <p className="lede">{t('gateSubtitle')}</p>
        <button type="button" className="button mystery-gate-cta" onClick={() => prayer.initRosary(todayMystery)}>
          {t('prayTodayAction')}
        </button>
        <div className="mystery-gate-grid">
          {(Object.keys(ROSARY_MYSTERIES) as MysteryType[]).map((type) => {
            const group = ROSARY_MYSTERIES[type];
            const name = (locale === 'en' ? group.titleEn : group.titlePt).replace(/\s*\([^)]*\)\s*$/, '');
            const theme = (locale === 'en' ? group.titleEn : group.titlePt).match(/\(([^)]+)\)/)?.[1];
            const isToday = type === todayMystery;
            return (
              <button
                key={type}
                type="button"
                className="mystery-gate-option"
                data-today={isToday || undefined}
                onClick={() => prayer.initRosary(type)}
              >
                {isToday && <span className="mystery-gate-badge">{t('todayBadge')}</span>}
                <span className="mystery-gate-name">{name}</span>
                <span className="mystery-gate-meta">
                  {theme && <span>{theme}</span>}
                  <span>{locale === 'en' ? group.daysEn : group.daysPt}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function RosaryPage() {
  const t = useTranslations('Rosary');
  const locale = useLocale();
  const mounted = useIsMounted();
  const prayer = usePrayerStore();
  const today = useDayContext();
  const [showLatin, setShowLatin] = useState(false);
  const [showIntentions, setShowIntentions] = useState(false);
  const [newIntention, setNewIntention] = useState('');
  const [gateAfterCompletion, setGateAfterCompletion] = useState(false);
  const intentionsRef = useRef<HTMLDivElement>(null);
  const intentionsTriggerRef = useRef<HTMLButtonElement>(null);
  const steps = useMemo(() => buildRosarySequence(prayer.activeMysteryType), [prayer.activeMysteryType]);
  const currentStep = steps[Math.min(prayer.currentStepIndex, steps.length - 1)];

  const decades = useMemo(
    () => ROSARY_MYSTERIES[prayer.activeMysteryType].decades.map((mystery) => ({
      mystery,
      first: steps.findIndex((step) => step.type === 'mystery_intro' && step.decadeNumber === mystery.decadeNumber),
      last: steps.findIndex((step) => step.id === `decade-${mystery.decadeNumber}-glory`),
    })),
    [steps, prayer.activeMysteryType],
  );

  const next = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(12);
    if (prayer.currentStepIndex >= steps.length - 1) prayer.completeRosary(); else prayer.advanceStep(steps.length);
  }, [prayer, steps.length]);

  useEffect(() => {
    if (!mounted || prayer.isCompleted || !prayer.sessionStartedAt) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      if (event.key === 'ArrowRight') next();
      if (event.key === 'ArrowLeft' && prayer.currentStepIndex > 0) prayer.previousStep();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mounted, prayer, next]);

  useEffect(() => {
    if (!prayer.sessionStartedAt || prayer.isCompleted) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [prayer.sessionStartedAt, prayer.isCompleted]);

  useEffect(() => {
    if (!showIntentions || !intentionsRef.current) return;
    const panel = intentionsRef.current;
    const trigger = intentionsTriggerRef.current;
    const getFocusable = () => Array.from(panel.querySelectorAll<HTMLElement>('input:not(:disabled), button:not(:disabled), [tabindex]:not([tabindex="-1"])'));
    const focusables = getFocusable();
    focusables[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowIntentions(false);
        trigger?.focus();
        return;
      }
      if (event.key !== 'Tab') return;
      const current = getFocusable();
      if (current.length === 0) return;
      const first = current[0];
      const last = current[current.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      trigger?.focus();
    };
  }, [showIntentions, prayer.intentions.length, newIntention]);

  if (!mounted) return <div className="reading-wrap section-pad" />;

  if (prayer.isCompleted && !gateAfterCompletion) {
    return (
      <div className="reading-wrap section-pad completion-screen">
        <SacredOrnament className="completion-ornament" />
        <div className="hero-copy">
          <span className="eyebrow">{t('completedEyebrow')}</span>
          <h1 className="page-title">{t('completedTitle')}</h1>
          <p className="lede">{t('completedBody')}</p>
          <div className="completion-reflection">
            <label htmlFor="reflection-input" className="completion-reflection-label">
              {t('reflectionPrompt')}
            </label>
            <textarea
              id="reflection-input"
              className="completion-reflection-input"
              rows={3}
              maxLength={500}
              value={prayer.reflection}
              onChange={(e) => prayer.setReflection(e.target.value)}
              placeholder={t('reflectionPlaceholder')}
            />
          </div>
          <div className="hero-actions">
            <Link href="/sanctuary" className="button">{t('returnSanctuary')}</Link>
            <button className="button button-secondary" onClick={() => setGateAfterCompletion(true)}>{t('prayAgain')}</button>
          </div>
        </div>
      </div>
    );
  }

  // The gate must react to the store, not to a stale flag: once a mystery is
  // chosen, initRosary clears isCompleted and the room renders immediately.
  if (!prayer.sessionStartedAt || (gateAfterCompletion && prayer.isCompleted)) {
    return <MysteryGate todayMystery={today.mystery} />;
  }

  const addIntention = (event: FormEvent) => { event.preventDefault(); prayer.addIntention(newIntention); setNewIntention(''); };
  const title = locale === 'en' ? currentStep.titleEn : currentStep.titlePt;
  const body = locale === 'en' ? currentStep.prayerTextEn : currentStep.prayerTextPt;
  const displayTitle = currentStep.type.startsWith('decade_') ? title.replace(/\s*\([^)]*\)\s*$/, '') : title;
  const fruit = currentStep.mystery ? (locale === 'en' ? currentStep.mystery.fruitEn : currentStep.mystery.fruitPt) : null;

  const beadFill = currentStep.type === 'decade_hail_mary' ? (currentStep.beadInDecade ?? 0) : currentStep.type === 'decade_glory_fatima' ? 10 : 0;
  const inDecade = currentStep.type.startsWith('decade_');
  const isDailyMystery = prayer.activeMysteryType === today.mystery;
  const progressPercent = Math.round(((prayer.currentStepIndex + 1) / steps.length) * 100);

  return (
    <div className="prayer-layout">
      <article className="prayer-main">
        <div className="prayer-progress" aria-label={t('progress', {current: prayer.currentStepIndex + 1, total: steps.length})}><span style={{width: `${progressPercent}%`}} /></div>
        <div className="prayer-toolbar">
          <span className="prayer-toolbar-context">
            {isDailyMystery && <span className="daily-mystery-chip">{t('todayBadge')}</span>}
            {t(mysteryTranslation[prayer.activeMysteryType])}
          </span>
          <span className="prayer-toolbar-progress" aria-hidden="true">{progressPercent}%</span>
          <span className="prayer-toolbar-actions">
            <button ref={intentionsTriggerRef} className="button button-quiet" onClick={() => setShowIntentions(!showIntentions)} aria-expanded={showIntentions} aria-controls="intentions-panel">{t('intentionsTitle')}</button>
            <button className="button button-quiet" onClick={() => setShowLatin(!showLatin)} disabled={!currentStep.latinText}>{showLatin ? t('hideLatin') : t('showLatin')}</button>
          </span>
        </div>

        <nav className="decade-strip" aria-label={t('stepsLabel')}>
          {decades.map(({mystery, first, last}) => {
            const isCurrent = currentStep.decadeNumber === mystery.decadeNumber || prayer.currentStepIndex > first && prayer.currentStepIndex < (last < 0 ? steps.length : last);
            const isComplete = last >= 0 && prayer.furthestStepIndex >= last && !isCurrent;
            return (
              <button
                key={mystery.decadeNumber}
                type="button"
                className="decade-bead"
                data-current={isCurrent || undefined}
                data-complete={isComplete || undefined}
                disabled={first > prayer.furthestStepIndex}
                onClick={() => prayer.setStep(first)}
                aria-label={`${mystery.decadeNumber}º ${locale === 'en' ? mystery.nameEn : mystery.namePt}`}
                aria-current={currentStep.decadeNumber === mystery.decadeNumber ? 'step' : undefined}
              />
            );
          })}
        </nav>

        {showIntentions && (
          <section ref={intentionsRef} id="intentions-panel" className="intentions-panel" aria-label={t('intentionsTitle')}>
            <p className="intentions-hint">{t('intentionsHint')}</p>
            <form onSubmit={addIntention} className="field intentions-form"><input aria-label={t('intentionPlaceholder')} maxLength={500} value={newIntention} onChange={(event) => setNewIntention(event.target.value)} placeholder={t('intentionPlaceholder')} /><button type="submit" className="button button-small" disabled={!newIntention.trim()}>{t('addIntention')}</button></form>
            {prayer.intentions.map((intention, index) => <div className="quiet-row" key={`${intention}-${index}`}><span>{intention}</span><button type="button" className="button button-quiet" onClick={() => prayer.removeIntention(index)} aria-label={t('removeIntention')}>×</button></div>)}
          </section>
        )}

        <section className="prayer-step" aria-live="polite" aria-atomic="true">
          <h1>{displayTitle}</h1>
          {fruit && <p className="prayer-fruit"><strong>{t('fruit')}</strong> · {fruit}</p>}
          <div className="prayer-text">{body}</div>
          {showLatin && currentStep.latinText && <div className="latin-text">{currentStep.latinText}</div>}
          {inDecade && <div className="bead-line" aria-hidden="true">{Array.from({length: 10}, (_, index) => <span key={index} data-complete={index < beadFill} data-current={index === beadFill && currentStep.type !== 'decade_glory_fatima'} />)}</div>}
        </section>
        <div className="prayer-actions"><button className="button button-secondary" onClick={prayer.previousStep} disabled={prayer.currentStepIndex === 0}><ArrowLeft size={17} /> {t('previous')}</button><button className="button" onClick={next}>{prayer.currentStepIndex === steps.length - 1 ? t('finish') : t('next')} <ArrowRight size={17} /></button></div>
      </article>
    </div>
  );
}
