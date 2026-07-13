'use client';

import React from 'react';
import { Check } from 'lucide-react';

interface BeadMapProps {
  currentBeadInDecade?: number; // 1 to 10 (or undefined if intro step)
  totalBeads?: number;
  onBeadClick?: (beadNumber: number) => void;
}

export function BeadMap({ currentBeadInDecade = 0, totalBeads = 10, onBeadClick }: BeadMapProps) {
  // We display 10 beads in an arch/circle representing the Hail Mary decade
  const beads = Array.from({ length: totalBeads }, (_, i) => i + 1);

  return (
    <div className="flex flex-col items-center gap-4 py-6 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between w-full max-w-sm px-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
        <span>Início da Dezena (1ª Ave Maria)</span>
        <span>Conclusão (10ª)</span>
      </div>

      {/* Bead Grid / Crown */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-w-md py-2">
        {beads.map((beadNum) => {
          const isCompleted = currentBeadInDecade > beadNum;
          const isActive = currentBeadInDecade === beadNum;

          return (
            <button
              key={beadNum}
              onClick={() => onBeadClick?.(beadNum)}
              disabled={!onBeadClick}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                isActive
                  ? 'bead-active text-white scale-110 sm:scale-125 z-10 animate-pulse'
                  : isCompleted
                  ? 'bg-sacred-gold text-white border-2 border-amber-300 shadow-sm'
                  : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border-2 border-slate-300 dark:border-slate-600 hover:border-sacred-gold'
              }`}
              title={`Conta ${beadNum} — Ave Maria`}
            >
              {isCompleted ? <Check className="w-5 h-5 text-white stroke-[3]" /> : beadNum}
            </button>
          );
        })}
      </div>

      <div className="text-center text-xs text-slate-600 dark:text-slate-300 font-medium">
        {currentBeadInDecade > 0 ? (
          <span className="text-sacred-gold font-bold text-sm">
            Rezando a {currentBeadInDecade}ª Ave Maria deste Mistério
          </span>
        ) : (
          <span>Pressione o botão de avanço para meditar a dezena</span>
        )}
      </div>
    </div>
  );
}
