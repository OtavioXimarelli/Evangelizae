'use client';

import {FormEvent, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {ArrowLeft, ArrowRight, Heart, Languages, MoreHorizontal} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import {useIsMounted} from '@/hooks/useIsMounted';
import {useDayContext} from '@/hooks/useDayContext';
import {useStepSwipe} from '@/hooks/useStepSwipe';
import {SacredOrnament} from '@/components/brand/SacredOrnament';
import {MysteryGate} from '@/components/rosary/MysteryGate';
import {FinishRosaryDialog} from '@/components/rosary/FinishRosaryDialog';
import {RosaryGuidePrompt, RosaryGuideTrigger} from '@/components/rosary/RosaryGuideModal';
import {RosaryMapSheet} from '@/components/rosary/RosaryMapSheet';
import {RosaryRail} from '@/components/rosary/RosaryRail';
import {buildDevotionSequence, DevotionType} from '@/services/rosaryEngine';
import {getRosaryProgress} from '@/services/rosaryProgress';
import {usePrayerStore} from '@/store/usePrayerStore';
import {usePreferencesStore} from '@/store/usePreferencesStore';

const mysteryTranslation = {gozosos: 'joyful', luminosos: 'luminous', dolorosos: 'sorrowful', gloriosos: 'glorious'} as const;

export default function RosaryPage() {
  const t = useTranslations('Rosary');
  const locale = useLocale();
  const mounted = useIsMounted();
  const prayer = usePrayerStore();
  const readerScale = usePreferencesStore((state) => state.readerScale);
  const today = useDayContext();
  const [showLatin, setShowLatin] = useState(false);
  const [showIntentions, setShowIntentions] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [newIntention, setNewIntention] = useState('');
  const [gateAfterCompletion, setGateAfterCompletion] = useState(false);
  const [confirmingFinish, setConfirmingFinish] = useState(false);
  const intentionsRef = useRef<HTMLDivElement>(null);
  const intentionsTriggerRef = useRef<HTMLButtonElement>(null);
  const guideFocusRef = useRef<HTMLButtonElement>(null);
  const mapTriggerRef = useRef<HTMLButtonElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);
  const prayerHeadingRef = useRef<HTMLHeadingElement>(null);
  const completionHeadingRef = useRef<HTMLHeadingElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const steps = useMemo(() => buildDevotionSequence(prayer.activeDevotion as DevotionType, {mysteryType: prayer.activeMysteryType}), [prayer.activeDevotion, prayer.activeMysteryType]);
  const currentStepIndex = Math.min(prayer.currentStepIndex, steps.length - 1);
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex >= steps.length - 1;

  const next = useCallback(() => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(12);
    if (isLastStep) setConfirmingFinish(true);
    else prayer.advanceStep(steps.length);
  }, [prayer, steps.length, isLastStep]);

  const swipe = useStepSwipe({
    onNext: next,
    onPrevious: prayer.previousStep,
    enabled: !prayer.isCompleted && Boolean(prayer.sessionStartedAt),
  });

  useEffect(() => {
    if (!mounted || prayer.isCompleted || !prayer.sessionStartedAt) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if (target?.closest('button, a, input, textarea, select, [contenteditable="true"], [role="dialog"]')) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        next();
      }
      if (event.key === 'ArrowLeft' && prayer.currentStepIndex > 0) {
        event.preventDefault();
        prayer.previousStep();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mounted, prayer, next]);

  useEffect(() => {
    if (!mounted) return;
    if (prayer.isCompleted) {
      completionHeadingRef.current?.focus();
      return;
    }
    if (!prayer.sessionStartedAt) return;
    // The prayer region is the only scroll container: reset it and move focus
    // without letting the browser scroll twice.
    scrollRef.current?.scrollTo({top: 0});
    prayerHeadingRef.current?.focus({preventScroll: true});
  }, [mounted, prayer.isCompleted, prayer.sessionStartedAt, prayer.currentStepIndex]);

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
           <h1 ref={completionHeadingRef} tabIndex={-1} className="page-title">{t('completedTitle')}</h1>
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
            <RosaryGuideTrigger variant="pill" focusRef={guideFocusRef} />
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
  const isIntro = currentStep.type === 'mystery_intro';
  const displayTitle = isIntro && currentStep.mystery
    ? (locale === 'en' ? currentStep.mystery.nameEn : currentStep.mystery.namePt)
    : currentStep.type.startsWith('decade_') ? title.replace(/\s*\([^)]*\)\s*$/, '') : title;
  const fruit = currentStep.mystery ? (locale === 'en' ? currentStep.mystery.fruitEn : currentStep.mystery.fruitPt) : null;

  const progress = getRosaryProgress(currentStep, prayer.activeDevotion as DevotionType);
  const isDailyMystery = prayer.activeMysteryType === today.mystery;
  const mysteryName = currentStep.mystery ? (locale === 'en' ? currentStep.mystery.nameEn : currentStep.mystery.namePt) : null;

  const phaseLabel = prayer.activeDevotion !== 'rosario'
    ? `${prayer.activeDevotion === 'sao_jose' ? t('devotionSaoJose') : t('devotionLagrimas')}${progress.phase === 'decades' ? ` · ${t('groupLabel', {number: progress.decadeNumber ?? 0})}` : ''}`
    : progress.phase === 'opening'
      ? t('phaseOpening')
      : progress.phase === 'closing'
        ? t('phaseClosing')
        : `${t('decadeLabel', {number: progress.decadeNumber ?? 0})} — ${mysteryName}`;
  const beadLabel = prayer.activeDevotion !== 'rosario'
    ? null
    : progress.beadInDecade
      ? t('hailMaryOf', {current: progress.beadInDecade, total: 10})
      : progress.openingHailMary
        ? t('openingHailMaryOf', {current: progress.openingHailMary})
        : null;
  const nextLabel = isLastStep ? t('finish') : isIntro ? t('startDecade') : t('next');

  return (
    <div className={`prayer-layout prayer-reader-${readerScale}`}>
      <article className="prayer-room">
        <div className="prayer-room-head">
          <span className="prayer-room-context">
            {isDailyMystery && <span className="daily-mystery-chip">{t('todayBadge')}</span>}
            <span className="prayer-room-mystery">{t(mysteryTranslation[prayer.activeMysteryType])}</span>
          </span>
          <span className="prayer-room-tools">
            <RosaryGuideTrigger focusRef={guideFocusRef} className="prayer-tool" />
            <button
              ref={mapTriggerRef}
              type="button"
              className="button button-quiet prayer-tool"
              aria-label={t('optionsTitle')}
              aria-haspopup="dialog"
              onClick={() => setShowMap(true)}
            >
              <MoreHorizontal size={18} aria-hidden="true" />
            </button>
          </span>
        </div>

        <RosaryRail
          steps={steps}
          currentStepIndex={currentStepIndex}
          furthestStepIndex={prayer.furthestStepIndex}
          onSelectStep={prayer.setStep}
          phaseLabel={phaseLabel}
          beadLabel={beadLabel}
          devotion={prayer.activeDevotion as DevotionType}
          segments={prayer.activeDevotion === 'rosario' ? 5 : prayer.activeDevotion === 'sao_jose' ? 5 : 7}
          beadsPerGroup={prayer.activeDevotion === 'sao_jose' ? 11 : prayer.activeDevotion === 'lagrimas' ? 8 : 11}
          openingSteps={prayer.activeDevotion === 'sao_jose' ? 6 : prayer.activeDevotion === 'lagrimas' ? 1 : 6}
          closingSteps={prayer.activeDevotion === 'sao_jose' ? 3 : prayer.activeDevotion === 'lagrimas' ? 3 : 1}
        />

        <div className="prayer-scroll" ref={scrollRef} {...swipe}>
          {currentStepIndex === 0 && <RosaryGuidePrompt returnFocusRef={guideFocusRef} />}

          <section className="prayer-step" data-type={currentStep.type}>
            {isIntro && <p className="prayer-chapter-label">{t('decadeLabel', {number: currentStep.decadeNumber ?? 0})}</p>}
            <h1 ref={prayerHeadingRef} tabIndex={-1}>{displayTitle}</h1>
            {fruit && <p className="prayer-fruit"><strong>{t('fruit')}</strong> · {fruit}</p>}
            <div className="prayer-text">
              {body.split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>
            {showLatin && currentStep.latinText && <div className="latin-text">{currentStep.latinText}</div>}
          </section>

          <div className="prayer-inline-actions">
            <button
              ref={intentionsTriggerRef}
              type="button"
              className="prayer-chip"
              onClick={() => setShowIntentions(!showIntentions)}
              aria-expanded={showIntentions}
              aria-controls="intentions-panel"
            >
              <Heart size={14} aria-hidden="true" />
              <span>{t('intentionsTitle')}</span>
              {prayer.intentions.length > 0 && <span className="prayer-chip-count">{prayer.intentions.length}</span>}
            </button>
            {currentStep.latinText && (
              <button
                type="button"
                className="prayer-chip"
                aria-pressed={showLatin}
                onClick={() => setShowLatin(!showLatin)}
              >
                <Languages size={14} aria-hidden="true" />
                <span>{showLatin ? t('hideLatin') : t('showLatin')}</span>
              </button>
            )}
          </div>

          {showIntentions && (
            <section ref={intentionsRef} id="intentions-panel" className="intentions-panel" aria-label={t('intentionsTitle')}>
              <p className="intentions-hint">{t('intentionsHint')}</p>
              <form onSubmit={addIntention} className="field intentions-form"><input aria-label={t('intentionPlaceholder')} maxLength={140} value={newIntention} onChange={(event) => setNewIntention(event.target.value)} placeholder={t('intentionPlaceholder')} /><button type="submit" className="button button-small" disabled={!newIntention.trim() || prayer.intentions.length >= 5}>{t('addIntention')}</button></form>
              {prayer.intentions.length >= 5 && <p className="intentions-hint">{t('intentionLimit')}</p>}
              {prayer.intentions.map((intention, index) => <div className="quiet-row" key={`${intention}-${index}`}><span>{intention}</span><button type="button" className="button button-quiet" onClick={() => prayer.removeIntention(index)} aria-label={t('removeIntention', {index: index + 1})}>×</button></div>)}
            </section>
          )}

          {currentStepIndex === 0 && <p className="prayer-keyboard-hint">{t('keyboardHint')}</p>}
        </div>

        <div className="prayer-actions">
          <button className="button button-secondary" onClick={prayer.previousStep} disabled={currentStepIndex === 0}>
            <ArrowLeft size={17} aria-hidden="true" />
            <span>{t('previous')}</span>
          </button>
          <button ref={nextButtonRef} className="button" onClick={next}>
            <span>{nextLabel}</span>
            <ArrowRight size={17} aria-hidden="true" />
          </button>
          <p className="prayer-hint">{t('autosaveHint')}</p>
        </div>
      </article>

      <RosaryMapSheet
        open={showMap}
        onClose={() => setShowMap(false)}
        steps={steps}
        activeMysteryType={prayer.activeMysteryType}
        currentStepIndex={currentStepIndex}
        furthestStepIndex={prayer.furthestStepIndex}
        onSelectStep={prayer.setStep}
        returnFocusRef={mapTriggerRef}
      />
      <FinishRosaryDialog
        open={confirmingFinish}
        onClose={() => setConfirmingFinish(false)}
        onConfirm={() => { setConfirmingFinish(false); prayer.completeRosary(); }}
        returnFocusRef={nextButtonRef}
      />
    </div>
  );
}
