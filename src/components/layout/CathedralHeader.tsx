'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Church, Sparkles, BookOpen, Heart, Bot, User, Globe, Moon, Sun } from 'lucide-react';
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
  ];

  const currentLocale = typeof window !== 'undefined' && window.location.pathname.startsWith('/en') ? 'en' : 'pt';
  const targetLocale = currentLocale === 'pt' ? 'en' : 'pt';

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-xs transition-colors duration-250">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Mission Title */}
        <Link href="/sanctuary" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl cathedral-gradient flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
            <span className="font-serif text-xl font-bold">E✝</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif font-bold text-lg leading-tight tracking-wide text-slate-900 dark:text-white">
              Evangelizae
            </span>
            <span className="text-[10px] uppercase tracking-wider text-sacred-gold font-bold">
              Veritas • Communio • Missio
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-sacred-gold/15 text-sacred-gold border border-sacred-gold/30 shadow-xs'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sacred-gold'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sacred-gold animate-pulse' : 'text-slate-500 dark:text-slate-400 group-hover:text-sacred-gold'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme & Locale Controls */}
        <div className="flex items-center gap-3">
          {/* Locale Switcher */}
          <Link
            href={pathname}
            locale={targetLocale}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Switch Language / Mudar Idioma"
          >
            <Globe className="w-3.5 h-3.5 text-sacred-gold" />
            <span className="uppercase">{targetLocale}</span>
          </Link>

          {/* Theme Toggle */}
          {isMounted && (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-sacred-gold" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Strip */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 dark:border-slate-800 py-2.5 px-1 bg-white/98 dark:bg-slate-900/98 backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[11px] font-bold transition-all ${
                isActive ? 'text-sacred-gold' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-sacred-gold' : 'text-slate-500 dark:text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
