'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EditorialCard } from '@/components/ui/EditorialCard';
import { Sparkles, BookOpen, Heart, CheckCircle2, ArrowRight, ShieldCheck, Flame, HeartHandshake } from 'lucide-react';
import { usePrayerStore } from '@/store/usePrayerStore';
import { useIsMounted } from '@/hooks/useIsMounted';

export default function SanctuaryPage() {
  const t = useTranslations('Sanctuary');
  const tCommon = useTranslations('Common');
  const isMounted = useIsMounted();
  const { consecutiveDays, totalRosariesPrayed, lastCheckInDate } = usePrayerStore();

  const todayStr = typeof window !== 'undefined' ? new Date().toISOString().split('T')[0] : '';
  const hasCheckedInToday = isMounted && lastCheckInDate === todayStr;

  return (
    <PageContainer>
      {/* Top Banner: Liturgical Season & Saint of the Day */}
      <div className="flex flex-col gap-6">
        <SectionHeader
          title={t('title')}
          subtitle={t('subtitle')}
          badge={t('liturgicalSeason')}
          icon={<ShieldCheck className="w-4 h-4" />}
          rightAction={
            isMounted ? (
              <div className="flex items-center gap-2.5 bg-sacred-gold/15 border border-sacred-gold/30 px-4 py-2 rounded-xl text-sacred-gold font-bold shadow-xs">
                <Flame className="w-5 h-5 fill-sacred-gold animate-bounce" />
                <span>{consecutiveDays} Dias Fies</span>
              </div>
            ) : null
          }
        />

        {/* 100% Free Forever Pledge Notice */}
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

      {/* Main Grid: Guided Rosary & Today's Gospel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Guided Rosary Card */}
        <EditorialCard variant="accent" className="flex flex-col justify-between gap-6 border-2 border-amber-500/40">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sacred-gold text-white shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Terço Guiado</span>
              </span>
              {hasCheckedInToday && (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Concluído hoje
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
              Guia passo a passo com áudio-vibração sensorial e meditação das Sagradas Escrituras em cada dezena.
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

        {/* Gospel Card */}
        <EditorialCard variant="default" className="flex flex-col justify-between gap-6 border-slate-200 dark:border-slate-700">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Palavra de Deus</span>
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

      {/* 30-Day Spiritual Plan & Community Wall Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 30-Day Spiritual Plan (2 cols) */}
        <EditorialCard className="lg:col-span-2 flex flex-col justify-between gap-6 border-slate-200 dark:border-slate-700">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sacred-gold">
                ✝ {t('planCardTitle')}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                23% Concluído
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {t('planCardDay')}
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {t('planCardDesc')}
            </p>
            {/* Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div className="h-full bg-sacred-gold rounded-full w-[23%] transition-all duration-1000" />
            </div>
          </div>
          <div className="flex justify-end">
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-sacred-gold hover:underline"
            >
              <span>{t('planCardAction')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </EditorialCard>

        {/* Community Intercessory Wall Callout */}
        <EditorialCard className="flex flex-col justify-between gap-6 bg-gradient-to-br from-white to-amber-500/10 dark:from-slate-800 dark:to-amber-500/15 border-slate-200 dark:border-slate-700">
          <div className="flex flex-col gap-3">
            <span className="inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
              <Heart className="w-3.5 h-3.5" />
              <span>Comunhão das Almas</span>
            </span>
            <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
              {t('communityCardTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {t('communityCardSubtitle')}. Reze em silêncio por quem necessita ou coloque a sua intenção de saúde, vocação ou família.
            </p>
          </div>
          <Link
            href="/intentions"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-sacred-gold/60 text-sacred-gold font-bold text-sm hover:bg-sacred-gold hover:text-white transition-all shadow-xs"
          >
            <span>Acessar Muro Sagrado</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </EditorialCard>

      </div>
    </PageContainer>
  );
}
