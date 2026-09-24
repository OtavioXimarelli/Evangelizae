'use client';

import {ArrowRight, BookOpen, Clock3} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import {useIsMounted} from '@/hooks/useIsMounted';
import {useDayContext} from '@/hooks/useDayContext';
import {WeekDots, type WeekDayMark} from '@/components/common/WeekDots';
import {getCalendarDateInTimeZone, getLocalDateKey} from '@/lib/date';
import {buildRosarySequence, type MysteryType} from '@/services/rosaryEngine';
import {getPrayerStats, usePrayerStore} from '@/store/usePrayerStore';
import {isReminderDue, usePreferencesStore} from '@/store/usePreferencesStore';

const mysteryKeys = {
  gozosos: 'joyful',
  luminosos: 'luminous',
  dolorosos: 'sorrowful',
  gloriosos: 'glorious',
} as const satisfies Record<MysteryType, string>;

export default function SanctuaryPage() {
  const t = useTranslations('Sanctuary');
  const tDay = useTranslations('DayContext');
  const tRosary = useTranslations('Rosary');
  const mounted = useIsMounted();
  const prayer = usePrayerStore();
  const preferences = usePreferencesStore();
  const today = useDayContext();

  if (!mounted) {
    return (
      <div className="page-wrap sanctuary-page" aria-busy="true" aria-label={t('loading')}>
        <div className="page-header sanctuary-masthead" style={{minHeight: '12rem'}}>
          <span className="eyebrow sanctuary-season" style={{opacity: 0.4}}>···</span>
          <h1 className="page-title" style={{opacity: 0.4}}>···</h1>
        </div>
      </div>
    );
  }

  const dailyMystery = today.mystery;
  const stats = getPrayerStats(prayer.completions);
  const activeSession = Boolean(prayer.sessionStartedAt) && !prayer.isCompleted && prayer.furthestStepIndex > 0;
  const reminderDue = isReminderDue(preferences.reminderTime, preferences.reminderDismissedDate) && !stats.completedToday;
  const hasHistory = prayer.completions.length > 0;

  const calendarDate = getCalendarDateInTimeZone();
  const dateLabel = new Intl.DateTimeFormat('pt-BR', {weekday: 'long', day: 'numeric', month: 'long'}).format(calendarDate);
  const greeting = `${tDay(`greetings.${today.daypart}`)}${preferences.firstName ? `, ${preferences.firstName}` : ''}.`;

  const completionDates = new Set(prayer.completions.map((item) => item.localDate));
  const weekdayFormat = new Intl.DateTimeFormat('pt-BR', {weekday: 'short', day: 'numeric', month: 'short'});
  const weekMarks: WeekDayMark[] = Array.from({length: 7}, (_, index) => {
    const date = new Date(calendarDate);
    date.setDate(date.getDate() - (6 - index));
    const key = getLocalDateKey(date);
    return {
      key,
      prayed: completionDates.has(key),
      ariaLabel: `${weekdayFormat.format(date)} · ${completionDates.has(key) ? t('dotPrayed') : t('dotMissed')}`,
    };
  });

  const lastCompletionLabel = stats.lastCompletionDate
    ? new Intl.DateTimeFormat('pt-BR', {day: '2-digit', month: 'short'}).format(new Date(`${stats.lastCompletionDate}T12:00:00`))
    : t('never');
  const weekSummary = [
    t('totalSummary', {count: stats.totalRosariesPrayed}),
    stats.consecutiveDays > 0 ? t('streakSummary', {count: stats.consecutiveDays}) : '',
    `${t('lastLabel')} ${lastCompletionLabel}`,
  ].filter(Boolean).join(' · ');

  return (
    <div className="page-wrap sanctuary-page">
      <header className="page-header sanctuary-masthead">
        <span className="eyebrow sanctuary-season">{dateLabel} · {tDay(`seasons.${today.season}`)}</span>
        <h1 className="page-title">{greeting}</h1>
        <p className="lede">{t('subtitle')}</p>
      </header>

      {reminderDue && (
        <div className="reminder-line" role="status">
          <p><Clock3 size={15} aria-hidden="true" /> <strong>{t('reminderTitle')}</strong> {t('reminderBody')}</p>
          <button className="text-link" onClick={preferences.dismissReminderToday}>{t('dismissReminder')}</button>
        </div>
      )}

      {stats.completedToday && <p className="status-message" data-tone="success">{t('completedToday')}</p>}

      <section className="week-strip" aria-label={t('weekDotsLabel')}>
        <div>
          <span className="eyebrow">{t('statsTitle')}</span>
          <WeekDots marks={weekMarks} />
        </div>
        <p className="week-summary">{weekSummary}</p>
      </section>

      <section className="paper-panel primary-prayer prayer-invitation marginal-flourish">
        <span className="prayer-card-mark" aria-hidden="true">✢</span>
        <div className="hero-copy">
          {activeSession ? (
            <>
              <span className="eyebrow">{t('resumeEyebrow')}</span>
              <h2 className="section-title">{t('resumeTitle')}</h2>
              <p className="step-ribbon">{t('stepProgress', {current: prayer.currentStepIndex + 1, total: buildRosarySequence(prayer.activeMysteryType).length})}</p>
            </>
          ) : hasHistory ? (
            <>
              <span className="eyebrow">{t('beginEyebrow')}</span>
              <h2 className="section-title">{t('beginTitle', {mystery: tRosary(mysteryKeys[dailyMystery]).toLowerCase()})}</h2>
            </>
          ) : (
            <>
              <span className="eyebrow">{t('beginEyebrow')}</span>
              <h2 className="section-title">{t('emptyTitle')}</h2>
              <p className="lede">{t('emptyBody')}</p>
            </>
          )}
          <p className="lede">{t('rosaryDescription')}</p>
        </div>
        <div className="hero-actions">
          {activeSession ? (
            <>
              <Link href="/rosary" className="button">{t('resumeAction')} <ArrowRight size={17} /></Link>
              {prayer.activeMysteryType !== dailyMystery && (
                <button type="button" className="button button-secondary" onClick={() => prayer.initRosary(dailyMystery)}>{t('offerTodayMystery')}</button>
              )}
            </>
          ) : (
            <Link href="/rosary" className="button" onClick={() => prayer.initRosary(dailyMystery)}>
              {hasHistory ? t('beginAction') : t('emptyAction')} <ArrowRight size={17} />
            </Link>
          )}
        </div>
      </section>

      <aside className="paper-panel liturgy-promo">
        <BookOpen size={32} aria-hidden="true" />
        <div className="liturgy-promo-content">
          <span className="eyebrow">{t('liturgyEyebrow')}</span>
          <h2 className="liturgy-promo-title">{t('liturgyTitle')}</h2>
          <p className="liturgy-promo-body">{t('liturgyBody')}</p>
        </div>
        <Link href="/liturgy" className="button button-secondary">{t('liturgyAction')}</Link>
      </aside>
    </div>
  );
}
