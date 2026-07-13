'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PageContainer } from '@/components/ui/PageContainer';
import { EditorialCard } from '@/components/ui/EditorialCard';
import { Sparkles, Church, BookOpen, ShieldCheck, ArrowRight, Award } from 'lucide-react';

export default function LandingPage() {
  const t = useTranslations('Landing');

  return (
    <PageContainer className="gap-10 sm:gap-14 py-6 sm:py-10">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto px-4 py-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-sacred-gold/15 text-sacred-gold border border-sacred-gold/30 shadow-xs">
          <Church className="w-4 h-4 text-sacred-gold animate-pulse" />
          <span>{t('badge')}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.18]">
          {t('heroTitle')}
        </h1>

        <p className="font-serif italic text-base sm:text-xl text-slate-700 dark:text-slate-200 max-w-2xl leading-relaxed font-medium">
          &ldquo;{t('heroSubtitle')}&rdquo;
        </p>

        {/* Hero Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full max-w-md">
          <Link
            href="/sanctuary"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl cathedral-gradient text-white font-bold text-base shadow-lg gold-glow hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <span>{t('btnSanctuary')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/rosary"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-sacred-gold/60 text-sacred-gold hover:bg-sacred-gold hover:text-white font-bold text-base shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{t('btnRosary')}</span>
            <Sparkles className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* The 4 Pillars of Evangelizae */}
      <div className="flex flex-col gap-6">
        <div className="text-center flex flex-col gap-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t('pillarsTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
            {t('pillarsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar I: Prayer */}
          <EditorialCard
            variant="accent"
            onClick={() => window.location.href = '/pt/rosary'}
            className="flex flex-col justify-between gap-4 border-2 border-amber-500/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-sacred-gold text-white flex items-center justify-center font-bold text-xl shadow-md">
                📿
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                {t('pillarPrayerTitle')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {t('pillarPrayerDesc')}
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-sacred-gold pt-2">
              <span>Conhecer Terço Guiado</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </EditorialCard>

          {/* Pillar II: Formation */}
          <EditorialCard
            variant="default"
            onClick={() => window.location.href = '/pt/liturgy'}
            className="flex flex-col justify-between gap-4 border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                📖
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                {t('pillarFormationTitle')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {t('pillarFormationDesc')}
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 pt-2">
              <span>Ler Liturgia Diária</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </EditorialCard>

          {/* Pillar III: Communion */}
          <EditorialCard
            variant="default"
            onClick={() => window.location.href = '/pt/intentions'}
            className="flex flex-col justify-between gap-4 border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                🙏
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                {t('pillarCommunionTitle')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {t('pillarCommunionDesc')}
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 pt-2">
              <span>Visitar Muro Orante</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </EditorialCard>

          {/* Pillar IV: Physical Church */}
          <EditorialCard
            variant="default"
            onClick={() => window.location.href = '/pt/profile'}
            className="flex flex-col justify-between gap-4 border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                ⛪
              </div>
              <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                {t('pillarChurchTitle')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {t('pillarChurchDesc')}
            </p>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-2">
              <span>Ver Progresso & Paróquia</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </EditorialCard>
        </div>
      </div>

      {/* Product Philosophy Card */}
      <EditorialCard variant="liturgical" className="p-8 sm:p-12 flex flex-col gap-8 my-2 shadow-xl border border-white/20">
        <div className="flex flex-col gap-2 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-widest text-sacred-gold-badge">
            ✝ Manifesto Evangelizae
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
            {t('philTitle')}
          </h2>
          <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed">
            {t('philSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/20">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sacred-gold font-bold text-base">
              <ShieldCheck className="w-5 h-5" />
              <span>{t('philNoAddiction')}</span>
            </div>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              {t('philNoAddictionDesc')}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sacred-gold font-bold text-base">
              <Award className="w-5 h-5" />
              <span>{t('philNoRanking')}</span>
            </div>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              {t('philNoRankingDesc')}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-sacred-gold font-bold text-base">
              <BookOpen className="w-5 h-5" />
              <span>{t('philMagisterium')}</span>
            </div>
            <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
              {t('philMagisteriumDesc')}
            </p>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <Link
            href="/sanctuary"
            className="px-8 py-4 rounded-xl bg-white text-slate-900 font-bold text-sm sm:text-base shadow-md hover:bg-slate-100 transition-transform hover:scale-105 inline-flex items-center gap-2"
          >
            <span>{t('btnSanctuary')}</span>
            <ArrowRight className="w-4 h-4 text-sacred-gold" />
          </Link>
        </div>
      </EditorialCard>
    </PageContainer>
  );
}
