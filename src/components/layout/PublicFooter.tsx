'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export function PublicFooter() {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 transition-colors">
      <div className="max-w-4xl mx-auto px-4 text-center flex flex-col items-center gap-6">
        
        {/* Sacred Cross Icon */}
        <div className="w-12 h-12 rounded-full bg-sacred-gold/15 border border-sacred-gold/30 flex items-center justify-center text-sacred-gold text-2xl font-serif shadow-xs">
          ✝
        </div>

        {/* Core Mission Statement */}
        <p className="text-sm sm:text-base font-serif italic text-slate-700 dark:text-slate-200 max-w-2xl leading-relaxed font-medium">
          &ldquo;{t('missionText')}&rdquo;
        </p>

        {/* Divider */}
        <div className="w-24 h-px bg-sacred-gold/40 my-1" />

        {/* Copyright & Magisterium Note */}
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
          <span>{t('copyright')}</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-sacred-gold font-bold hover:underline cursor-pointer">{t('privacy')}</span>
        </div>
      </div>
    </footer>
  );
}
