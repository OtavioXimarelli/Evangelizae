'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PageContainer } from '@/components/ui/PageContainer';
import { EditorialCard } from '@/components/ui/EditorialCard';
import { Sparkles, Church, BookOpen, ShieldCheck, ArrowRight, Award, HeartHandshake, Sun, Moon, Flame, Compass, CheckCircle2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { Chip } from '@heroui/react';

export default function LandingPage() {
  const t = useTranslations('Landing');

  const pillars = [
    {
      title: t('pillarPrayerTitle'),
      description: t('pillarPrayerDesc'),
      action: t('pillarPrayerAction'),
      href: '/rosary',
      emoji: '📿',
      iconBg: 'bg-sacred-gold',
      actionColor: 'text-sacred-gold',
      badge: t('tagRosary')
    },
    {
      title: t('pillarFormationTitle'),
      description: t('pillarFormationDesc'),
      action: t('pillarFormationAction'),
      href: '/liturgy',
      emoji: '📖',
      iconBg: 'bg-blue-600',
      actionColor: 'text-blue-600 dark:text-blue-400',
      badge: t('tagCanonical')
    },
    {
      title: t('pillarCommunionTitle'),
      description: t('pillarCommunionDesc'),
      action: t('pillarCommunionAction'),
      href: '/intentions',
      emoji: '🙏',
      iconBg: 'bg-purple-600',
      actionColor: 'text-purple-600 dark:text-purple-400',
      badge: t('tagCommunion')
    },
    {
      title: t('pillarChurchTitle'),
      description: t('pillarChurchDesc'),
      action: t('pillarChurchAction'),
      href: '/profile',
      emoji: '⛪',
      iconBg: 'bg-emerald-600',
      actionColor: 'text-emerald-600 dark:text-emerald-400',
      badge: t('tagParish')
    }
  ];

  const dailyRhythm = [
    {
      time: t('sanctuaryMorning'),
      desc: t('sanctuaryMorningDesc'),
      icon: <Sun className="w-6 h-6 text-amber-500" />,
      border: 'border-amber-500/30 dark:border-amber-500/40'
    },
    {
      time: t('sanctuaryNoon'),
      desc: t('sanctuaryNoonDesc'),
      icon: <Sparkles className="w-6 h-6 text-sacred-gold" />,
      border: 'border-sacred-gold/40'
    },
    {
      time: t('sanctuaryEvening'),
      desc: t('sanctuaryEveningDesc'),
      icon: <Compass className="w-6 h-6 text-blue-500" />,
      border: 'border-blue-500/30 dark:border-blue-500/40'
    },
    {
      time: t('sanctuaryNight'),
      desc: t('sanctuaryNightDesc'),
      icon: <Moon className="w-6 h-6 text-purple-500" />,
      border: 'border-purple-500/30 dark:border-purple-500/40'
    }
  ];

  return (
    <PageContainer className="gap-14 sm:gap-20 py-8 sm:py-14 overflow-hidden">
      {/* 1. Hero Section: Radiant Visual Presence & Clear Missionary Focus */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative flex flex-col items-center text-center gap-6 sm:gap-8 max-w-4xl mx-auto px-4 py-6"
      >
        <div className="pointer-events-none absolute -top-16 -left-12 w-56 h-56 rounded-full bg-sacred-gold/25 blur-3xl animate-floatSlow" />
        <div className="pointer-events-none absolute -bottom-16 -right-12 w-64 h-64 rounded-full bg-purple-600/20 blur-3xl animate-floatSlow-delay" />

        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold bg-sacred-gold/15 text-sacred-gold border border-sacred-gold/35 shadow-sm">
          <Church className="w-4 h-4 text-sacred-gold animate-pulse" />
          <span>{t('badge')}</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.16]">
          {t('heroTitle')}
        </h1>

        <p className="font-serif italic text-base sm:text-xl text-slate-700 dark:text-slate-200 max-w-2xl leading-relaxed font-medium">
          &ldquo;{t('heroSubtitle')}&rdquo;
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-sacred-gold/35 bg-sacred-gold/10 text-sacred-gold shadow-xs">
            {t('philNoAddiction')}
          </span>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-blue-500/35 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-xs">
            {t('philMagisterium')}
          </span>
          <span className="px-3.5 py-1.5 rounded-full text-xs font-bold border border-purple-500/35 bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-xs">
            {t('philNoRanking')}
          </span>
        </div>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3 w-full max-w-2xl">
          <Link
            href="/sanctuary"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl cathedral-gradient text-white font-bold text-base shadow-lg gold-glow hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2.5 animate-pulseGlow"
          >
            <span>{t('btnSanctuary')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/rosary"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white dark:bg-slate-800/95 border-2 border-sacred-gold/70 text-sacred-gold hover:bg-sacred-gold hover:text-white font-bold text-base shadow-md transition-all duration-300 flex items-center justify-center gap-2.5"
          >
            <span>{t('btnRosary')}</span>
            <Sparkles className="w-5 h-5" />
          </Link>

          <Link
            href="/about"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-sacred-gold font-bold text-base shadow-sm transition-all duration-300 flex items-center justify-center gap-2.5"
          >
            <span>{t('btnAboutMission')}</span>
            <BookOpen className="w-5 h-5 text-sacred-gold" />
          </Link>
        </div>
      </motion.div>

      {/* 2. Why We Choose Open Source & Non-Commercial Sacred Infrastructure */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8 max-w-5xl mx-auto w-full"
      >
        <div className="text-center flex flex-col gap-2 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-sacred-gold">
            {t('manifestoBadge')}
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {t('crisisTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
            {t('crisisSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Card: The Gospel Mandate / Free Spiritual Heritage */}
          <div className="rounded-3xl p-7 sm:p-8 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 flex flex-col justify-between gap-5 shadow-sm">
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-sacred-gold/15 text-sacred-gold self-start border border-sacred-gold/30">
                <BookOpen className="w-4 h-4 text-sacred-gold" />
                <span>{t('crisisProblemBadge')}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {t('crisisCard1Title')}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {t('crisisCard1Desc')}
              </p>
            </div>
          </div>

          {/* Right Card: Open Source Collaborative Apostolate */}
          <div className="rounded-3xl p-7 sm:p-8 bg-sacred-gold/10 dark:bg-sacred-gold/15 border-2 border-sacred-gold/60 dark:border-sacred-gold/70 flex flex-col justify-between gap-5 shadow-md gold-glow">
            <div className="flex flex-col gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold bg-sacred-gold text-white self-start shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>{t('crisisSolutionBadge')}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {t('crisisCard2Title')}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                {t('crisisCard2Desc')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. The 4 Pillars of Evangelizae */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8 w-full max-w-6xl mx-auto"
      >
        <div className="text-center flex flex-col gap-2 max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {t('pillarsTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
            {t('pillarsSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7">
          {pillars.map((pillar, index) => (
            <Link key={pillar.href} href={pillar.href} className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-sacred-gold rounded-2xl block h-full">
              <EditorialCard
                variant={index === 0 ? 'accent' : 'default'}
                className={`flex flex-col justify-between h-full gap-5 border-slate-200 dark:border-slate-700 shadow-md transition-all duration-300 ${
                  index === 0 ? 'border-2 border-amber-500/50' : 'hover:border-sacred-gold/50'
                }`}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-12 h-12 rounded-2xl ${pillar.iconBg} text-white flex items-center justify-center font-bold text-2xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
                        {pillar.emoji}
                      </div>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                        {pillar.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="self-start">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {pillar.badge}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                    {pillar.description}
                  </p>
                </div>

                <div className={`flex items-center gap-2 text-xs sm:text-sm font-bold pt-2 ${pillar.actionColor}`}>
                  <span>{pillar.action}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </EditorialCard>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* 4. Your Daily Sanctuary Rhythm (A Day with Evangelizae) */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8 max-w-6xl mx-auto w-full"
      >
        <div className="text-center flex flex-col gap-2 max-w-3xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            {t('dailySanctuaryTitle')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium">
            {t('dailySanctuarySubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {dailyRhythm.map((step, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-6 bg-white/90 dark:bg-slate-800/90 border ${step.border} shadow-sm flex flex-col gap-4 backdrop-blur-md`}
            >
              <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-900/80 flex items-center justify-center shadow-xs">
                {step.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {step.time}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 5. Deep Mission Manifesto: Built by Missionaries, For the Holy Church */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl mx-auto"
      >
        <EditorialCard variant="liturgical" className="relative p-8 sm:p-14 flex flex-col gap-8 my-2 shadow-2xl border border-white/20 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 -left-20 w-48 bg-white/10 blur-2xl animate-shineSweep" />
          
          <div className="flex flex-col gap-3 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-sacred-gold-badge">
              {t('manifestoBadge')}
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
              {t('missionDeepTitle')}
            </h2>
            <p className="text-sm sm:text-lg text-white/95 font-medium leading-relaxed">
              {t('missionDeepSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pt-2">
            <p className="text-xs sm:text-sm text-white/90 font-normal leading-relaxed">
              {t('missionDeepText1')}
            </p>
            <p className="text-xs sm:text-sm text-white/90 font-normal leading-relaxed">
              {t('missionDeepText2')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-white/20">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sacred-gold font-bold text-base">
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span>{t('philNoAddiction')}</span>
              </div>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                {t('philNoAddictionDesc')}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sacred-gold font-bold text-base">
                <Award className="w-5 h-5 flex-shrink-0" />
                <span>{t('philNoRanking')}</span>
              </div>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                {t('philNoRankingDesc')}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sacred-gold font-bold text-base">
                <BookOpen className="w-5 h-5 flex-shrink-0" />
                <span>{t('philMagisterium')}</span>
              </div>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                {t('philMagisteriumDesc')}
              </p>
            </div>

            {/* 4th Immutable Promise: 100% Free Forever & Open Source */}
            <div className="flex flex-col gap-2 bg-black/25 p-4 rounded-xl border border-sacred-gold/50 shadow-md">
              <div className="flex items-center gap-2 text-sacred-gold font-bold text-base">
                <HeartHandshake className="w-5 h-5 flex-shrink-0" />
                <span>{t('philFreeForever')}</span>
              </div>
              <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-semibold">
                {t('philFreeForeverDesc')}
              </p>
            </div>
          </div>
        </EditorialCard>
      </motion.div>

      {/* 6. Continue Your Journey */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col items-center gap-6 py-6 sm:py-10 max-w-3xl mx-auto px-4"
      >
        <div className="w-14 h-14 rounded-2xl bg-sacred-gold/15 border border-sacred-gold/40 flex items-center justify-center text-sacred-gold font-bold text-2xl shadow-sm">
          ✝
        </div>
        
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
          {t('continueTitle')}
        </h2>
        
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-xl">
          {t('continueSubtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-2xl pt-2">
          <Link
            href="/sanctuary"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl cathedral-gradient text-white font-bold text-base shadow-lg gold-glow hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <span>{t('btnSanctuary')}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/about"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-sacred-gold/15 border-2 border-sacred-gold text-sacred-gold hover:bg-sacred-gold hover:text-white font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>{t('btnAboutMission')}</span>
            <BookOpen className="w-5 h-5" />
          </Link>

          <a
            href="https://github.com/OtavioXimarelli/Evangelizae"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-sacred-gold font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>{t('btnExploreFeatures')}</span>
            <BookOpen className="w-5 h-5 text-sacred-gold" />
          </a>
        </div>
      </motion.div>
    </PageContainer>
  );
}
