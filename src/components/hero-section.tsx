"use client";

import { useState } from "react";
import { Sparkles, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTodayStatus } from "@/hooks/use-rosary";
import { CheckInModal } from "./check-in-modal";
import { StreakCounter } from "./streak-counter";
import { useAuth } from "@/providers/auth-provider";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function HeroSection() {
  const t = useTranslations("Hero");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: status } = useTodayStatus();
  const { openAuthModal } = useAuth();

  const hasPrayed = status?.hasPrayed ?? false;

  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
      {/* Background - Light Mode */}
      <div className="absolute inset-0 bg-sacred-cream dark:hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(212,175,55,0.1)_0%,transparent_40%)]" />
        <div className="absolute inset-0 opacity-30 noise-overlay" />
      </div>

      {/* Background - Dark Mode */}
      <div className="absolute inset-0 hidden dark:block bg-gradient-to-b from-slate-950 via-sacred-blue to-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,55,0.12)_0%,transparent_50%)]" />
        {/* Stars effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[15%] left-[20%] w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-20" />
          <div className="absolute top-[25%] right-[25%] w-1 h-1 bg-gold-200 rounded-full animate-pulse opacity-30" style={{ animationDelay: "1s" }} />
          <div className="absolute top-[40%] left-[40%] w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-10" style={{ animationDelay: "2s" }} />
          <div className="absolute top-[60%] right-[15%] w-1 h-1 bg-gold-300 rounded-full animate-pulse opacity-25" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-[80%] left-[10%] w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-15" style={{ animationDelay: "0.5s" }} />
        </div>
      </div>

      {/* Decorative cross pattern */}
      <div className="absolute top-10 left-10 text-gold-500/10 dark:text-gold-400/5 text-[200px] font-serif select-none pointer-events-none">✝</div>
      <div className="absolute bottom-10 right-10 text-gold-500/10 dark:text-gold-400/5 text-[150px] font-serif select-none pointer-events-none rotate-12">✝</div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {status?.stats && status.stats.totalCheckIns > 0 && (
          <div className="mb-8 animate-fade-up opacity-0" style={{ animationDelay: "100ms" }}>
            <StreakCounter stats={status.stats} />
          </div>
        )}

        <div className="mb-8 sm:mb-10 relative inline-block animate-fade-up opacity-0" style={{ animationDelay: "200ms" }}>
          <div 
            className={`w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center shadow-2xl border-2 border-gold-500/30 dark:border-gold-400/40 transition-all duration-500 ${
              hasPrayed 
                ? "bg-gradient-to-br from-gold-500 to-gold-600 animate-pulse-gold" 
                : "bg-gradient-to-br from-sacred-blue to-slate-800 dark:from-slate-800 dark:to-slate-900"
            }`}
          >
            {hasPrayed ? (
              <Check className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-white" strokeWidth={2.5} />
            ) : (
              <span className="text-5xl sm:text-6xl md:text-7xl">📿</span>
            )}
          </div>
          {hasPrayed && <Sparkles className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 text-gold-500 animate-pulse" />}
        </div>

        <h1 className="animate-fade-up opacity-0" style={{ animationDelay: "300ms" }}>
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-cinzel font-bold bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 bg-clip-text text-transparent mb-4">
            {t("title")}
          </span>
          <span className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-cinzel font-semibold text-sacred-blue dark:text-white">
            {t("subtitle")}
          </span>
        </h1>

        <p className="mt-6 sm:mt-8 text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-manrope animate-fade-up opacity-0" style={{ animationDelay: "400ms" }}>
          {hasPrayed ? t("hasPrayed") : t("notPrayed")}
        </p>

        <div className="mt-12 sm:mt-14 animate-fade-up opacity-0" style={{ animationDelay: "500ms" }}>
          {hasPrayed ? (
            <div className="flex flex-col items-center gap-6">
              <div className="inline-flex items-center gap-3 px-8 py-4 glass rounded-full border border-green-500/30 dark:border-green-400/30 bg-green-500/5">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" strokeWidth={3} />
                </div>
                <span className="font-cinzel font-bold text-green-700 dark:text-green-400 text-lg">
                  {t("completed")}
                </span>
              </div>
              <Button
                size="lg"
                onClick={() => {
                  const element = document.getElementById("witness");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 px-8 py-6 font-cinzel text-lg font-bold text-slate-800 dark:text-white transition-all duration-300"
              >
                {t("discoverMore")}
              </Button>
            </div>
          ) : (
            <Button
              size="lg"
              onClick={() => {
                const element = document.getElementById("witness");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-10 py-7 font-cinzel text-xl font-bold tracking-wide text-sacred-blue transition-all duration-300 hover:shadow-gold-glow-lg"
            >
              {t("startMission")}
            </Button>
          )}
        </div>

        <div className="mt-16 sm:mt-20 animate-bounce">
          <button 
            onClick={() => {
              const element = document.getElementById("community");
              if (element) element.scrollIntoView({ behavior: "smooth" });
            }}
            className="inline-flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500 hover:text-gold-500 dark:hover:text-gold-400 transition-colors"
          >
            <span className="text-sm font-medium tracking-wide uppercase">{t("discoverMore")}</span>
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>

      <CheckInModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </section>
  );
}
