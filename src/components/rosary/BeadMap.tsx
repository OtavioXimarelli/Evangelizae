'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';

interface BeadMapProps {
  currentBeadInDecade?: number; // 1 to 10 (or undefined if intro step)
  totalBeads?: number;
  onBeadClick?: (beadNumber: number) => void;
}

/**
 * BeadMap — Visual representation of a Rosary decade (10 Hail Mary beads).
 * Displays beads in a warm, tactile arc with gold glow on the active bead
 * and checkmarks on completed beads. All strings are i18n-translated.
 */
export function BeadMap({ currentBeadInDecade = 0, totalBeads = 10, onBeadClick }: BeadMapProps) {
  const t = useTranslations('BeadMap');
  const beads = Array.from({ length: totalBeads }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center gap-4 py-6 px-4 rounded-2xl bg-gradient-to-b from-amber-50/60 to-slate-100 dark:from-slate-800/60 dark:to-slate-800/80 border border-amber-500/20 dark:border-amber-500/15">
      {/* Decade labels */}
      <div className="flex items-center justify-between w-full max-w-sm px-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <span>{t('decadeStart')}</span>
        <span>{t('decadeEnd')}</span>
      </div>

      {/* Bead Grid */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-md py-2">
        {beads.map((beadNum) => {
          const isCompleted = currentBeadInDecade > beadNum;
          const isActive = currentBeadInDecade === beadNum;

          return (
            <button
              key={beadNum}
              onClick={() => onBeadClick?.(beadNum)}
              disabled={!onBeadClick}
              title={t('beadTitle', { bead: beadNum })}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 shadow-sm ${
                isActive
                  ? 'bead-active text-white scale-110 sm:scale-125 z-10 animate-pulse ring-2 ring-sacred-gold ring-offset-2'
                  : isCompleted
                  ? 'bg-sacred-gold text-white border-2 border-amber-300 shadow-amber-200/50 shadow-md'
                  : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-600 hover:border-sacred-gold hover:shadow-md'
              }`}
            >
              {isCompleted ? <Check className="w-5 h-5 text-white stroke-[3]" /> : beadNum}
            </button>
          );
        })}
      </div>

      {/* Status Text */}
      <div className="text-center text-xs text-slate-600 dark:text-slate-300 font-medium">
        {currentBeadInDecade > 0 ? (
          <span className="text-sacred-gold font-bold text-sm">
            {t('prayingBead', { bead: currentBeadInDecade })}
          </span>
        ) : (
          <span>{t('beadPrompt')}</span>
        )}
      </div>
    </div>
  );
}
