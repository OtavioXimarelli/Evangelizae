'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EditorialCard } from '@/components/ui/EditorialCard';
import { GoldFiligreeDivider } from '@/components/ui/SacredEmblems';
import {
  Sparkles,
  BookOpen,
  Heart,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Flame,
  HeartHandshake,
  Construction,
  Clock,
} from 'lucide-react';
import { usePrayerStore } from '@/store/usePrayerStore';
import { useIsMounted } from '@/hooks/useIsMounted';

export default function SanctuaryPage() {
  const t = useTranslations('Sanctuary');
  const tCommon = useTranslations('Common');
  const isMounted = useIsMounted();
  const { consecutiveDays, lastCheckInDate } = usePrayerStore();

  const todayStr = typeof window !== 'undefined' ? new Date().toISOString().split('T')[0] : '';
  const hasCheckedInToday = isMounted && lastCheckInDate === todayStr;

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        {/* Section Header with streak counter */}
        <SectionHeader
          title={t('title')}
          subtitle={t('subtitle')}
          badge={t('liturgicalSeason')}
          icon={<ShieldCheck className="w-4 h-4" />}
          rightAction={
            isMounted ? (
              <div className="flex items-center gap-2.5 bg-sacred-gold/15 border border-sacred-gold/30 px-4 py-2 rounded-xl text-sacred-gold font-bold shadow-xs">
                <Flame className="w-5 h-5 fill-sacred-gold animate-bounce" />
                <span>{t('faithfulDays', { days: consecutiveDays })}</span>
              </div>
            ) : null
          }
        />

        {/* Free Forever Pledge Notice */}
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-950 dark:text-amber-200 text-xs sm:text-sm font-bold shadow-2xs">
          <HeartHandshake className="w-5 h-5 text-sacred-gold flex-shrink-0" />
          <span>{tCommon('freeForeverNotice')}</span>
        </div>

        {/* Saint of the Day Banner */}
        <EditorialCard variant="liturgical" className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col gap-2.5 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-sacred-gold-badge">
              ✝ {t('saintOfDayTitle')}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              {t('saintOfDayName')}
            </h2>
            <p className="font-serif italic text-sm sm:text-base text-white/90 leading-relaxed font-medium">
              {t('saintOfDayQuote')}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href="/liturgy"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-transform hover:scale-105 shadow-md"
            >
              <BookOpen className="w-4 h-4 text-sacred-gold" />
              <span>{t('gospelCardAction')}</span>
            </Link>
          </div>
        </EditorialCard>
      </div>

      <GoldFiligreeDivider />

      {/* Main Grid: Guided Rosary & Today's Gospel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Guided Rosary Card — ACTIVE */}
        <EditorialCard variant="accent" className="flex flex-col justify-between gap-6 border-2 border-amber-500/40">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sacred-gold text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('guidedRosary')}</span>
              </span>
              {hasCheckedInToday && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  {t('completedToday')}
                </span>
              )}
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              {t('rosaryCardTitle')}
            </h3>
            <p className="text-sm font-bold text-sacred-gold">
              {t('rosaryCardSubtitle')}
            </p>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 mt-1 leading-relaxed font-medium">
              {t('rosaryCardDesc')}
            </p>
          </div>
          <Link
            href="/rosary"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-sacred-gold hover:bg-sacred-gold-light text-white font-bold text-sm shadow-md transition-all hover:shadow-lg"
          >
            <span>{t('rosaryCardAction')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </EditorialCard>

        {/* Gospel Card — ACTIVE */}
        <EditorialCard variant="default" className="flex flex-col justify-between gap-6 border-slate-200 dark:border-slate-700">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t('wordOfGod')}</span>
              </span>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('gospelCardRef')}</span>
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
              {t('gospelCardTitle')}
            </h3>
            <blockquote className="border-l-2 border-sacred-gold/60 pl-3 italic text-sm text-slate-700 dark:text-slate-200 my-1 font-medium">
              {t('gospelCardSnippet')}
            </blockquote>
          </div>
          <Link
            href="/liturgy"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-bold text-sm transition-colors shadow-md"
          >
            <span>{t('gospelCardAction')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </EditorialCard>
      </div>

      <GoldFiligreeDivider />

      {/* Under Development Features */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 30-Day Spiritual Plan — UNDER DEVELOPMENT */}
        <div className="lg:col-span-2 relative">
          <EditorialCard className="flex flex-col justify-between gap-6 border-slate-200 dark:border-slate-700 opacity-60 pointer-events-none select-none">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sacred-gold font-serif">
                  ✝ {t('planCardTitle')}
                </span>
                <span className="text-xs font-bold px-3 py-1 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                  {t('planPercent', { percent: 23 })}
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {t('planCardDay')}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {t('planCardDesc')}
              </p>
              <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div className="h-full bg-sacred-gold rounded-full w-[23%] transition-all duration-1000" />
              </div>
            </div>
            <div className="flex justify-end">
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-sacred-gold">
                <span>{t('planCardAction')}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </EditorialCard>
          {/* Under Development Overlay */}
          <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-4 p-6 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-dashed border-amber-500/50">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40">
              <Construction className="w-4 h-4" />
              {t('planDevBadge')}
            </span>
            <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white text-center">
              {t('planDevTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 text-center leading-relaxed font-medium max-w-sm">
              {t('planDevDesc')}
            </p>
            <div className="flex items-center gap-2 text-xs text-sacred-gold font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Fase 2</span>
            </div>
          </div>
        </div>

        {/* Intercession Wall — UNDER DEVELOPMENT */}
        <div className="relative">
          <EditorialCard className="flex flex-col justify-between gap-6 bg-gradient-to-br from-white to-amber-500/10 dark:from-slate-800 dark:to-amber-500/15 border-slate-200 dark:border-slate-700 opacity-60 pointer-events-none select-none">
            <div className="flex flex-col gap-3">
              <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 font-serif">
                <Heart className="w-3.5 h-3.5" />
                <span>{t('communionOfSouls')}</span>
              </span>
              <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
                {t('communityCardTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {t('communityCardSubtitle')}. {t('communityCardDesc')}
              </p>
            </div>
            <span className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-sacred-gold/60 text-sacred-gold font-bold text-sm">
              <span>{t('accessPrayerWall')}</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </EditorialCard>
          {/* Under Development Overlay */}
          <div className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center gap-3 p-6 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm border-2 border-dashed border-purple-500/40">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
              <Construction className="w-4 h-4" />
              {t('planDevBadge')}
            </span>
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white text-center">
              {t('wallDevTitle')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 text-center leading-relaxed font-medium">
              {t('wallDevDesc')}
            </p>
            <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>Fase 2</span>
            </div>
          </div>
        </div>

      </div>
    </PageContainer>
  );
}
