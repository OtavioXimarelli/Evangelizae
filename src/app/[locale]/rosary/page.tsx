'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EditorialCard } from '@/components/ui/EditorialCard';
import { BeadMap } from '@/components/rosary/BeadMap';
import { usePrayerStore } from '@/store/usePrayerStore';
import { useIsMounted } from '@/hooks/useIsMounted';
import { buildRosarySequence, MysteryType, ROSARY_MYSTERIES } from '@/services/rosaryEngine';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, RotateCcw, Volume2, ShieldCheck } from 'lucide-react';

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
    removeIntention
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
      try {
        navigator.vibrate([15]);
      } catch (e) {}
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

  const mysteryGroup = ROSARY_MYSTERIES[activeMysteryType || 'gloriosos'];

  return (
    <PageContainer>
      {/* Header */}
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge={t('mysteryBadge')}
        icon={<Sparkles className="w-4 h-4" />}
      />

      {/* Mystery Selector Bar */}
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
              <Sparkles className={`w-4 h-4 ${isCurrent ? 'animate-spin' : 'opacity-60'}`} />
              <span>{group.titlePt.split('(')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Completion Banner if Rosary Finished */}
      {isCompleted ? (
        <EditorialCard variant="accent" className="p-8 text-center flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-sacred-gold text-white flex items-center justify-center text-3xl shadow-lg">
            ✝
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t('completedBanner')}
          </h2>
          <p className="text-sm max-w-xl text-slate-700 dark:text-slate-200 font-medium">
            Sua fidelidade diária foi registrada. Que o Santo Rosário seja sempre sua arma espiritual e fonte de paz.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => submitCheckIn()}
              className="px-6 py-3.5 rounded-xl bg-sacred-gold hover:bg-sacred-gold-light text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{t('btnComplete')}</span>
            </button>
            <button
              onClick={() => initRosary(activeMysteryType)}
              className="px-5 py-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reiniciar Terço</span>
            </button>
          </div>
        </EditorialCard>
      ) : (
        /* Active Step Sequence UI */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Prayer Card (2 cols) */}
          <EditorialCard className="lg:col-span-2 flex flex-col justify-between gap-8 p-6 sm:p-8 min-h-[520px] border-slate-200 dark:border-slate-700">
            
            {/* Step Top Metadata */}
            <div className="flex flex-col gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-sacred-gold">
                  Passo {currentStep.stepNumber} de {totalSteps}
                </span>
                {currentStep.latinText && (
                  <button
                    onClick={() => setShowLatin(!showLatin)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      showLatin ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-sacred-gold'
                    }`}
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{showLatin ? 'Latim (Tradicional)' : 'Ver em Latim'}</span>
                  </button>
                )}
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
                {currentStep.titlePt}
              </h2>
            </div>

            {/* Prayer Content & Scripture Display */}
            <div className="flex-grow flex flex-col justify-center gap-6 my-4">
              {showLatin && currentStep.latinText ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30 font-serif italic text-base sm:text-lg text-purple-900 dark:text-purple-200 leading-relaxed whitespace-pre-line font-medium">
                  {currentStep.latinText}
                </div>
              ) : null}

              <div className="font-serif text-lg sm:text-xl text-slate-900 dark:text-white leading-relaxed whitespace-pre-line font-medium">
                {currentStep.prayerTextPt}
              </div>

              {/* Mystery Contemplation Card if inside decade */}
              {currentStep.mystery && currentStep.type !== 'mystery_intro' && (
                <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col gap-1 text-xs sm:text-sm">
                  <span className="font-bold text-sacred-gold uppercase">Meditação do {currentStep.decadeNumber}º Mistério:</span>
                  <span className="font-serif italic text-sm sm:text-base text-slate-800 dark:text-slate-200 font-medium">
                    {currentStep.mystery.namePt}
                  </span>
                  <span className="text-slate-600 dark:text-slate-300 mt-1 font-semibold">🙏 Fruto: {currentStep.mystery.fruitPt}</span>
                </div>
              )}
            </div>

            {/* Bead Map Component during decade Hail Marys */}
            {currentStep.type === 'decade_hail_mary' && (
              <BeadMap
                currentBeadInDecade={currentStep.beadInDecade}
                totalBeads={10}
              />
            )}

            {/* Navigation Strip */}
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
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-sacred-gold hover:bg-sacred-gold-light text-white font-bold text-sm sm:text-base shadow-md gold-glow transition-all hover:scale-105"
              >
                <span>{currentStepIndex + 1 === totalSteps ? 'Concluir Terço ✝' : t('btnNextBead')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </EditorialCard>

          {/* Sidebar: Intentions & Quick Jump (1 col) */}
          <div className="flex flex-col gap-6">
            
            {/* Intentions Drawer */}
            <EditorialCard className="flex flex-col gap-4 p-5 border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                <ShieldCheck className="w-5 h-5 text-sacred-gold" />
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">Suas Intenções Pessoais</h3>
              </div>
              
              {/* Intentions List */}
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                {intentions.length === 0 ? (
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic font-medium">
                    Nenhuma intenção adicionada. Coloque as intenções de sua família e conversão antes de rezar.
                  </p>
                ) : (
                  intentions.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200"
                    >
                      <span className="truncate">🙏 {item}</span>
                      <button
                        onClick={() => removeIntention(idx)}
                        className="text-red-500 hover:text-red-700 font-extrabold px-1 text-sm"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add Intention Form */}
              <form onSubmit={handleAddIntention} className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  value={newIntention}
                  onChange={(e) => setNewIntention(e.target.value)}
                  placeholder="Adicionar intenção..."
                  className="flex-grow text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:border-sacred-gold font-medium"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2.5 rounded-xl bg-sacred-gold text-white text-xs font-extrabold hover:bg-sacred-gold-light"
                >
                  +
                </button>
              </form>
            </EditorialCard>

            {/* Quick Step Jump List */}
            <EditorialCard className="flex flex-col gap-3 p-5 border-slate-200 dark:border-slate-700">
              <h3 className="font-serif font-bold text-sm border-b border-slate-200 dark:border-slate-700 pb-2 text-slate-900 dark:text-white">
                Navegação Rápida do Terço
              </h3>
              <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1">
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
