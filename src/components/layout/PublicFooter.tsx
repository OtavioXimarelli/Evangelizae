'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { ShieldCheck, Heart, Church, Sparkles, BookOpen, Bot, User, Compass } from 'lucide-react';

export function PublicFooter() {
  const t = useTranslations('Footer');
  const tHeader = useTranslations('Header');

  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-10 transition-colors">
      <div className="max-w-5xl mx-auto px-4 text-center flex flex-col items-center gap-6">
        
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

        {/* Sacred Footer Navigation Strip (including About section) */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 max-w-3xl pt-2">
          <Link
            href="/sanctuary"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sacred-gold transition-colors"
          >
            <Church className="w-3.5 h-3.5 text-sacred-gold" />
            <span>{tHeader('sanctuary')}</span>
          </Link>

          <Link
            href="/rosary"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sacred-gold transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-sacred-gold" />
            <span>{tHeader('rosary')}</span>
          </Link>

          <Link
            href="/liturgy"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sacred-gold transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-sacred-gold" />
            <span>{tHeader('liturgy')}</span>
          </Link>

          <Link
            href="/intentions"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sacred-gold transition-colors"
          >
            <Heart className="w-3.5 h-3.5 text-sacred-gold" />
            <span>{tHeader('intentions')}</span>
          </Link>

          <Link
            href="/ai"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sacred-gold transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-sacred-gold" />
            <span>{tHeader('ai')}</span>
          </Link>

          <Link
            href="/profile"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-sacred-gold transition-colors"
          >
            <User className="w-3.5 h-3.5 text-sacred-gold" />
            <span>{tHeader('profile')}</span>
          </Link>

          {/* About / Manifesto Highlighted Footer Link */}
          <Link
            href="/about"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-sacred-gold/15 text-sacred-gold border border-sacred-gold/40 hover:bg-sacred-gold hover:text-white transition-all shadow-2xs"
          >
            <Compass className="w-3.5 h-3.5 animate-pulse" />
            <span>{tHeader('about')} (Manifesto)</span>
          </Link>
        </div>

        {/* Divider */}
        <div className="w-32 h-px bg-sacred-gold/40 my-1" />

        {/* Copyright & Magisterium Note */}
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
          <span>{t('copyright')}</span>
          <span className="hidden sm:inline">•</span>
          <Link href="/about" className="text-sacred-gold font-bold hover:underline cursor-pointer flex items-center gap-1">
            <Heart className="w-3 h-3 fill-sacred-gold" />
            <span>Apoiar por Doação (Providência)</span>
          </Link>
          <span className="hidden sm:inline">•</span>
          <Link href="/about" className="text-slate-600 dark:text-slate-300 font-bold hover:underline cursor-pointer">{t('privacy')}</Link>
        </div>
      </div>
    </footer>
  );
}
