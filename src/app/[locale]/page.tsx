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
  Church, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight, 
  Award, 
  HeartHandshake, 
  ChevronRight,
  Calendar
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <div className="relative overflow-hidden min-h-screen stained-glass-bg">
      {/* Background Sacred Atmosphere: Subtle Animated Rose Window Watermark */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 -z-10 opacity-15 pointer-events-none dark:opacity-25">
        <RoseWindowMotif className="w-[500px] h-[500px] text-sacred-gold animate-slowRotate" />
      </div>

      <PageContainer className="gap-12 sm:gap-16 py-8 sm:py-14 relative z-10">
        
        {/* HERO SECTION — Sacred Cathedral Portal */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto px-4 pt-4 sm:pt-8"
        >
          {/* Sacred Latin Top Ribbon */}
          <motion.div variants={itemVariants} className="flex items-center gap-2 text-xs font-serif tracking-[0.25em] text-sacred-gold/90 uppercase font-semibold">
            <span>❖</span>
            <span>AD MAJOREM DEI GLORIAM</span>
            <span>❖</span>
          </motion.div>

          {/* Mission Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold bg-sacred-gold/10 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-sacred-gold/30 shadow-xs backdrop-blur-xs">
            <Church className="w-4 h-4 text-sacred-gold animate-pulse" />
            <span>{t('badge')}</span>
          </motion.div>

          {/* Hero Title with Gold Leaf Gradient */}
          <motion.h1 
            variants={itemVariants} 
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.15]"
          >
            A Tecnologia a Serviço da <span className="gold-leaf-text font-serif italic">Fé e da Vida Cristã</span>
          </motion.h1>

          {/* Subtitle / Quote */}
          <motion.p 
            variants={itemVariants} 
            className="font-serif italic text-base sm:text-xl text-slate-700 dark:text-slate-200 max-w-2xl leading-relaxed font-medium"
          >
            &ldquo;{t('heroSubtitle')}&rdquo;
          </motion.p>

          {/* Hero Call to Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full max-w-md">
            <Link
              href="/sanctuary"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl cathedral-gradient text-white font-bold text-base shadow-xl gold-glow hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group border border-amber-500/30"
            >
              <span>{t('btnSanctuary')}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/rosary"
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white/90 dark:bg-slate-900/90 border-2 border-sacred-gold/50 text-amber-800 dark:text-amber-300 hover:bg-sacred-gold hover:text-white hover:border-sacred-gold font-bold text-base shadow-md transition-all flex items-center justify-center gap-2.5 backdrop-blur-xs"
            >
              <span>{t('btnRosary')}</span>
              <Sparkles className="w-5 h-5" />
            </Link>
          </motion.div>

          <GoldFiligreeDivider className="mt-4" />
        </motion.div>

        {/* DAILY LITURGICAL TODAY PREVIEW BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="cathedral-card rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto w-full relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-sacred-gold/15 text-sacred-gold border border-sacred-gold/30 flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-sacred-gold">
                    {tSanctuary('liturgicalSeason')}
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                  {tSanctuary('rosaryCardTitle')}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {tSanctuary('rosaryCardSubtitle')}
                </p>
              </div>
            </div>

            <Link
              href="/liturgy"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-semibold text-xs sm:text-sm hover:bg-sacred-gold transition-colors shrink-0 shadow-sm border border-slate-700/50"
            >
              <span>{tSanctuary('gospelCardAction')}</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>

        {/* THE 4 PILLARS OF EVANGELIZAE — Custom Sacred Emblems & Architectural Framing */}
        <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full">
          <div className="text-center flex flex-col gap-2">
            <span className="text-xs font-serif tracking-[0.2em] text-sacred-gold uppercase font-bold">
              VERITAS • COMMUNIO • MISSIO
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              {t('pillarsTitle')}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium max-w-2xl mx-auto">
              {t('pillarsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Pillar I: Prayer */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/rosary" className="block h-full">
                <div className="cathedral-card rounded-3xl p-7 flex flex-col justify-between gap-6 h-full border-l-4 border-l-amber-500 hover:border-amber-400 transition-all group">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                        <SacredRosaryEmblem className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-serif font-bold text-amber-600 dark:text-amber-400 tracking-wider">PILAR I</span>
                    </div>
                    
                    <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white group-hover:text-sacred-gold transition-colors">
                      {t('pillarPrayerTitle')}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {t('pillarPrayerDesc')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-sacred-gold pt-3 border-t border-slate-200/60 dark:border-slate-800">
                    <span>Rezar o Santo Rosário Guiado</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Pillar II: Formation */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/liturgy" className="block h-full">
                <div className="cathedral-card rounded-3xl p-7 flex flex-col justify-between gap-6 h-full border-l-4 border-l-blue-600 hover:border-blue-500 transition-all group">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-600/30 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                        <SacredScriptureEmblem className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-serif font-bold text-blue-600 dark:text-blue-400 tracking-wider">PILAR II</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {t('pillarFormationTitle')}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {t('pillarFormationDesc')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                    <span>Ler a Liturgia Diária & Magistério</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Pillar III: Communion */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/intentions" className="block h-full">
                <div className="cathedral-card rounded-3xl p-7 flex flex-col justify-between gap-6 h-full border-l-4 border-l-purple-600 hover:border-purple-500 transition-all group">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-purple-600/15 text-purple-600 dark:text-purple-400 border border-purple-600/30 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                        <IntercessionCandleEmblem className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-serif font-bold text-purple-600 dark:text-purple-400 tracking-wider">PILAR III</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {t('pillarCommunionTitle')}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {t('pillarCommunionDesc')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                    <span>Visitar Muro Orante de Intercessão</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Pillar IV: Physical Church */}
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/profile" className="block h-full">
                <div className="cathedral-card rounded-3xl p-7 flex flex-col justify-between gap-6 h-full border-l-4 border-l-emerald-600 hover:border-emerald-500 transition-all group">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-600/15 text-emerald-600 dark:text-emerald-400 border border-emerald-600/30 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                        <CathedralSpireEmblem className="w-7 h-7" />
                      </div>
                      <span className="text-xs font-serif font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">PILAR IV</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {t('pillarChurchTitle')}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                      {t('pillarChurchDesc')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                    <span>Ver Progresso & Paróquia Física</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>

          </div>
        </div>

        {/* SACRED MANIFESTO — Illuminated Style ("Da Tela ao Altar") */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="cathedral-gradient rounded-3xl p-8 sm:p-12 text-white max-w-5xl mx-auto w-full shadow-2xl relative overflow-hidden border border-amber-500/30"
        >
          {/* Subtle Ambient Halo Overlay */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col gap-8 relative z-10">
            <div className="flex flex-col gap-3 max-w-3xl">
              <span className="text-xs font-serif font-bold uppercase tracking-[0.25em] text-sacred-gold-badge flex items-center gap-2">
                <span>✝</span>
                <span>MANIFESTO DE FÉ & GRATIDÃO</span>
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-snug">
                {t('philTitle')}
              </h2>
              <p className="text-sm sm:text-base text-slate-200 font-medium leading-relaxed illuminated-cap">
                {t('philSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-white/15">
              
              <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-sacred-gold font-bold text-base">
                  <ShieldCheck className="w-5 h-5 text-sacred-gold shrink-0" />
                  <span>{t('philNoAddiction')}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {t('philNoAddictionDesc')}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-sacred-gold font-bold text-base">
                  <Award className="w-5 h-5 text-sacred-gold shrink-0" />
                  <span>{t('philNoRanking')}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {t('philNoRankingDesc')}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-sacred-gold font-bold text-base">
                  <BookOpen className="w-5 h-5 text-sacred-gold shrink-0" />
                  <span>{t('philMagisterium')}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {t('philMagisteriumDesc')}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-sacred-gold font-bold text-base">
                  <HeartHandshake className="w-5 h-5 text-sacred-gold shrink-0" />
                  <span>{t('philFreeForever')}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                  {t('philFreeForeverDesc')}
                </p>
              </div>

            </div>

            {/* Bottom Closing Affirmation */}
            <div className="flex items-center justify-center pt-2 text-center">
              <p className="text-xs font-serif italic text-sacred-gold/90 max-w-xl">
                &ldquo;Não a nós, Senhor, não a nós, mas ao vosso Nome dai glória.&rdquo; — Salmo 115, 1
              </p>
            </div>

          </div>
        </motion.div>

      </PageContainer>
    </div>
  );
}
