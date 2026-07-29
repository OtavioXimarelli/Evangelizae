'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { PageContainer } from '@/components/ui/PageContainer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { EditorialCard } from '@/components/ui/EditorialCard';
import { GoldFiligreeDivider, SacredScriptureEmblem } from '@/components/ui/SacredEmblems';
import { BookOpen, Sparkles, ShieldCheck, ZoomIn, ZoomOut, Maximize2, RefreshCw, WifiOff } from 'lucide-react';
import { getDailyLiturgy, clearLiturgyCache, DailyLiturgyData, LiturgicalColor } from '@/services/liturgyService';

// Liturgical color → warm visual accent mapping
const COLOR_ACCENTS: Record<LiturgicalColor, { ring: string; badge: string; label: string }> = {
  green:  { ring: 'border-emerald-500/40', badge: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30', label: '🟢' },
  purple: { ring: 'border-purple-500/40',  badge: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30', label: '🟣' },
  white:  { ring: 'border-amber-300/60',   badge: 'bg-amber-300/15 text-amber-700 dark:text-amber-300 border-amber-300/40', label: '⚪' },
  red:    { ring: 'border-red-500/40',     badge: 'bg-red-500/15 text-red-700 dark:text-red-300 border-red-500/30', label: '🔴' },
  rose:   { ring: 'border-pink-400/40',   badge: 'bg-pink-400/15 text-pink-700 dark:text-pink-300 border-pink-400/30', label: '🌸' },
};

export default function LiturgyPage() {
  const t = useTranslations('Liturgy');
  const [activeTab, setActiveTab] = React.useState<'first' | 'psalm' | 'second' | 'gospel'>('gospel');
  const [fontSize, setFontSize] = React.useState<'normal' | 'large' | 'xl'>('large');
  const [liturgy, setLiturgy] = React.useState<DailyLiturgyData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    clearLiturgyCache();
    try {
      const data = await getDailyLiturgy();
      setLiturgy(data);
      if (!data.gospel?.text && data.firstReading?.text) {
        setActiveTab('first');
      }
    } catch { /* safety net */ } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial data load — runs only once on mount
  React.useEffect(() => {
    let cancelled = false;
    getDailyLiturgy().then((data) => {
      if (cancelled) return;
      setLiturgy(data);
      setIsLoading(false);
      if (!data.gospel?.text && data.firstReading?.text) {
        setActiveTab('first');
      }
    }).catch(() => {
      if (!cancelled) setIsLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const fontSizes = {
    normal: 'text-base leading-relaxed',
    large: 'text-lg sm:text-xl leading-relaxed sm:leading-loose',
    xl: 'text-xl sm:text-2xl leading-loose',
  };

  // Determine which tabs are available
  const tabs = React.useMemo(() => {
    if (!liturgy) return [];
    return [
      { id: 'first' as const,  label: t('tabFirstReading'),  available: !!liturgy.firstReading?.text },
      { id: 'psalm' as const,  label: t('tabPsalm'),         available: !!liturgy.psalm?.text },
      { id: 'second' as const, label: t('tabSecondReading'), available: !!liturgy.secondReading?.text },
      { id: 'gospel' as const, label: t('tabGospel'),        available: !!liturgy.gospel?.text, isGospel: true },
    ].filter((tab) => tab.available);
  }, [liturgy, t]);

  const currentReading = React.useMemo(() => {
    if (!liturgy) return null;
    if (activeTab === 'first')  return { title: liturgy.firstReading.title, ref: liturgy.firstReading.ref, text: liturgy.firstReading.text };
    if (activeTab === 'psalm')  return { title: liturgy.psalm.title, ref: liturgy.psalm.ref, text: `${liturgy.psalm.response ? `R. ${liturgy.psalm.response}\n\n` : ''}${liturgy.psalm.text}` };
    if (activeTab === 'second' && liturgy.secondReading) return { title: liturgy.secondReading.title, ref: liturgy.secondReading.ref, text: liturgy.secondReading.text };
    if (activeTab === 'gospel') return { title: liturgy.gospel.title, ref: liturgy.gospel.ref, text: liturgy.gospel.text };
    return null;
  }, [liturgy, activeTab]);

  const colorAccent = liturgy ? (COLOR_ACCENTS[liturgy.color] ?? COLOR_ACCENTS.green) : COLOR_ACCENTS.green;

  return (
    <PageContainer>
      {/* Header */}
      <SectionHeader
        title={t('title')}
        subtitle={t('subtitle')}
        badge={liturgy ? `${liturgy.colorLabel}` : t('liturgyBadge')}
        icon={<BookOpen className="w-4 h-4" />}
        rightAction={
          <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1.5 rounded-xl shadow-xs">
            <button
              onClick={() => setFontSize('normal')}
              className={`p-1.5 rounded-lg text-xs font-bold ${fontSize === 'normal' ? 'bg-sacred-gold text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              title="Fonte normal"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`p-1.5 rounded-lg text-xs font-bold ${fontSize === 'large' ? 'bg-sacred-gold text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              title="Fonte grande"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setFontSize('xl')}
              className={`p-1.5 rounded-lg text-xs font-bold ${fontSize === 'xl' ? 'bg-sacred-gold text-white shadow-xs' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              title="Fonte extra-grande"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-slate-300 dark:bg-slate-600 mx-0.5" />
            <button
              onClick={() => handleRefresh()}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-40"
              title="Atualizar liturgia"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        }
      />

      {/* Offline / Fallback notice */}
      {liturgy?.isOfflineFallback && (
        <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 font-medium">
          <WifiOff className="w-4 h-4 flex-shrink-0" />
          <span>{t('offlineFallbackNotice')}</span>
          <button
            onClick={() => handleRefresh()}
            className="ml-auto text-sacred-gold font-bold hover:underline"
          >
            {t('retryFetch')}
          </button>
        </div>
      )}

      {/* Saint of the Day Banner */}
      {liturgy && (liturgy.saintName && liturgy.saintName !== 'Santo do Dia') && (
        <EditorialCard variant="liturgical" className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-start gap-3 flex-grow">
            <SacredScriptureEmblem className="w-8 h-8 text-white/80 flex-shrink-0 mt-0.5" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                ✝ {t('saintOfDayLabel')}
              </span>
              <span className="font-serif text-lg font-bold text-white">
                {liturgy.saintName}
              </span>
              {liturgy.saintTitle && (
                <span className="text-xs text-white/80 font-medium">{liturgy.saintTitle}</span>
              )}
              {liturgy.saintQuote && (
                <p className="font-serif italic text-sm text-white/90 mt-1">{liturgy.saintQuote}</p>
              )}
            </div>
          </div>
          <span className={`self-start sm:self-auto text-xs font-bold px-3 py-1.5 rounded-full border ${colorAccent.badge}`}>
            {colorAccent.label} {liturgy.colorLabel}
          </span>
        </EditorialCard>
      )}

      {/* Tabs */}
      {isLoading ? (
        <div className="flex flex-wrap items-center gap-2.5 pb-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-28 rounded-xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-3">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? tab.isGospel
                      ? 'bg-sacred-gold text-white shadow-md scale-105'
                      : 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-sacred-gold border border-slate-300 dark:border-slate-700'
                }`}
              >
                {tab.isGospel && <Sparkles className="w-4 h-4" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Reading Card */}
      {isLoading ? (
        <EditorialCard className="p-6 sm:p-10 flex flex-col gap-6 min-h-[440px] border-slate-200 dark:border-slate-700 animate-pulse">
          <div className="h-8 w-3/4 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-1/4 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="flex flex-col gap-3 mt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`h-4 rounded-xl bg-slate-200 dark:bg-slate-800 ${i === 5 ? 'w-2/3' : 'w-full'}`} />
            ))}
          </div>
        </EditorialCard>
      ) : currentReading ? (
        <EditorialCard className={`p-6 sm:p-10 flex flex-col gap-6 min-h-[440px] border-2 ${colorAccent.ring}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-700 pb-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {currentReading.title}
            </h2>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-sacred-gold/15 text-sacred-gold self-start sm:self-auto border border-sacred-gold/30 font-serif">
              ✝ {currentReading.ref}
            </span>
          </div>

          {/* Scripture Text */}
          <div className={`font-serif text-slate-900 dark:text-white whitespace-pre-line py-4 font-medium ${fontSizes[fontSize]}`}>
            {currentReading.text}
          </div>
        </EditorialCard>
      ) : null}

      <GoldFiligreeDivider />

      {/* Theological Reflection Card */}
      <EditorialCard variant="accent" className="p-6 sm:p-8 flex flex-col gap-4 border-2 border-amber-500/40">
        <div className="flex items-center gap-2 text-sacred-gold">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="font-serif text-xl font-bold text-slate-900 dark:text-white">
            {t('reflectionTitle')}
          </h3>
        </div>
        <p className="font-serif italic text-sm sm:text-base leading-relaxed text-slate-800 dark:text-slate-200 font-medium">
          {t('reflectionContent')}
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 pt-3 border-t border-sacred-gold/30 font-medium">
          <span>{t('sourceLabel')}</span>
          <span className="font-bold text-sacred-gold">{t('sourceValue')}</span>
        </div>
      </EditorialCard>
    </PageContainer>
  );
}
