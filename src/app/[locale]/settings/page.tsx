'use client';

import {FormEvent, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Link, useRouter} from '@/i18n/routing';
import {useIsMounted} from '@/hooks/useIsMounted';
import {usePrayerStore} from '@/store/usePrayerStore';
import {usePreferencesStore} from '@/store/usePreferencesStore';
import {BETA_FEEDBACK_URL} from '@/lib/links';

export default function SettingsPage() {
  const t = useTranslations('Settings');
  const tNav = useTranslations('Navigation');
  const tCommon = useTranslations('Common');
  const mounted = useIsMounted();
  const router = useRouter();
  const preferences = usePreferencesStore();
  const prayer = usePrayerStore();
  const [message, setMessage] = useState('');

  if (!mounted) return <div className="page-wrap section-pad" />;

  const save = (event: FormEvent) => {
    event.preventDefault();
    preferences.setProfile({firstName: preferences.firstName.trim().slice(0, 50)});
    setMessage(t('saveSuccess'));
  };
  const exportData = () => {
    const data = JSON.stringify({
      version: 2,
      exportedAt: new Date().toISOString(),
      prayerState: {
        activeMysteryType: prayer.activeMysteryType,
        currentStepIndex: prayer.currentStepIndex,
        furthestStepIndex: prayer.furthestStepIndex,
        sessionStartedAt: prayer.sessionStartedAt,
        isCompleted: prayer.isCompleted,
        intentions: prayer.intentions,
        reflection: prayer.reflection,
      },
      preferences: {
        prayerWindow: preferences.prayerWindow,
        reminderTime: preferences.reminderTime,
        theme: preferences.theme,
        readerSize: preferences.readerScale,
      },
      completions: prayer.completions,
    }, null, 2);
    const url = URL.createObjectURL(new Blob([data], {type: 'application/json'}));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'evangelizae-dados.json'; anchor.click(); URL.revokeObjectURL(url);
  };
  const clearData = async () => {
    if (!window.confirm(t('clearConfirm'))) return;
    prayer.resetPrayerData();
    preferences.resetPreferences();
    for (const storage of [window.localStorage, window.sessionStorage]) {
      for (let index = storage.length - 1; index >= 0; index -= 1) {
        const key = storage.key(index);
        if (key?.startsWith('evangelizae-')) storage.removeItem(key);
      }
    }
    if ('caches' in window) {
      const cacheKeys = await window.caches.keys();
      await Promise.all(cacheKeys.map((key) => window.caches.delete(key)));
    }
    router.replace('/inicio?via=selo');
  };

  return (
    <div className="page-wrap settings-page">
      <header className="page-header statement-header"><span className="eyebrow">{t('eyebrow')}</span><h1 className="page-title">{t('title')}</h1><p className="lede">{t('subtitle')}</p></header>
      <div className="dashboard-grid settings-grid">
        <section className="paper-panel settings-main"><h2 className="section-title" style={{fontSize: '2rem'}}>{t('profileTitle')}</h2><form className="form-stack" onSubmit={save} style={{marginTop: '2rem'}}>
          <div className="field"><label htmlFor="settings-name">{t('nameLabel')}</label><input id="settings-name" maxLength={50} autoComplete="given-name" value={preferences.firstName} onChange={(event) => preferences.setProfile({firstName: event.target.value})} /></div>
          <div className="field"><label htmlFor="settings-time">{t('timeLabel')}</label><input id="settings-time" type="time" value={preferences.reminderTime} onChange={(event) => preferences.setProfile({reminderTime: event.target.value})} /></div>
          <div className="field"><label htmlFor="settings-reader">{t('readerLabel')}</label><select id="settings-reader" value={preferences.readerScale} onChange={(event) => preferences.setProfile({readerScale: event.target.value as typeof preferences.readerScale})}><option value="normal">{t('readerNormal')}</option><option value="large">{t('readerLarge')}</option><option value="xl">{t('readerXl')}</option></select></div>
          <div className="field"><label htmlFor="settings-theme">{t('themeLabel')}</label><select id="settings-theme" value={preferences.theme} onChange={(event) => preferences.setProfile({theme: event.target.value as typeof preferences.theme})}><option value="system">{t('themeSystem')}</option><option value="light">{t('themeLight')}</option><option value="dark">{t('themeDark')}</option></select></div>
          <button className="button" type="submit">{tCommon('save')}</button>{message && <p className="status-message" data-tone="success">{message}</p>}
        </form></section>
        <aside className="paper-panel settings-aside"><span className="settings-aside-mark" aria-hidden="true">✣</span><h2 style={{fontFamily: 'var(--font-serif)', fontSize: '1.5rem'}}>{t('dataTitle')}</h2><div className="form-stack"><button className="button button-secondary" onClick={exportData}>{t('export')}</button><button className="button button-secondary" onClick={() => void clearData()}>{t('clear')}</button><a href={BETA_FEEDBACK_URL} className="text-link" target="_blank" rel="noreferrer">{t('feedback')}</a><Link href="/privacy" className="text-link">{t('privacyLink')}</Link><Link href="/inicio" className="text-link">{t('publicHome')}</Link><Link href="/about" className="text-link">{tNav('about')}</Link><a href="https://github.com/OtavioXimarelli/Evangelizae" className="text-link" target="_blank" rel="noreferrer">{tNav('source')}</a></div></aside>
      </div>
    </div>
  );
}
