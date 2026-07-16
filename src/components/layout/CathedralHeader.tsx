'use client';

import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { 
  Church, 
  Sparkles, 
  BookOpen, 
  Heart, 
  Bot, 
  User, 
  Globe, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Menu, 
  X, 
  ChevronRight,
  HeartHandshake
} from 'lucide-react';
import { useIsMounted } from '@/hooks/useIsMounted';

export function CathedralHeader() {
  const t = useTranslations('Header');
  const tCommon = useTranslations('Common');
  const currentLocale = useLocale();
  const pathname = usePathname();
  const isMounted = useIsMounted();
  const [isDark, setIsDark] = React.useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    const stored = window.localStorage.getItem('evangelizae-theme');
    return stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [mobileMenuPath, setMobileMenuPath] = useState<string | null>(null);
  const isMobileMenuOpen = mobileMenuPath === pathname;

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [isDark]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'unset';
      }
    };
  }, [isMobileMenuOpen]);

  const toggleTheme = () => {
    if (typeof document !== 'undefined') {
      const willBeDark = !isDark;
      setIsDark(willBeDark);
      if (willBeDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('evangelizae-theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('evangelizae-theme', 'light');
      }
    }
  };

  // Full navigation items for Drawer & Footer
  const allNavItems = [
    { href: '/sanctuary', label: t('sanctuary'), icon: Church },
    { href: '/rosary', label: t('rosary'), icon: Sparkles },
    { href: '/liturgy', label: t('liturgy'), icon: BookOpen },
    { href: '/intentions', label: t('intentions'), icon: Heart },
    { href: '/ai', label: t('ai'), icon: Bot },
    { href: '/profile', label: t('profile'), icon: User },
    { href: '/about', label: t('about'), icon: ShieldCheck },
  ];

  // Primary top-bar items (ONLY shown on xl: 1280px+ wide screens to guarantee 100% ZERO overlap)
  const primaryNavItems = [
    { href: '/sanctuary', label: t('sanctuary'), icon: Church },
    { href: '/rosary', label: t('rosary'), icon: Sparkles },
    { href: '/liturgy', label: t('liturgy'), icon: BookOpen },
    { href: '/intentions', label: t('intentions'), icon: Heart },
  ];

  const targetLocale = currentLocale === 'pt' ? 'en' : 'pt';

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/90 dark:border-slate-800/90 backdrop-blur-md shadow-2xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          
          {/* Brand Logo & Mission Title */}
          <Link href="/sanctuary" className="flex items-center gap-2.5 sm:gap-3 shrink-0 group">
            <div className="w-9 sm:w-11 h-9 sm:h-11 rounded-xl cathedral-gradient flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
              <span className="font-serif text-lg sm:text-xl font-bold">E✝</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base sm:text-xl leading-tight tracking-wide text-slate-900 dark:text-white">
                Evangelizae
              </span>
              <span className="text-[9px] sm:text-[11px] uppercase tracking-wider text-sacred-gold font-bold">
                Veritas • Communio • Missio
              </span>
            </div>
          </Link>

          {/* Desktop Primary Navigation (Visible cleanly ONLY on xl: 1280px+ where there are 1400px+ of space) */}
          <nav className="hidden xl:flex items-center gap-1.5 2xl:gap-2 flex-1 justify-center px-4">
            {primaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 whitespace-nowrap ${
                    isActive
                      ? 'bg-sacred-gold/15 text-sacred-gold border border-sacred-gold/30 shadow-xs font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sacred-gold'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sacred-gold animate-pulse' : 'text-slate-500 dark:text-slate-400 group-hover:text-sacred-gold'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Header Controls: Profile, Locale Switcher, Theme Toggle, and Menu Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Profile Button (Sleek Icon/Label for quick access on desktop & tablet) */}
            <Link
              href="/profile"
              className={`hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                pathname.startsWith('/profile')
                  ? 'bg-sacred-gold/15 text-sacred-gold border border-sacred-gold/30 shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
              title={t('profile')}
            >
              <User className="w-3.5 h-3.5 text-sacred-gold shrink-0" />
              <span className="hidden lg:inline">{t('profile')}</span>
            </Link>

            {/* Locale Switcher */}
            <Link
              href={pathname}
              locale={targetLocale}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 shadow-2xs"
              title="Switch Language / Mudar Idioma"
            >
              <Globe className="w-3.5 h-3.5 text-sacred-gold shrink-0" />
              <span className="uppercase">{targetLocale}</span>
            </Link>

            {/* Theme Toggle */}
            {isMounted && (
              <button
                onClick={toggleTheme}
                className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0 shadow-2xs"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-sacred-gold" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
            )}

            {/* Hamburger Menu Trigger Button (Visible on ALL devices for instant access to Drawer & full menu) */}
            <button
              onClick={() => setMobileMenuPath(pathname)}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl cathedral-gradient text-white font-bold text-xs shadow-md active:scale-95 transition-transform shrink-0 hover:opacity-95"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4 shrink-0" />
              <span>Menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-Screen / Side Drawer Backdrop Modal */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/70 backdrop-blur-md animate-fadeIn">
          
          {/* Drawer Panel */}
          <div className="flex flex-col w-full max-w-md ml-auto h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl overflow-y-auto animate-slideLeft">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 sticky top-0 z-10 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl cathedral-gradient flex items-center justify-center text-white font-serif font-bold text-base shadow-sm">
                  E✝
                </div>
                <div className="flex flex-col">
                  <span className="font-serif font-bold text-base text-slate-900 dark:text-white leading-tight">
                    Evangelizae
                  </span>
                  <span className="text-[10px] uppercase font-bold text-sacred-gold tracking-wider">
                    {t('navSubtitle')}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => setMobileMenuPath(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Navigation Items List */}
            <div className="flex flex-col px-6 py-6 gap-6 flex-1">
              
              {/* 100% Free Forever Pledge Banner inside Drawer */}
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-950 dark:text-amber-200 text-xs font-bold leading-relaxed shadow-xs">
                <HeartHandshake className="w-5 h-5 text-sacred-gold shrink-0" />
                <span>{tCommon('freeForeverNotice')}</span>
              </div>

              {/* Mission & Philosophy Highlighted Card (`/about`) inside Drawer */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sacred-gold px-2">
                  {t('manifestoLabel')}
                </span>
                <Link
                  href="/about"
                  onClick={() => setMobileMenuPath(null)}
                  className={`flex items-center justify-between p-4 rounded-2xl transition-all ${
                    pathname.startsWith('/about')
                      ? 'bg-sacred-gold text-white font-bold shadow-md'
                      : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-950 dark:text-amber-200 border border-amber-500/30 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-sacred-gold/20 text-sacred-gold">
                      <ShieldCheck className="w-5 h-5 text-sacred-gold" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{t('about')}</span>
                      <span className="text-[11px] opacity-80 font-normal">Veritas • Communio • Missio</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Core Daily Habit Section */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2">
                  {t('drawerGroup1')}
                </span>
                
                {allNavItems.slice(0, 3).map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuPath(null)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-sacred-gold/15 text-sacred-gold border border-sacred-gold/30 font-bold shadow-xs'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isActive ? 'bg-sacred-gold text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-sacred-gold' : 'text-slate-400'}`} />
                    </Link>
                  );
                })}
              </div>

              {/* Formation, Communion & Profile Section */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2">
                  {t('drawerGroup2')}
                </span>
                
                {allNavItems.slice(3, 6).map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuPath(null)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl transition-all ${
                        isActive
                          ? 'bg-sacred-gold/15 text-sacred-gold border border-sacred-gold/30 font-bold shadow-xs'
                          : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isActive ? 'bg-sacred-gold text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isActive ? 'text-sacred-gold' : 'text-slate-400'}`} />
                    </Link>
                  );
                })}
              </div>

            </div>

            {/* Drawer Footer Note */}
            <div className="px-6 py-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-center flex flex-col gap-2">
              <span className="text-xs font-serif italic text-slate-600 dark:text-slate-400 font-medium">
                {t('drawerQuote')}
              </span>
              <span className="text-[11px] font-bold text-sacred-gold uppercase tracking-wider">
                Ad Maiorem Dei Gloriam (AMDG)
              </span>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
