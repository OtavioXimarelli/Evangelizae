'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ShieldAlert, CheckCircle2, Bot, Sparkles, X, ArrowRight } from 'lucide-react';

export function PrototypeNoticeModal() {
  const t = useTranslations('Common');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('evangelizae-mvp-modal-seen');
      if (!seen) {
        // Show after a brief 400ms delay for maximum visual impact after page load
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 400);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('evangelizae-mvp-modal-seen', 'true');
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* Centering & scroll alignment wrapper */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-5 py-6">
        
        {/* Cathedral Masterpiece Glass Card: zero raw scrollbars, premium borders, and perfect balance */}
        <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 border border-sacred-gold/40 shadow-[0_0_50px_rgba(217,119,6,0.18)] overflow-hidden animate-scaleUp text-left flex flex-col my-auto">
          
          {/* Top Luminous Golden Ribbon */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-sacred-gold to-yellow-500 shrink-0 shadow-xs" />

          {/* Modal Header (Pinned at Top with Cathedral Glow) */}
          <div className="p-6 pb-4 flex items-start justify-between gap-4 shrink-0 border-b border-slate-800/80 bg-slate-900/95 sticky top-0 z-10 backdrop-blur-md">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-sacred-gold shrink-0 shadow-md gold-glow">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-sacred-gold bg-sacred-gold/10 border border-sacred-gold/25 px-2.5 py-0.5 rounded-full w-fit">
                  {t('mvpModalBadge')}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight mt-1">
                  {t('mvpModalTitle')}
                </h3>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="p-2.5 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 transition-all shrink-0 border border-slate-700/60"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body Content: ZERO raw scrollbars guaranteed via [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden */}
          <div className="px-6 py-4 flex flex-col gap-4 text-xs sm:text-sm text-slate-300 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex-1">
            <p className="font-serif italic text-sm sm:text-base font-medium text-slate-200 border-l-2 border-sacred-gold pl-3.5 py-1 leading-relaxed bg-slate-800/30 rounded-r-xl">
              &ldquo;{t('mvpModalIntro')}&rdquo;
            </p>

            {/* Card 1: Interactive Prototype Status */}
            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-100 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-white text-sm">
                    {t('mvpModalPoint1Title')}
                  </span>
                  <span className="text-xs sm:text-sm leading-relaxed text-slate-300">
                    {t('mvpModalPoint1Desc')}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: AI & Backend Mock Notice */}
            <div className="flex flex-col gap-2 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-100 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-sacred-gold shrink-0 mt-0.5">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-amber-200 text-sm flex items-center gap-1.5">
                    <span>{t('mvpModalPoint2Title')}</span>
                    <Sparkles className="w-3.5 h-3.5 text-sacred-gold shrink-0" />
                  </span>
                  <span className="text-xs sm:text-sm leading-relaxed text-slate-300 font-medium">
                    {t('mvpModalPoint2Desc')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Action (Pinned at Bottom with Glowing Cathedral Button) */}
          <div className="p-6 pt-4 flex items-center justify-end border-t border-slate-800/80 bg-slate-950/80 sticky bottom-0 z-10 shrink-0 backdrop-blur-md">
            <button
              onClick={handleDismiss}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl cathedral-gradient border border-sacred-gold/30 text-white font-bold text-sm shadow-lg hover:shadow-sacred-gold/25 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2.5 group cursor-pointer"
            >
              <span>{t('mvpModalBtn')}</span>
              <ArrowRight className="w-4 h-4 text-sacred-gold group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
