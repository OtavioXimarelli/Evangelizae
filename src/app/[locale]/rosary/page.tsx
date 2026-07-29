'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EditorialCard } from '@/components/ui/EditorialCard';
import { BeadMap } from '@/components/rosary/BeadMap';
import { GoldFiligreeDivider, RoseWindowMotif, SacredRosaryEmblem } from '@/components/ui/SacredEmblems';
import { usePrayerStore } from '@/store/usePrayerStore';
import { useIsMounted } from '@/hooks/useIsMounted';
import { buildRosarySequence, MysteryType, ROSARY_MYSTERIES } from '@/services/rosaryEngine';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RotateCcw,
  Volume2,
  ShieldCheck,
  Flower2,
} from 'lucide-react';

export default function RosaryPage() {
  const t = useTranslations('Rosary');
  const tCommon = useTranslations('Common');
  const isMounted = useIsMounted();

  const {
    activeMysteryType,
    currentStepIndex,
    isCompleted,
    initRosary,
    advanceStep,
    previousStep,
    setStep,
    submitCheckIn,
    intentions,
    addIntention,
    removeIntention,
  } = usePrayerStore();

  const [newIntention, setNewIntention] = React.useState('');
  const [showLatin, setShowLatin] = React.useState(false);

  const steps = React.useMemo(() => {
    return buildRosarySequence(activeMysteryType || 'gloriosos');
  }, [activeMysteryType]);

  const currentStep = steps[currentStepIndex] || steps[0];
  const totalSteps = steps.length;

  const handleNextStep = () => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate([15]); } catch { /* vibration blocked */ }
    }
    advanceStep(totalSteps);
  };

  const handleSelectMystery = (type: MysteryType) => {
    initRosary(type);
  };

  const handleAddIntention = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIntention.trim()) {
      addIntention(newIntention);
      setNewIntention('');
    }
  };

  if (!isMounted) {
    return (
      <PageContainer>
        <div className="py-20 text-center font-serif text-slate-500 font-medium">
          {tCommon('loading')}
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* ── Header ── */}
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge={t('mysteryBadge')}
        icon={<SacredRosaryEmblem className="w-4 h-4 text-sacred-gold" />}
      />

      {/* ── Mystery Selector ── */}
      <div className="flex flex-wrap items-center gap-2.5 pb-2">
        {(Object.keys(ROSARY_MYSTERIES) as MysteryType[]).map((type) => {
          const group = ROSARY_MYSTERIES[type];
          const isCurrent = activeMysteryType === type;
          return (
            <button
              key={type}
              onClick={() => handleSelectMystery(type)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                isCurrent
                  ? 'bg-sacred-gold text-white shadow-md scale-105'
                  : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-sacred-gold'
              }`}
            >
              <Flower2 className={`w-4 h-4 ${isCurrent ? 'opacity-100' : 'opacity-50'}`} />
              <span>{group.titlePt.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* ── Completion Banner ── */}
      {isCompleted ? (
        <EditorialCard variant="accent" className="p-8 sm:p-12 text-center flex flex-col items-center gap-6 border-2 border-amber-500/40">
          {/* Sacred emblem */}
          <div className="relative flex items-center justify-center">
            <RoseWindowMotif className="w-24 h-24 text-sacred-gold opacity-20 absolute" />
            <div className="w-20 h-20 rounded-full bg-sacred-gold text-white flex items-center justify-center text-4xl shadow-lg z-10 ring-4 ring-amber-300/40">
              ✝
            </div>
          </div>

          <div className="flex flex-col gap-2 max-w-lg">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {t('completedBanner')}
            </h2>
            <p className="font-serif italic text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
              {t('completionDesc')}
            </p>
          </div>

          <GoldFiligreeDivider className="w-full max-w-xs" />

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => submitCheckIn()}
              className="px-7 py-3.5 rounded-xl bg-sacred-gold hover:bg-sacred-gold-light text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2 hover:scale-105"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{t('btnComplete')}</span>
            </button>
            <button
              onClick={() => initRosary(activeMysteryType)}
              className="px-5 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('btnRestart')}</span>
            </button>
          </div>
        </EditorialCard>
      ) : (
        /* ── Active Prayer Sequence ── */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── Main Prayer Card (2 cols) ── */}
          <EditorialCard className="lg:col-span-2 flex flex-col justify-between gap-8 p-6 sm:p-8 min-h-[520px] border-slate-200 dark:border-slate-700">

            {/* Step metadata header */}
            <div className="flex flex-col gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sacred-gold font-serif">
                  {t('stepCounter', { current: currentStep.stepNumber, total: totalSteps })}
                </span>
                {currentStep.latinText && (
                  <button
                    onClick={() => setShowLatin(!showLatin)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      showLatin
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-sacred-gold'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{showLatin ? t('latinActive') : t('viewLatin')}</span>
                  </button>
                )}
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {currentStep.titlePt}
              </h2>
            </div>

            {/* Prayer Content */}
            <div className="flex-grow flex flex-col justify-center gap-6 my-4">

              {/* Latin Text */}
              {showLatin && currentStep.latinText && (
                <div className="p-4 sm:p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 font-serif italic text-base sm:text-lg text-purple-900 dark:text-purple-200 leading-relaxed whitespace-pre-line font-medium">
                  {currentStep.latinText}
                </div>
              )}

              {/* Prayer Text */}
              <div className="font-serif text-lg sm:text-xl text-slate-900 dark:text-white leading-relaxed whitespace-pre-line font-medium">
                {currentStep.prayerTextPt}
              </div>

              {/* Mystery Contemplation Card */}
              {currentStep.mystery && currentStep.type !== 'mystery_intro' && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-500/10 dark:from-amber-500/10 dark:to-amber-500/5 border border-amber-500/30 flex flex-col gap-2">
                  <span className="font-bold text-sacred-gold uppercase text-xs font-serif tracking-wider">
                    {t('decadeMeditation', { decade: currentStep.decadeNumber ?? 1 })}
                  </span>
                  <span className="font-serif italic text-base sm:text-lg text-slate-800 dark:text-slate-200 font-medium leading-snug">
                    {currentStep.mystery.namePt}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-600 dark:text-slate-400 font-semibold border-t border-amber-500/20 pt-2">
                    <span className="text-sacred-gold">✦</span>
                    <span>{t('fruitLabel')}:</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{currentStep.mystery.fruitPt}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bead Map during decade */}
            {currentStep.type === 'decade_hail_mary' && (
              <BeadMap
                currentBeadInDecade={currentStep.beadInDecade}
                totalBeads={10}
              />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between pt-5 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={previousStep}
                disabled={currentStepIndex === 0}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-bold disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('btnPrevBead')}</span>
              </button>

              <button
                onClick={handleNextStep}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-sacred-gold hover:bg-sacred-gold-light text-white font-bold text-sm sm:text-base shadow-md gold-glow transition-all hover:scale-105 active:scale-95"
              >
                <span>{currentStepIndex + 1 === totalSteps ? t('finishRosary') : t('btnNextBead')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </EditorialCard>

          {/* ── Sidebar: Intentions & Quick Jump ── */}
          <div className="flex flex-col gap-6">

            {/* Intentions Panel */}
            <EditorialCard className="flex flex-col gap-4 p-5 border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                <ShieldCheck className="w-5 h-5 text-sacred-gold" />
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                  {t('personalIntentions')}
                </h3>
              </div>

              {/* List */}
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                {intentions.length === 0 ? (
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed">
                    {t('noIntentions')}
                  </p>
                ) : (
                  intentions.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between gap-2 p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-500/5 border border-amber-500/20 text-xs font-bold text-slate-800 dark:text-slate-200"
                    >
                      <span className="flex-grow">🙏 {item}</span>
                      <button
                        onClick={() => removeIntention(idx)}
                        className="text-red-400 hover:text-red-600 font-extrabold px-1 text-sm flex-shrink-0"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add Form */}
              <form onSubmit={handleAddIntention} className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newIntention}
                  onChange={(e) => setNewIntention(e.target.value)}
                  placeholder={t('addIntentionPlaceholder')}
                  className="flex-grow text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-sacred-gold font-medium"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2.5 rounded-xl bg-sacred-gold text-white text-xs font-extrabold hover:bg-sacred-gold-light transition-colors"
                >
                  +
                </button>
              </form>
            </EditorialCard>

            {/* Quick Step Jump */}
            <EditorialCard className="flex flex-col gap-3 p-5 border-slate-200 dark:border-slate-700">
              <h3 className="font-serif font-bold text-sm border-b border-slate-200 dark:border-slate-700 pb-2 text-slate-900 dark:text-white">
                {t('quickRosaryNav')}
              </h3>
              <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
                {steps.map((s, idx) => {
                  const isCurrent = idx === currentStepIndex;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setStep(idx)}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors truncate ${
                        isCurrent
                          ? 'bg-sacred-gold/20 text-sacred-gold font-extrabold border-l-4 border-sacred-gold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      {s.stepNumber}. {s.titlePt.split('(')[0]}
                    </button>
                  );
                })}
              </div>
            </EditorialCard>

          </div>
        </div>
      )}
    </PageContainer>
  );
}
