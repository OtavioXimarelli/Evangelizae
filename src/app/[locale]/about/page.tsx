'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PageContainer } from '@/components/ui/PageContainer';
import { EditorialCard } from '@/components/ui/EditorialCard';
import { 
  Church, 
  ShieldCheck, 
  BookOpen, 
  Heart, 
  HeartHandshake, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Flame,
  Award,
  Compass,
  Landmark,
  Activity,
  Users
} from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('About');

  return (
    <PageContainer className="gap-10 sm:gap-14 py-6 sm:py-10 max-w-5xl mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-sacred-gold/15 text-sacred-gold border border-sacred-gold/30 shadow-xs">
          <Church className="w-4 h-4 text-sacred-gold animate-pulse" />
          <span>{t('badge')}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.18]">
          {t('title')}
        </h1>

        <p className="font-serif italic text-base sm:text-xl text-slate-700 dark:text-slate-200 max-w-3xl leading-relaxed font-medium">
          &ldquo;{t('subtitle')}&rdquo;
        </p>
      </div>

      {/* 2. Intro Manifesto & Canonical Quote */}
      <EditorialCard variant="liturgical" className="p-8 sm:p-12 flex flex-col gap-6 w-full shadow-2xl border border-white/20">
        <div className="flex items-center gap-2 text-sacred-gold-badge text-xs font-bold uppercase tracking-widest">
          <Compass className="w-4 h-4" />
          <span>{t('introTitle')}</span>
        </div>
        
        <p className="font-serif text-base sm:text-lg text-white leading-relaxed font-normal">
          {t('introText')}
        </p>

        <p className="font-serif text-base sm:text-lg text-white/90 leading-relaxed font-normal">
          {t('introText2')}
        </p>

        <div className="border-t border-white/20 pt-6 mt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-white/80 italic font-medium">
          <span>&ldquo;{t('deiVerbumQuote')}&rdquo;</span>
          <span className="font-bold text-sacred-gold">— Dei Verbum, 10</span>
        </div>
      </EditorialCard>

      {/* 3. Our Mission, Values & Sacred Purpose */}
      <div className="flex flex-col gap-6 w-full">
        <div className="text-center flex flex-col gap-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 self-center">
            <Sparkles className="w-4 h-4 text-sacred-gold" />
            <span>Veritas & Missio</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {t('missionValuesTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
            {t('missionValuesSubtitle')}
          </p>
        </div>

        <EditorialCard variant="default" className="p-8 sm:p-10 border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 shadow-md">
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
            {t('missionText')}
          </p>
        </EditorialCard>
      </div>

      {/* 4. The Importance of an Active & Faithful Christian Life */}
      <div className="flex flex-col gap-6 w-full">
        <div className="text-center flex flex-col gap-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 self-center">
            <Activity className="w-4 h-4" />
            <span>Fides et Opera (Tiago 2, 17)</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {t('activeFaithTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium italic">
            &ldquo;{t('activeFaithSubtitle')}&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditorialCard variant="default" className="p-7 sm:p-8 border-slate-200 dark:border-slate-700 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              ✝
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {t('activeFaithText1')}
            </p>
          </EditorialCard>

          <EditorialCard variant="default" className="p-7 sm:p-8 border-slate-200 dark:border-slate-700 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              🙏
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {t('activeFaithText2')}
            </p>
          </EditorialCard>
        </div>
      </div>

      {/* 5. The Primordial Role of the Holy Catholic Church and the Altar */}
      <div className="flex flex-col gap-6 w-full">
        <div className="text-center flex flex-col gap-2 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 self-center">
            <Landmark className="w-4 h-4" />
            <span>Corpus Christi & Ecclesia</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {t('churchRoleTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium italic">
            &ldquo;{t('churchRoleSubtitle')}&rdquo;
          </p>
        </div>

        <EditorialCard variant="accent" className="p-8 sm:p-10 border-2 border-amber-500/50 shadow-xl bg-gradient-to-br from-amber-500/10 via-white to-amber-500/5 dark:from-amber-500/15 dark:via-slate-900 dark:to-amber-500/10 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Church className="w-5 h-5 text-sacred-gold" />
                <span>O Corpo Místico de Cristo</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {t('churchRoleText1')}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-sacred-gold" />
                <span>O Nártex Digital do Altar</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {t('churchRoleText2')}
              </p>
            </div>
          </div>
        </EditorialCard>
      </div>

      {/* 6. The Core Goal Box: From Screen to Altar */}
      <div className="w-full">
        <EditorialCard variant="liturgical" className="p-8 sm:p-10 flex flex-col gap-5 border border-white/20 shadow-xl">
          <div className="flex items-center gap-2.5 text-sacred-gold-badge font-bold text-sm uppercase tracking-wider">
            <Flame className="w-5 h-5 text-sacred-gold" />
            <span>{t('goalBoxTitle')}</span>
          </div>

          <blockquote className="font-serif text-xl sm:text-2xl font-bold text-white leading-snug">
            {t('goalBoxQuote')}
          </blockquote>

          <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed">
            {t('goalBoxSub')}
          </p>

          <div className="flex items-center gap-2 text-xs font-bold text-sacred-gold pt-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('goalTagline')}</span>
          </div>
        </EditorialCard>
      </div>

      {/* 7. Explanation of the 4 Pillars of Evangelizae */}
      <div className="flex flex-col gap-6 w-full pt-4">
        <div className="text-center flex flex-col gap-2 max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {t('pillarsExplanationTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
            {t('pillarsExplanationSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditorialCard variant="default" className="p-7 sm:p-8 border-slate-200 dark:border-slate-700 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                📿
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {t('pillar1Title')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {t('pillar1Desc')}
            </p>
          </EditorialCard>

          <EditorialCard variant="default" className="p-7 sm:p-8 border-slate-200 dark:border-slate-700 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                📖
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {t('pillar2Title')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {t('pillar2Desc')}
            </p>
          </EditorialCard>

          <EditorialCard variant="default" className="p-7 sm:p-8 border-slate-200 dark:border-slate-700 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                🙏
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {t('pillar3Title')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {t('pillar3Desc')}
            </p>
          </EditorialCard>

          <EditorialCard variant="default" className="p-7 sm:p-8 border-slate-200 dark:border-slate-700 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-2xl shadow-md">
                ⛪
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {t('pillar4Title')}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {t('pillar4Desc')}
            </p>
          </EditorialCard>
        </div>
      </div>

      {/* 8. The 4 Immutable Commitments (Open Source) */}
      <div className="flex flex-col gap-6 w-full pt-6 border-t border-slate-200 dark:border-slate-800">
        <div className="text-center flex flex-col gap-2">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {t('pillarsHeader')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
            {t('pillarsSub')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <EditorialCard variant="default" className="flex flex-col justify-between gap-4 border-slate-200 dark:border-slate-700 p-6 sm:p-8">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-xl shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {t('c1Title')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {t('c1Desc')}
                </p>
              </div>
            </div>
          </EditorialCard>

          <EditorialCard variant="default" className="flex flex-col justify-between gap-4 border-slate-200 dark:border-slate-700 p-6 sm:p-8">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-sacred-gold text-white flex items-center justify-center flex-shrink-0 font-bold text-xl shadow-md">
                <Award className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {t('c2Title')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {t('c2Desc')}
                </p>
              </div>
            </div>
          </EditorialCard>

          <EditorialCard variant="default" className="flex flex-col justify-between gap-4 border-slate-200 dark:border-slate-700 p-6 sm:p-8">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-xl shadow-md">
                <Users className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {t('c3Title')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {t('c3Desc')}
                </p>
              </div>
            </div>
          </EditorialCard>

          <EditorialCard variant="default" className="flex flex-col justify-between gap-4 border-2 border-emerald-500/40 p-6 sm:p-8 bg-emerald-500/5 dark:bg-emerald-500/10">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-xl shadow-md">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {t('c4Title')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                  {t('c4Desc')}
                </p>
              </div>
            </div>
          </EditorialCard>
        </div>
      </div>

      {/* 9. Consecration & Closing CTA Card */}
      <EditorialCard variant="liturgical" className="p-8 sm:p-12 flex flex-col items-center text-center gap-6 w-full my-4 shadow-2xl border border-white/20">
        <div className="w-14 h-14 rounded-full bg-sacred-gold/20 border border-sacred-gold/40 flex items-center justify-center text-sacred-gold text-3xl font-serif">
          ✝
        </div>

        <div className="flex flex-col gap-2 max-w-2xl">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
            {t('ctaTitle')}
          </h2>
          <p className="text-sm sm:text-base text-white/90 font-medium leading-relaxed">
            {t('ctaText')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full max-w-lg">
          <Link
            href="/sanctuary"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-slate-900 font-bold text-sm sm:text-base shadow-lg hover:bg-slate-100 transition-transform hover:scale-105 inline-flex items-center justify-center gap-2"
          >
            <span>{t('btnSanctuary')}</span>
            <ArrowRight className="w-4 h-4 text-sacred-gold" />
          </Link>

          <Link
            href="/rosary"
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-black/30 border border-sacred-gold text-sacred-gold hover:bg-sacred-gold hover:text-white font-bold text-sm sm:text-base transition-all inline-flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('btnRosary')}</span>
          </Link>
        </div>

        <div className="text-xs text-white/70 font-bold pt-2 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-sacred-gold" />
          <span>{t('btnDonate')} • Providência Divina & Amor à Igreja</span>
        </div>
      </EditorialCard>
    </PageContainer>
  );
}
