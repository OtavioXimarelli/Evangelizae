'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Church, Sparkles, BookOpen, Heart, Bot, User, Globe, Moon, Sun, ShieldCheck } from 'lucide-react';
import { useIsMounted } from '@/hooks/useIsMounted';

export function CathedralHeader() {
  const t = useTranslations('Header');
  const pathname = usePathname();
  const isMounted = useIsMounted();
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      const stored = localStorage.getItem('evangelizae-theme');
      if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
      }
    }
  }, []);

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

  const navItems = [
    { href: '/sanctuary', label: t('sanctuary'), icon: Church },
    { href: '/rosary', label: t('rosary'), icon: Sparkles },
    { href: '/liturgy', label: t('liturgy'), icon: BookOpen },
    { href: '/intentions', label: t('intentions'), icon: Heart },
    { href: '/ai', label: t('ai'), icon: Bot },
    { href: '/profile', label: t('profile'), icon: User },
    { href: '/about', label: t('about'), icon: ShieldCheck },
  ];

  const currentLocale = typeof window !== 'undefined' && window.location.pathname.startsWith('/en') ? 'en' : 'pt';
  const targetLocale = currentLocale === 'pt' ? 'en' : 'pt';

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-xs transition-colors duration-250">
      {/* Main Top Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 lg:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo & Mission Title */}
        <Link href="/sanctuary" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
          <div className="w-9 sm:w-11 h-9 sm:h-11 rounded-xl cathedral-gradient flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
            <span className="font-serif text-lg sm:text-xl font-bold">E✝</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-base sm:text-xl leading-tight tracking-wide text-slate-900 dark:text-white">
              Evangelizae
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-sacred-gold font-bold">
              Veritas • Communio • Missio
            </span>
          </div>
        </Link>

        {/* Desktop & Tablet Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 xl:gap-2 overflow-x-auto no-scrollbar py-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-1.5 px-2.5 lg:px-3 xl:px-3.5 py-1.5 lg:py-2 rounded-xl text-xs lg:text-sm font-bold transition-all shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-sacred-gold/15 text-sacred-gold border border-sacred-gold/30 shadow-xs'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sacred-gold'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sacred-gold animate-pulse' : 'text-slate-500 dark:text-slate-400 group-hover:text-sacred-gold'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme & Locale Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Locale Switcher */}
          <Link
            href={pathname}
            locale={targetLocale}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
            title="Switch Language / Mudar Idioma"
          >
            <Globe className="w-3.5 h-3.5 text-sacred-gold shrink-0" />
            <span className="uppercase">{targetLocale}</span>
          </Link>

          {/* Theme Toggle */}
          {isMounted && (
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-sacred-gold" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Strip (Accessible across all narrow devices) */}
      <div className="md:hidden flex items-center justify-start sm:justify-around gap-1.5 border-t border-slate-200 dark:border-slate-800 py-2.5 px-2 sm:px-4 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md overflow-x-auto no-scrollbar w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 p-1.5 shrink-0 min-w-[62px] sm:min-w-[68px] rounded-xl text-[10px] sm:text-[11px] font-bold transition-all ${
                isActive ? 'bg-sacred-gold/15 text-sacred-gold border border-sacred-gold/30 shadow-2xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sacred-gold' : 'text-slate-500 dark:text-slate-400'}`} />
              <span className="truncate max-w-[66px] text-center leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
