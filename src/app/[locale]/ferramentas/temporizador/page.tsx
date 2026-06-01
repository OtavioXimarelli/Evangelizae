"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import { PageTransition } from "@/components/page-transition";
import { PageHeader } from "@/components/page-header";
import { useTimer } from "@/hooks/use-timer";
import { Play, Pause, RotateCcw, Monitor, Timer as TimerIcon, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const QUICK_MINUTES = [5, 10, 15, 20, 30];

// Format ms to MM:SS
const formatTime = (ms: number) => {
  if (ms < 0) ms = 0;
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export default function TemporizadorPage() {
  const t = useTranslations("Temporizador");
  const [selectedMinutes, setSelectedMinutes] = useState(15);
  const { remainingMs, isRunning, start, pause, reset, duration } = useTimer(selectedMinutes * 60 * 1000);
  const [wakeLockActive, setWakeLockActive] = useState(false);
  const wakeLockRef = useRef<any>(null);

  // Screen WakeLock logic
  const requestWakeLock = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && "wakeLock" in navigator && isRunning) {
        wakeLockRef.current = await (navigator as any).wakeLock.request("screen");
        setWakeLockActive(true);
      }
    } catch {
      setWakeLockActive(false);
    }
  }, [isRunning]);

  useEffect(() => {
    if (isRunning) {
      requestWakeLock();
    } else {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().then(() => setWakeLockActive(false)).catch(() => {});
        wakeLockRef.current = null;
      }
    }
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release().catch(() => {});
        wakeLockRef.current = null;
      }
    };
  }, [isRunning, requestWakeLock]);

  // Audio Chime logic
  const prevRunningRef = useRef(false);
  useEffect(() => {
    // If it was running, and now is not running, and remaining time is 0 => finished
    if (prevRunningRef.current && !isRunning && remainingMs === 0) {
      try {
        if (typeof window !== "undefined" && window.Audio) {
          const audio = new window.Audio("/sounds/chime.mp3");
          audio.play().catch(() => {
            // If browser blocks audio or file is missing, fallback to vibration if available
            if (typeof navigator !== "undefined" && "vibrate" in navigator) {
              navigator.vibrate([200, 100, 200, 100, 500]);
            }
          });
        } else if (typeof navigator !== "undefined" && "vibrate" in navigator) {
          navigator.vibrate([200, 100, 200, 100, 500]);
        }
      } catch (err) {}
    }
    prevRunningRef.current = isRunning;
  }, [isRunning, remainingMs]);

  // Handle Quick Select
  const handleSelectMinutes = (mins: number) => {
    setSelectedMinutes(mins);
    reset(mins * 60 * 1000);
  };

  const progressPercent = duration > 0 ? ((duration - remainingMs) / duration) * 100 : 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background pb-24">
        <PageHeader title={t("title")} subtitle={t("subtitle")} icon="⏳" />

        <main className="max-w-3xl mx-auto px-4 sm:px-6 mt-8 flex flex-col items-center justify-center min-h-[60vh]">
          
          {/* Status Bar */}
          <div className="flex items-center justify-center gap-3 mb-8 w-full">
            <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border transition-colors ${wakeLockActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30" : "bg-muted text-muted-foreground border-transparent"}`}>
               <Monitor className="w-3.5 h-3.5" />
               <span>{wakeLockActive ? t("screenActive") : t("screenNormal")}</span>
            </div>
          </div>

          {/* Timer Display */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center mb-10 group">
            {/* Background glowing ring */}
            <div className={`absolute inset-0 rounded-full blur-[80px] transition-opacity duration-1000 ${isRunning ? "bg-primary/20 opacity-100" : "bg-primary/5 opacity-50"}`} />
            
            {/* SVG Progress Ring */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
               {/* Background Track */}
               <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted/30" />
               {/* Progress indicator */}
               <circle 
                 cx="50" cy="50" r="45" 
                 fill="none" 
                 stroke="url(#timerGradient)" 
                 strokeWidth="4" 
                 strokeLinecap="round"
                 strokeDasharray="283"
                 strokeDashoffset={283 - ( progressPercent / 100 ) * 283}
                 className="transition-all duration-1000 ease-linear"
               />
               <defs>
                 <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="hsl(var(--primary))" />
                   <stop offset="100%" stopColor="hsl(var(--gold-dark))" />
                 </linearGradient>
               </defs>
            </svg>

            <div className="relative z-10 flex flex-col items-center justify-center text-center">
               <span className="text-5xl sm:text-7xl font-cinzel font-bold text-foreground tracking-widest font-variant-numeric tabular-nums leading-none mb-3 drop-shadow-sm">
                 {formatTime(remainingMs)}
               </span>
               <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold flex items-center gap-2">
                  <TimerIcon className="w-3.5 h-3.5 text-primary" /> {t("meditation")}
               </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-6 mb-12">
             <button 
               onClick={() => reset()} 
               className="w-14 h-14 rounded-full flex items-center justify-center border border-primary/20 bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-all hover:-translate-y-1 shadow-sm"
               title={t("restart")}
             >
                <RotateCcw className="w-6 h-6" />
             </button>

             <button 
               onClick={isRunning ? pause : start}
               disabled={remainingMs === 0}
               className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-gold-glow transition-all hover:scale-105 active:scale-95 ${remainingMs === 0 ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-gradient-to-br from-primary to-gold-dark text-primary-foreground"}`}
             >
                {isRunning ? <Pause className="w-8 h-8 sm:w-10 sm:h-10 fill-current" /> : <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-2" />}
             </button>

             <button 
               onClick={() => {
                  generateQuickPillAnimation();
               }}
               className="w-14 h-14 rounded-full flex items-center justify-center border border-primary/20 bg-card text-muted-foreground hover:text-primary hover:border-primary/40 transition-all hover:-translate-y-1 shadow-sm"
               title={t("options")}
             >
                <Settings2 className="w-6 h-6" />
             </button>
          </div>

          {/* Quick Select */}
          <div className="w-full max-w-sm animate-fade-up">
            <h3 className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">{t("chooseDuration")}</h3>
            <div className="flex flex-wrap justify-center gap-4">
               {QUICK_MINUTES.map(mins => (
                 <button
                   key={mins}
                   onClick={() => handleSelectMinutes(mins)}
                   className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${selectedMinutes === mins ? "bg-primary/15 text-primary border-2 border-primary/40 shadow-sm" : "bg-card border border-primary/10 text-foreground hover:border-primary/30"}`}
                 >
                   {mins} {t("min")}
                 </button>
               ))}
            </div>
          </div>

        </main>
      </div>
    </PageTransition>
  );

  function generateQuickPillAnimation() {
    // Just a stub for UI flair
  }
}
