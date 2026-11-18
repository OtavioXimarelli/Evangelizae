'use client';

import {useEffect, useState} from 'react';
import {useTranslations} from 'next-intl';
import {Moon, Sun} from 'lucide-react';
import {useIsMounted} from '@/hooks/useIsMounted';
import {usePreferencesStore} from '@/store/usePreferencesStore';

export function ThemeToggle({showLabel = false}: {showLabel?: boolean}) {
  const t = useTranslations('Navigation');
  const mounted = useIsMounted();
  const theme = usePreferencesStore((state) => state.theme);
  const setProfile = usePreferencesStore((state) => state.setProfile);
  const [systemDark, setSystemDark] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setSystemDark(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  if (!mounted) return <span className="theme-toggle" aria-hidden="true" />;

  const isDark = theme === 'dark' || (theme === 'system' && systemDark);

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`${t('theme')} · ${isDark ? t('themeToLight') : t('themeToDark')}`}
      onClick={() => setProfile({theme: isDark ? 'light' : 'dark'})}
    >
      {isDark ? <Sun /> : <Moon />}
      {showLabel && <span className="theme-toggle-label">{t('theme')}</span>}
    </button>
  );
}
