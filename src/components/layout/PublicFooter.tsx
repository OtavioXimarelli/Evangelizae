'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Heart } from 'lucide-react';

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

        {/* 100% Free Forever Pledge Box */}
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-950 dark:text-amber-200 text-xs sm:text-sm font-bold max-w-3xl leading-relaxed shadow-xs">
          <ShieldCheck className="w-5 h-5 text-sacred-gold flex-shrink-0" />
          <span>{t('freePledge')}</span>
        </div>

        {/* Divider */}
        <div className="w-24 h-px bg-sacred-gold/40 my-1" />

        {/* Copyright & Magisterium Note */}
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
          <span>{t('copyright')}</span>
          <span className="hidden sm:inline">•</span>
          <span className="text-sacred-gold font-bold hover:underline cursor-pointer flex items-center gap-1">
            <Heart className="w-3 h-3 fill-sacred-gold" />
            <span>Apoiar por Doação (Providência)</span>
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="text-slate-600 dark:text-slate-300 font-bold hover:underline cursor-pointer">{t('privacy')}</span>
        </div>
      </div>
    </footer>
  );
}
