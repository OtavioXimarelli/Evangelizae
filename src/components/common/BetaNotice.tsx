'use client';

import {useState} from 'react';
import {MessageCircle, X} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useIsMounted} from '@/hooks/useIsMounted';
import {BETA_FEEDBACK_URL} from '@/lib/links';
import {usePreferencesStore} from '@/store/usePreferencesStore';

const DISMISS_KEY = 'evangelizae-beta-notice-dismissed';

export function BetaNotice() {
  const t = useTranslations('Beta');
  const tCommon = useTranslations('Common');
  const mounted = useIsMounted();
  const dismissed = usePreferencesStore((state) => state.betaNoticeDismissed);
  const dismissBetaNotice = usePreferencesStore((state) => state.dismissBetaNotice);
  const [legacyDismissed] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem(DISMISS_KEY) === '1',
  );
  const close = () => {
    window.localStorage.setItem(DISMISS_KEY, '1');
    dismissBetaNotice();
  };

  if (!mounted || dismissed || legacyDismissed) return null;

  return (
    <aside className="beta-notice" aria-labelledby="beta-notice-title">
      <button type="button" className="beta-close" onClick={close} aria-label={tCommon('close')}><X size={17} /></button>
      <div className="beta-notice-copy">
        <span className="eyebrow">{t('eyebrow')}</span>
        <h2 id="beta-notice-title" className="beta-title">{t('title')}</h2>
        <p className="beta-body">{t('body')}</p>
      </div>
      <a className="beta-feedback" href={BETA_FEEDBACK_URL} target="_blank" rel="noreferrer"><MessageCircle size={16} />{t('feedback')}</a>
    </aside>
  );
}
