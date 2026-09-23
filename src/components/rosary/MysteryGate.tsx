'use client';

import {useLocale, useTranslations} from 'next-intl';
import {MysteryType, ROSARY_MYSTERIES} from '@/services/rosaryEngine';
import {usePrayerStore} from '@/store/usePrayerStore';

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
