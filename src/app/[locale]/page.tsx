'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { PageContainer } from '@/components/ui/PageContainer';
import { 
  RoseWindowMotif, 
  GoldFiligreeDivider, 
  SacredRosaryEmblem, 
  SacredScriptureEmblem, 
  IntercessionCandleEmblem, 
  CathedralSpireEmblem 
} from '@/components/ui/SacredEmblems';
import { 
  Sparkles, 
  Heart, 
  ShieldCheck, 
  ArrowRight, 
  Award, 
  HeartHandshake, 
  ChevronRight,
  Calendar,
  Coffee,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const t = useTranslations('Landing');
  const tSanctuary = useTranslations('Sanctuary');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div className="relative overflow-hidden min-h-screen stained-glass-bg">
      {/* Background Sacred Atmosphere: Soft Watermark */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 -z-10 opacity-15 pointer-events-none dark:opacity-20">
        <RoseWindowMotif className="w-[520px] h-[520px] text-sacred-gold animate-slowRotate" />
      </div>

      <PageContainer className="gap-12 sm:gap-16 py-8 sm:py-14 relative z-10">
        
        {/* HERO SECTION — Peaceful & Welcoming Sanctuary Entrance */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto px-4 pt-4 sm:pt-6"
        >
          {/* Sacred Top Ribbon */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 text-xs font-serif tracking-[0.25em] text-sacred-gold uppercase font-semibold">
            <span>❖</span>
            <span>PAX ET BONUM • AD MAJOREM DEI GLORIAM</span>
            <span>❖</span>
          </motion.div>

          {/* Warm Welcome Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-amber-500/10 dark:bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-sacred-gold/30 shadow-xs backdrop-blur-xs">
            <Heart className="w-4 h-4 text-sacred-gold fill-sacred-gold/30 animate-pulse" />
            <span>{t('badge')}</span>
          </motion.div>

          {/* Hero Title */}
          <motion.h1 
            variants={itemVariants} 
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.18]"
          >
            {t('heroTitle')}
          </motion.h1>

          {/* Gentle Welcoming Intro */}
          <motion.p 
            variants={itemVariants} 
            className="font-serif italic text-base sm:text-xl text-slate-700 dark:text-slate-200 max-w-2xl leading-relaxed font-medium"
          >
            &ldquo;{t('heroSubtitle')}&rdquo;
          </motion.p>

          {/* Inviting Action Links (Non-aggressive) */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full max-w-md">
            <Link
              href="/sanctuary"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl cathedral-gradient text-white font-bold text-base shadow-lg gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group border border-amber-500/30"
            >
              <span>{t('btnSanctuary')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/rosary"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white/90 dark:bg-slate-900/90 border border-sacred-gold/40 text-amber-900 dark:text-amber-200 hover:bg-sacred-gold hover:text-white hover:border-sacred-gold font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2.5 backdrop-blur-xs"
            >
              <span>{t('btnRosary')}</span>
              <Sparkles className="w-4 h-4 text-sacred-gold" />
            </Link>
          </motion.div>

          <GoldFiligreeDivider className="mt-2" />
        </motion.div>

        {/* TODAY'S SPIRITUAL INVITATION CARD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="cathedral-card rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto w-full relative overflow-hidden group border border-amber-500/20"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sacred-gold/15 text-sacred-gold border border-sacred-gold/30 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sacred-gold font-serif">
                    {t('todayTitle')}
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {tSanctuary('rosaryCardTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {t('todaySubtitle')}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/liturgy"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-semibold text-xs sm:text-sm hover:bg-sacred-gold transition-colors shadow-sm border border-slate-700/50"
              >
                <span>Liturgia Diária</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/rosary"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-900 dark:text-amber-200 font-semibold text-xs sm:text-sm hover:bg-sacred-gold hover:text-white transition-colors border border-amber-500/30"
              >
                <span>Santo Terço</span>
                <Sparkles className="w-4 h-4 text-sacred-gold" />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* CAMINHOS DE ORAÇÃO E VIDA INTERIOR — Warm & Natural Layout */}
        <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
          <div className="text-center flex flex-col gap-2">
            <span className="text-xs font-serif tracking-[0.25em] text-sacred-gold uppercase font-bold">
              VERITAS • COMMUNIO • MISSIO
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              {t('pathsTitle')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto">
              {t('pathsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Path 1: Rosary */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/rosary" className="block h-full">
                <div className="cathedral-card rounded-3xl p-7 flex flex-col justify-between gap-6 h-full border-l-4 border-l-amber-500 hover:border-amber-400 transition-all group">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                        <SacredRosaryEmblem className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-serif font-medium text-amber-700 dark:text-amber-300 tracking-wide">Oração Diária</span>
                    </div>
                    
                    <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white group-hover:text-sacred-gold transition-colors">
                      {t('pillarPrayerTitle')}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {t('pillarPrayerDesc')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-sacred-gold pt-3 border-t border-slate-200/60 dark:border-slate-800">
                    <span>Aprecie um momento de terço guiado</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Path 2: Liturgy & Formation */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/liturgy" className="block h-full">
                <div className="cathedral-card rounded-3xl p-7 flex flex-col justify-between gap-6 h-full border-l-4 border-l-blue-600 hover:border-blue-500 transition-all group">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-600/30 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                        <SacredScriptureEmblem className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-serif font-medium text-blue-700 dark:text-blue-300 tracking-wide">Formação & Verdade</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {t('pillarFormationTitle')}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {t('pillarFormationDesc')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                    <span>Ler as leituras de hoje e doutrina</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Path 3: Fraternal Prayer Wall */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/intentions" className="block h-full">
                <div className="cathedral-card rounded-3xl p-7 flex flex-col justify-between gap-6 h-full border-l-4 border-l-purple-600 hover:border-purple-500 transition-all group">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-purple-600/15 text-purple-600 dark:text-purple-400 border border-purple-600/30 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                        <IntercessionCandleEmblem className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-serif font-medium text-purple-700 dark:text-purple-300 tracking-wide">Comunhão Fraterna</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {t('pillarCommunionTitle')}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {t('pillarCommunionDesc')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                    <span>Deixar uma intenção ou rezar em silêncio</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Path 4: Screen to Altar / Parish */}
            <motion.div
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/profile" className="block h-full">
                <div className="cathedral-card rounded-3xl p-7 flex flex-col justify-between gap-6 h-full border-l-4 border-l-emerald-600 hover:border-emerald-500 transition-all group">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 border border-emerald-600/30 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                        <CathedralSpireEmblem className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-serif font-medium text-emerald-700 dark:text-emerald-300 tracking-wide">Vida Sacramental</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {t('pillarChurchTitle')}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {t('pillarChurchDesc')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                    <span>Ver constância e registrar paróquia física</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

          </div>
        </div>

        {/* NON-COMMERCIAL MANIFESTO & HUMBLE VOLUNTARY SUPPORT NOTE */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="cathedral-gradient rounded-3xl p-8 sm:p-12 text-white max-w-5xl mx-auto w-full shadow-xl relative overflow-hidden border border-amber-500/30"
        >
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col gap-8 relative z-10">
            <div className="flex flex-col gap-3 max-w-3xl">
              <span className="text-xs font-serif font-bold uppercase tracking-[0.25em] text-sacred-gold-badge flex items-center gap-2">
                <span>✝</span>
                <span>CARTA DE APRESENTAÇÃO & FRATERNIDADE</span>
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-snug">
                {t('philTitle')}
              </h2>
              <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed illuminated-cap">
                {t('philSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 pt-4 border-t border-white/15">
              
              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-sacred-gold font-bold text-sm sm:text-base">
                  <ShieldCheck className="w-5 h-5 text-sacred-gold shrink-0" />
                  <span>{t('philNoAddiction')}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('philNoAddictionDesc')}
                </p>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-sacred-gold font-bold text-sm sm:text-base">
                  <Award className="w-5 h-5 text-sacred-gold shrink-0" />
                  <span>{t('philNoRanking')}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('philNoRankingDesc')}
                </p>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-sacred-gold font-bold text-sm sm:text-base">
                  <BookOpen className="w-5 h-5 text-sacred-gold shrink-0" />
                  <span>{t('philMagisterium')}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('philMagisteriumDesc')}
                </p>
              </div>

              <div className="flex flex-col gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-sacred-gold font-bold text-sm sm:text-base">
                  <HeartHandshake className="w-5 h-5 text-sacred-gold shrink-0" />
                  <span>{t('philFreeForever')}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t('philFreeForeverDesc')}
                </p>
              </div>

            </div>

            {/* Warm Voluntary Gift / Donation Note */}
            <div className="p-6 rounded-2xl bg-amber-500/10 border border-sacred-gold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-xs">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sacred-gold/20 text-sacred-gold border border-sacred-gold/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Coffee className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-serif font-bold text-sm text-sacred-gold-badge">
                    {t('donationBannerTitle')}
                  </h4>
                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                    {t('donationBannerDesc')}
                  </p>
                </div>
              </div>

              <Link
                href="/about"
                className="px-5 py-2.5 rounded-xl bg-sacred-gold/20 hover:bg-sacred-gold text-sacred-gold hover:text-slate-950 font-bold text-xs transition-colors shrink-0 border border-sacred-gold/40 self-end sm:self-center"
              >
                Saiba Mais sobre a Obra
              </Link>
            </div>

            {/* Saint Augustin Closing Quote */}
            <div className="flex items-center justify-center pt-2 text-center">
              <p className="text-xs font-serif italic text-sacred-gold/90 max-w-xl">
                &ldquo;Fizeste-nos para ti, Senhor, e o nosso coração permanece inquieto enquanto não repousar em ti.&rdquo; — Santo Agostinho (Confissões, I, 1)
              </p>
            </div>

          </div>
        </motion.div>

      </PageContainer>
    </div>
  );
}

