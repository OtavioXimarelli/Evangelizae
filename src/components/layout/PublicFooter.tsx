'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ShieldCheck } from 'lucide-react';

export function PublicFooter() {
  const t = useTranslations('Footer');
  const tHeader = useTranslations('Header');

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md py-8 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 flex flex-col gap-6">
        
        {/* Main Concise Bar: Identity, Short Mission & Essential Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
          
          {/* Identity & Mission */}
          <div className="flex flex-col gap-2 max-w-xl">
            <Link href="/sanctuary" className="flex items-center gap-2.5 group w-fit">
              <div className="w-8 h-8 rounded-lg cathedral-gradient flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <span className="font-serif text-sm font-bold">E✝</span>
              </div>
              <span className="font-serif font-bold text-lg leading-none text-slate-900 dark:text-white">
                Evangelizae
              </span>
              <span className="text-[10px] font-serif uppercase tracking-widest text-sacred-gold font-semibold ml-1">
                Veritas • Communio • Missio
              </span>
            </Link>

            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {t('missionShort')}
            </p>
          </div>

          {/* Quick Navigation Links */}
          <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Link href="/sanctuary" className="hover:text-sacred-gold transition-colors">
              {tHeader('sanctuary')}
            </Link>
            <Link href="/rosary" className="hover:text-sacred-gold transition-colors">
              {tHeader('rosary')}
            </Link>
            <Link href="/liturgy" className="hover:text-sacred-gold transition-colors">
              {tHeader('liturgy')}
            </Link>
            <Link href="/intentions" className="hover:text-sacred-gold transition-colors">
              {tHeader('intentions')}
            </Link>
            <Link href="/ai" className="hover:text-sacred-gold transition-colors">
              {tHeader('ai')}
            </Link>
            <Link href="/about" className="text-sacred-gold font-bold hover:underline transition-colors">
              {tHeader('about')}
            </Link>
          </nav>
        </div>

        {/* Free Pledge & Scripture / Copyright Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-serif text-slate-500 dark:text-slate-400">
          
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-sacred-gold shrink-0" />
            <span className="font-sans text-[11px] font-medium text-slate-600 dark:text-slate-400">{t('freePledge')}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            <span>{t('copyright')}</span>
            <span>•</span>
            <span className="italic font-serif text-sacred-gold/90">{t('matthewVerse')}</span>
          </div>

        </div>

      </div>
    </footer>
  );
}

