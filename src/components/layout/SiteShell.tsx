'use client';

import {useEffect, useRef, useState} from 'react';
import {ArrowLeft, BookOpen, CircleDot, Home, Menu, Settings, Sunrise, X, Cross} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {BrandMark} from '@/components/brand/BrandMark';
import {Link, usePathname} from '@/i18n/routing';
import {useIsMounted} from '@/hooks/useIsMounted';
import {useDayContext} from '@/hooks/useDayContext';
import {usePreferencesStore} from '@/store/usePreferencesStore';
import {usePrayerStore} from '@/store/usePrayerStore';
import {PwaInstallPrompt} from '@/components/pwa/PwaInstallPrompt';
import {BetaNotice} from '@/components/common/BetaNotice';
import {ExitPrayerControl} from '@/components/prayer/ExitPrayerControl';
import {ThemeToggle} from '@/components/layout/ThemeToggle';
import {BETA_FEEDBACK_URL} from '@/lib/links';

const productRoutes = ['/sanctuary', '/rosary', '/liturgy', '/settings', '/offline'];

export function SiteShell({children}: {children: React.ReactNode}) {
  const pathname = usePathname();
  const t = useTranslations('Navigation');
  const mounted = useIsMounted();
  const theme = usePreferencesStore((state) => state.theme);
  const hasActiveSession = usePrayerStore((state) => Boolean(state.sessionStartedAt) && !state.isCompleted);
  const {season} = useDayContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);
  const isFocus = pathname.startsWith('/rosary');
  const isOnboarding = pathname.startsWith('/comecar');
  const isOffline = pathname.startsWith('/offline');
  const isProduct = productRoutes.some((route) => pathname.startsWith(route));
  const isInstitutional = pathname.startsWith('/about') || pathname.startsWith('/privacy');
  const [productOrigin, setProductOrigin] = useState(isProduct);
  const isProductShell = isProduct || (productOrigin && isInstitutional);

  useEffect(() => {
    if (!mounted) return;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => {
      const dark = theme === 'dark' || (theme === 'system' && query.matches);
      document.documentElement.classList.toggle('dark', dark);
    };
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, [mounted, theme]);

  useEffect(() => {
    document.documentElement.dataset.season = season;
  }, [season]);

  useEffect(() => {
    if (!isFocus) return;
    document.documentElement.dataset.focusMode = 'true';
    return () => {
      delete document.documentElement.dataset.focusMode;
    };
  }, [isFocus]);

  useEffect(() => {
    if (!menuOpen) return;
    const menu = mobileMenuRef.current;
    menu?.querySelector<HTMLElement>('a, button')?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  if (isFocus) {
    return (
      <div className="focus-shell">
        <a href="#main-content" className="skip-link">Pular para o conteúdo principal</a>
        <header className="focus-header">
          <BrandMark />
          <ExitPrayerControl hasActiveSession={hasActiveSession} />
        </header>
        <main id="main-content" tabIndex={-1}>{children}</main>
      </div>
    );
  }

  const isActive = (href: string) => {
    const navPath = href.split('?')[0];
    return navPath === '/inicio' ? pathname === '/inicio' : pathname.startsWith(navPath);
  };

  const nav = isProductShell
    ? [
        {href: '/sanctuary' as const, label: t('today'), icon: Sunrise},
        {href: '/rosary' as const, label: t('rosary'), icon: CircleDot},
        {href: '/liturgy' as const, label: t('liturgy'), icon: BookOpen},
        {href: '/settings' as const, label: t('settings'), icon: Settings},
      ]
    : [];

  const headerNav = nav;

  const publicNav: Array<{href: string; label: string; icon: typeof Home}> = [
    {href: '/inicio?via=selo', label: t('home'), icon: Home},
    {href: '/about', label: t('about'), icon: Cross},
  ];

  return (
    <div className="site-shell">
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>
      {!isOnboarding && (
        <header className={`site-header${isProductShell ? ' product-header' : ''}`}>
          <div className="site-header-inner">
            <BrandMark />
            {isProductShell ? (
              <nav className="desktop-nav" aria-label={t('primaryLabel')}>
                {headerNav.map(({href, label, icon: Icon}) => (
                  <Link key={href} href={href} aria-current={isActive(href) ? 'page' : undefined} onClick={() => setProductOrigin(true)}>
                    <Icon size={15} aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                ))}
                <ThemeToggle />
              </nav>
            ) : (
              <nav className="desktop-nav" aria-label={t('primaryLabel')}>
                {publicNav.map(({href, label, icon: Icon}) => (
                  <Link key={href} href={href} aria-current={isActive(href) ? 'page' : undefined} onClick={() => setProductOrigin(false)}>
                    <Icon size={15} aria-hidden="true" />
                    <span>{label}</span>
                  </Link>
                ))}
                <ThemeToggle />
                <Link href="/comecar" className="button button-small">{t('begin')}</Link>
              </nav>
            )}
            <div className="header-actions">
              <button ref={menuButtonRef} className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? t('closeMenu') : t('menu')}>
                {menuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
          {menuOpen && (
            <nav ref={mobileMenuRef} id="mobile-navigation" className="mobile-menu" aria-label={t('drawerLabel')}>
              {publicNav.map(({href, label, icon: Icon}) => (
                <Link key={href} href={href} aria-current={isActive(href) ? 'page' : undefined} onClick={() => { setProductOrigin(isProductShell); setMenuOpen(false); }}>
                  <Icon size={17} aria-hidden="true" />
                  <span>{label}</span>
                </Link>
              ))}
              {!isProductShell && (
                <Link href="/comecar" onClick={() => setMenuOpen(false)}>
                  <ArrowLeft size={17} style={{transform: 'rotate(180deg)'}} aria-hidden="true" />
                  <span>{t('begin')}</span>
                </Link>
              )}
              <div className="mobile-menu-footer">
                <ThemeToggle />
              </div>
            </nav>
          )}
        </header>
      )}
      <main id="main-content" tabIndex={-1} className={isOnboarding ? 'onboarding-main' : 'site-main'}>{children}</main>
      {isProductShell && !isOffline && <BetaNotice />}
      {!isOnboarding && !isProductShell && (
        <footer className="site-footer">
          <div><BrandMark /></div>
          <p>{t('footerMission')}</p>
          <div className="footer-links"><Link href="/privacy" onClick={() => setProductOrigin(false)}>{t('privacy')}</Link><a href={BETA_FEEDBACK_URL} target="_blank" rel="noreferrer">{t('feedback')}</a><a href="https://github.com/OtavioXimarelli/Evangelizae">{t('source')}</a></div>
        </footer>
      )}
      {isProductShell && (
        <nav className="bottom-nav" aria-label={t('mobileLabel')}>
          {nav.map(({href, label, icon: Icon}) => (
            <Link key={href} href={href} aria-current={isActive(href) ? 'page' : undefined}><Icon /><span>{label}</span></Link>
          ))}
        </nav>
      )}
      {isProductShell && !isOffline && (
        <>
          <PwaInstallPrompt />
          <div className="bottom-nav-theme"><ThemeToggle /></div>
        </>
      )}
    </div>
  );
}
