'use client';

import {FormEvent, useEffect, useRef, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import {BrandMark} from '@/components/brand/BrandMark';
import {SacredOrnament} from '@/components/brand/SacredOrnament';
import {useRouter} from '@/i18n/routing';
import {useDayContext} from '@/hooks/useDayContext';
import {useIsMounted} from '@/hooks/useIsMounted';
import {PrayerWindow, usePreferencesStore} from '@/store/usePreferencesStore';

const defaultTimes: Record<PrayerWindow, string> = {morning: '07:00', afternoon: '15:00', evening: '21:00'};
const TOTAL_STEPS = 3;

export default function OnboardingPage() {
  const t = useTranslations('Onboarding');
  const tDay = useTranslations('DayContext');
  const router = useRouter();
  const preferences = usePreferencesStore();
  const mounted = useIsMounted();
  const today = useDayContext();
  const [step, setStep] = useState(1);
  const [redoing, setRedoing] = useState(false);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (mounted && !preferences.onboardedAt) stepHeadingRef.current?.focus();
  }, [mounted, preferences.onboardedAt, step]);

  const finish = (event?: FormEvent) => {
    event?.preventDefault();
    preferences.setProfile({firstName: preferences.firstName.trim().slice(0, 50)});
    preferences.completeOnboarding();
    router.replace('/sanctuary');
  };

  const chooseWindow = (prayerWindow: PrayerWindow) => preferences.setProfile({prayerWindow, reminderTime: defaultTimes[prayerWindow]});

  if (!mounted) return <div className="onboarding-shell" />;

  if (preferences.onboardedAt && !redoing) {
    return (
      <div className="onboarding-shell">
        <aside className="onboarding-identity">
          <BrandMark />
          <SacredOrnament className="sacred-ornament" />
          <div>
            <span className="eyebrow">{tDay(`greetings.${today.daypart}`)}.</span>
            <p className="onboarding-identity-title">{t('title')}</p>
            <p>{t('privacy')}</p>
          </div>
        </aside>
        <div className="paper-panel onboarding-panel">
          <header className="hero-copy" style={{marginBottom: '2rem'}}>
            <span className="eyebrow">{t('alreadyEyebrow')}</span>
            <h1 className="section-title">{preferences.firstName ? t('alreadyTitle', {name: preferences.firstName}) : t('alreadyTitleNoName')}</h1>
            <p className="lede">{t('alreadyBody')}</p>
          </header>
          <div className="hero-actions">
            <Link href="/sanctuary" className="button">{t('sanctuaryAction')}</Link>
            <button className="button button-secondary" type="button" onClick={() => setRedoing(true)}>{t('redoAction')}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-shell">
      <aside className="onboarding-identity">
        <BrandMark />
        <SacredOrnament className="sacred-ornament" />
        <div>
          <span className="eyebrow">{tDay(`greetings.${today.daypart}`)}.</span>
          <p className="onboarding-identity-title">{t('title')}</p>
          <p>{t('privacy')}</p>
        </div>
      </aside>
      <div className="paper-panel onboarding-panel">
        <header className="hero-copy" style={{marginBottom: '2.5rem'}}>
          <span className="eyebrow">{t('stepOf', {current: step, total: TOTAL_STEPS})}</span>
          <div className="step-progress" aria-hidden="true">
            {Array.from({length: TOTAL_STEPS}, (_, index) => (
              <span key={index} className={`step-progress-dot${index + 1 <= step ? ' is-active' : ''}`} />
            ))}
          </div>
          <h1 ref={stepHeadingRef} tabIndex={-1} className="section-title">{t(`step${step}Title`)}</h1>
        </header>
        <form className="form-stack" onSubmit={finish}>
          {step === 1 && (
            <div className="field">
              <label htmlFor="first-name">{t('nameLabel')}</label>
              <input id="first-name" maxLength={50} value={preferences.firstName} onChange={(event) => preferences.setProfile({firstName: event.target.value})} placeholder={t('namePlaceholder')} autoComplete="given-name" />
            </div>
          )}
          {step === 2 && (
            <>
              <fieldset className="field">
                <legend>{t('windowLabel')}</legend>
                <div className="choice-grid">
                  {(['morning', 'afternoon', 'evening'] as const).map((window) => (
                    <label className="choice" key={window}><input type="radio" name="window" checked={preferences.prayerWindow === window} onChange={() => chooseWindow(window)} />{t(window)}</label>
                  ))}
                </div>
              </fieldset>
              <div className="field"><label className="checkbox-label" htmlFor="reminder-enabled"><input id="reminder-enabled" type="checkbox" checked={preferences.reminderEnabled} onChange={(event) => preferences.setProfile({reminderEnabled: event.target.checked})} />{t('reminderEnabled')}</label><label htmlFor="reminder-time">{t('timeLabel')}</label><input id="reminder-time" type="time" value={preferences.reminderTime} disabled={!preferences.reminderEnabled} onChange={(event) => preferences.setProfile({reminderTime: event.target.value})} /><p style={{color: 'var(--muted-ink)', fontSize: '.84rem', margin: 0}}>{t('timeHint')}</p></div>
            </>
          )}
          {step === 3 && (
            <>
              <fieldset className="field"><legend>{t('readerLabel')}</legend><div className="choice-grid">
                {(['normal', 'large', 'xl'] as const).map((size) => <label className="choice" key={size}><input type="radio" name="reader" checked={preferences.readerScale === size} onChange={() => preferences.setProfile({readerScale: size})} />{t(size === 'xl' ? 'readerXl' : size === 'large' ? 'readerLarge' : 'readerNormal')}</label>)}
              </div></fieldset>
              <fieldset className="field"><legend>{t('themeLabel')}</legend><div className="choice-grid">
                {(['system', 'light', 'dark'] as const).map((theme) => <label className="choice" key={theme}><input type="radio" name="theme" checked={preferences.theme === theme} onChange={() => preferences.setProfile({theme})} />{t(theme === 'system' ? 'themeSystem' : theme === 'light' ? 'themeLight' : 'themeDark')}</label>)}
              </div></fieldset>
              <p style={{color: 'var(--muted-ink)', fontSize: '.84rem', margin: 0}}>{t('privacy')}</p>
            </>
          )}
          <div className="hero-actions">
            {step > 1 && <button className="button button-secondary" type="button" onClick={() => setStep(step - 1)}>{t('back')}</button>}
            {step < TOTAL_STEPS
              ? <button className="button" type="button" onClick={(event) => { event.preventDefault(); setStep(step + 1); }}>{t('next')}</button>
              : <button className="button" type="submit">{t('submit')}</button>}
            <button className="text-link" type="button" onClick={() => finish()}>{t('skip')}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
