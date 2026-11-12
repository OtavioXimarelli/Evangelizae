'use client';

import {useRef, useState} from 'react';
import {ArrowRight} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {RosaryGuidePrompt, RosaryGuideTrigger} from '@/components/rosary/RosaryGuideModal';
import {DevotionType, MysteryType, ROSARY_MYSTERIES} from '@/services/rosaryEngine';
import {usePrayerStore} from '@/store/usePrayerStore';

interface MysteryGroupOption {
  type: MysteryType;
  name: string;
  theme: string;
  days: string;
}

export function MysteryGate({todayMystery}: {todayMystery: MysteryType}) {
  const t = useTranslations('Rosary');
  const locale = useLocale();
  const prayer = usePrayerStore();
  const guideFocusRef = useRef<HTMLButtonElement>(null);
  const [devotion, setDevotion] = useState<DevotionType>('rosario');
  const devotions: DevotionType[] = ['rosario', 'sao_jose', 'lagrimas'];

  // The engine titles carry the theme in parentheses; split it once so both
  // the today card and the alternative rows read the same way.
  const groups = (Object.keys(ROSARY_MYSTERIES) as MysteryType[]).map<MysteryGroupOption>((type) => {
    const group = ROSARY_MYSTERIES[type];
    const title = locale === 'en' ? group.titleEn : group.titlePt;
    return {
      type,
      name: title.replace(/\s*\([^)]*\)\s*$/, ''),
      theme: title.match(/\(([^)]+)\)/)?.[1] ?? '',
      days: locale === 'en' ? group.daysEn : group.daysPt,
    };
  });
  const today = groups.find((group) => group.type === todayMystery) ?? groups[0];
  const others = groups.filter((group) => group.type !== today.type);

  return (
    <div className="prayer-layout mystery-gate">
      <article className="prayer-room">
        <div className="prayer-scroll gate-scroll">
          <div className="gate-head">
            <span className="eyebrow">{t('gateEyebrow')}</span>
            <span className="prayer-room-tools">
              <RosaryGuideTrigger focusRef={guideFocusRef} className="prayer-tool" />
            </span>
          </div>

          <div className="gate-devotions" role="tablist" aria-label={t('chooseDevotion')}>
            {devotions.map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={devotion === item}
                className={`gate-devotion-chip${devotion === item ? ' is-active' : ''}`}
                onClick={() => setDevotion(item)}
              >
                {t(`devotion${item === 'rosario' ? 'Rosario' : item === 'sao_jose' ? 'SaoJose' : 'Lagrimas'}`)}
              </button>
            ))}
          </div>

          <div className="gate-intro">
            <h1 className="page-title">
              {devotion === 'rosario' ? t('chooseMystery') : t(`devotion${devotion === 'sao_jose' ? 'SaoJose' : 'Lagrimas'}`)}
            </h1>
            <p className="lede">
              {devotion === 'rosario' ? t('gateSubtitle') : t('devotionSubtitle')}
            </p>
          </div>

          <RosaryGuidePrompt returnFocusRef={guideFocusRef} />

          {devotion === 'rosario' ? (
            <>
              <section className="gate-today" aria-labelledby="gate-today-title">
                <span className="gate-today-badge">{t('todayBadge')}</span>
                <h2 id="gate-today-title" className="gate-today-name">{today.name}</h2>
                {today.theme && <p className="gate-today-theme">{today.theme}</p>}
                <p className="gate-today-days">{today.days}</p>
              </section>

              <section className="gate-others" aria-labelledby="gate-others-title">
                <h2 id="gate-others-title" className="gate-others-title">{t('gateOtherTitle')}</h2>
                <div className="gate-options">
                  {others.map((group) => (
                    <button
                      key={group.type}
                      type="button"
                      className="mystery-gate-option"
                      onClick={() => prayer.initRosary('rosario', group.type)}
                    >
                      <span className="gate-option-mark" aria-hidden="true">✦</span>
                      <span className="gate-option-copy">
                        <span className="gate-option-name">{group.name}</span>
                        <span className="gate-option-meta">{[group.theme, group.days].filter(Boolean).join(' · ')}</span>
                      </span>
                      <span className="gate-option-arrow" aria-hidden="true">›</span>
                    </button>
                  ))}
                </div>
              </section>
            </>
          ) : (
            <section className="gate-devotion-description">
              <p>{t(devotion === 'sao_jose' ? 'devotionSaoJoseDescription' : 'devotionLagrimasDescription')}</p>
            </section>
          )}
        </div>

        <div className="prayer-actions gate-actions">
          {devotion === 'rosario' ? (
            <>
              <button type="button" className="button mystery-gate-cta" onClick={() => prayer.initRosary('rosario', todayMystery)}>
                <span>{t('prayTodayAction')}</span>
                <ArrowRight size={17} aria-hidden="true" />
              </button>
              <p className="prayer-hint">{today.name} · {today.days}</p>
            </>
          ) : (
            <button type="button" className="button mystery-gate-cta" onClick={() => prayer.initRosary(devotion)}>
              <span>{t('prayDevotionAction')}</span>
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          )}
        </div>
      </article>
    </div>
  );
}
