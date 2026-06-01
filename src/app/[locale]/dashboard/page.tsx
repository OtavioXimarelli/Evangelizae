"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "@/i18n/routing";
import {
  Flame, Trophy, Calendar, ArrowRight, Sparkles, Heart,
  BookOpen, Clock, CheckCircle2,
  Sun, Moon,
  GraduationCap, Compass, Library, Star, Cross, Users,
  PlayCircle, PenLine, Timer, MessageCircleHeart, Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  UserStats, CheckIn, getTodaysMystery, getMysteryInfo, MysteryType
} from "@/types";
import { ComingSoonModal } from "@/components/coming-soon-modal";
import { CheckInModal } from "@/components/check-in-modal";
import { PageTransition } from "@/components/page-transition";
import { useAuth } from "@/providers/auth-provider";
import { useTranslations, useLocale } from "next-intl";
import { getStoredStats, mockCheckIns } from '@/services/mockData';
import { useIsMounted } from "@/hooks/use-hydrated";
import { formatRelativeTime } from "@/lib/utils";
import { usePrayerStore } from "@/store/use-prayer-store";
import { MagicBentoEffects } from "@/components/magic-bento";

const mysteryColors: Record<MysteryType, { bg: string; text: string; gradient: string; icon: string }> = {
  joyful: {
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    gradient: "from-amber-500 to-yellow-500",
    icon: "☀️",
  },
  sorrowful: {
    bg: "bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    gradient: "from-purple-500 to-violet-500",
    icon: "✝️",
  },
  glorious: {
    bg: "bg-primary/10",
    text: "text-primary",
    gradient: "from-primary to-gold-dark",
    icon: "👑",
  },
  luminous: {
    bg: "bg-sky-500/10",
    text: "text-sky-600 dark:text-sky-400",
    gradient: "from-sky-500 to-blue-500",
    icon: "💧",
  },
};

// SVG Progress Ring component
function ProgressRing({ progress, size = 120, strokeWidth = 8 }: { progress: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-muted/30"
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="text-primary"
        stroke="url(#goldGradient)"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1s ease-out" }}
      />
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--gold-dark))" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const commonT = useTranslations("Common");
  const checkInT = useTranslations("CheckIn");
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const isMounted = useIsMounted();
  const dashboardRef = useRef<HTMLDivElement>(null);

  // Zustand store selectors
  const currentStreak = usePrayerStore((s) => s.currentStreak);
  const longestStreak = usePrayerStore((s) => s.longestStreak);
  const totalCheckIns = usePrayerStore((s) => s.totalCheckIns);
  const storeCheckIns = usePrayerStore((s) => s.checkIns);
  const getWeeklyProgress = usePrayerStore((s) => s.getWeeklyProgress);
  const getRecentActivity = usePrayerStore((s) => s.getRecentActivity);
  const hasCheckedInTodayFn = usePrayerStore((s) => s.hasCheckedInToday);
  const favoriteMysteries = usePrayerStore((s) => s.favoriteMysteries);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [comingSoonOpen, setComingSoonOpen] = useState(false);
  const [comingSoonFeature, setComingSoonFeature] = useState("");
  const [storageBannerDismissed, setStorageBannerDismissed] = useState(false);
  const [mvpAdviceDismissed, setMvpAdviceDismissed] = useState(false);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);
  const [savedSession, setSavedSession] = useState<{ step: number; total: number; percent: number } | null>(null);

  const todaysMystery = getTodaysMystery();
  const mysteryInfo = getMysteryInfo(todaysMystery);
  const mysteryStyle = mysteryColors[todaysMystery];
  const currentMysteryName = checkInT(`mysteries.${todaysMystery}.label`);

  useEffect(() => {
    const dismissed = localStorage.getItem("rosario-banner-dismissed");
    if (dismissed) setStorageBannerDismissed(true);

    const mvpDismissed = localStorage.getItem("rosario-mvp-advice-dismissed");
    if (mvpDismissed) setMvpAdviceDismissed(true);

    // Detect saved rosary guide session
    try {
      const saved = localStorage.getItem("rosary-guide-session");
      if (saved) {
        const session = JSON.parse(saved);
        const age = Date.now() - session.savedAt;
        if (age < 12 * 60 * 60 * 1000 && session.step > 0) {
          // Full rosary = 7 intro + 5*(1 mystery + 1 OF + 10 HM + 1 glory + 1 fatima) + 2 closing = 79 steps
          const totalSteps = 79;
          setSavedSession({
            step: session.step,
            total: totalSteps,
            percent: Math.round(((session.step + 1) / totalSteps) * 100),
          });
        }
      }
    } catch {}

    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = useCallback(() => {
    // Zustand auto-updates; no manual refresh needed
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return t("goodMorning");
    if (hour < 18) return t("goodAfternoon");
    return t("goodNight");
  };

  // Use store values (safe defaults for SSR)
  const hasCheckedInToday = isMounted ? hasCheckedInTodayFn() : false;
  const weeklyProgress = isMounted ? getWeeklyProgress() : 0;
  const recentActivity = isMounted ? getRecentActivity(5) : [];
  const favMystery = isMounted && favoriteMysteries.length > 0 ? favoriteMysteries[0] : null;
  const communityFeed = mockCheckIns.slice(0, 3);

  const checkInDateSet = useMemo(() => {
    if (!isMounted) return new Set<string>();
    return new Set(storeCheckIns.map((c) => new Date(c.date).toDateString()));
  }, [isMounted, storeCheckIns]);

  const getWeekDays = () => {
    const today = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push({
        date,
        dayName: new Intl.DateTimeFormat(locale === 'pt' ? "pt-BR" : "en-US", { weekday: "short" })
          .format(date)
          .slice(0, 3),
        dayNum: date.getDate(),
        isToday: date.toDateString() === today.toDateString(),
        hasCheckIn: checkInDateSet.has(date.toDateString()),
      });
    }
    return days;
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center animate-pulse-gold shadow-gold-glow">
            <span className="text-4xl">📿</span>
          </div>
          <div className="space-y-2">
            <p className="text-foreground font-cinzel font-bold text-lg">{commonT("loading")}</p>
            <div className="w-32 h-1 mx-auto rounded-full bg-muted overflow-hidden">
              <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div ref={dashboardRef} className="min-h-screen bg-background" data-testid="dashboard-page">
      <MagicBentoEffects containerRef={dashboardRef} glowColor="212, 175, 55" />

      <main className="pt-8 pb-24 md:pt-16 md:pb-32 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-10 md:space-y-14">

          {/* ─── Banners ─── */}
          <div className="flex flex-col gap-3">
            {!storageBannerDismissed && (
              <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 animate-fade-up" data-magic-bento>
                <span className="text-lg flex-shrink-0">⚠️</span>
                <p className="text-sm leading-relaxed flex-1">{t("storageDisclaimer")}</p>
                <button onClick={() => { localStorage.setItem("rosario-banner-dismissed", "1"); setStorageBannerDismissed(true); }} className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-200 font-bold text-xl leading-none flex-shrink-0 transition-colors h-8 w-8 flex items-center justify-center">×</button>
              </div>
            )}
            {!mvpAdviceDismissed && (
              <div className="flex items-start gap-3 px-5 py-4 rounded-2xl bg-primary/10 border border-primary/20 text-secondary dark:text-primary animate-fade-up" data-magic-bento>
                <span className="text-lg flex-shrink-0">✨</span>
                <p className="text-sm leading-relaxed flex-1 italic">{t("mvpAdvice")}</p>
                <button onClick={() => { localStorage.setItem("rosario-mvp-advice-dismissed", "1"); setMvpAdviceDismissed(true); }} className="text-primary hover:text-gold-dark font-bold text-xl leading-none flex-shrink-0 transition-colors h-8 w-8 flex items-center justify-center">×</button>
              </div>
            )}
          </div>

          {/* ─── Header ─── */}
          <header className="animate-fade-up">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-card border border-border mb-6 sm:mb-8 shadow-sm">
              <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-gold-dark shadow-gold-glow">
                {currentTime.getHours() < 18 ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />}
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest text-muted-foreground font-bold mb-0.5">
                  {new Intl.DateTimeFormat(locale === 'pt' ? "pt-BR" : "en-US", { weekday: "long" }).format(currentTime)}
                </span>
                <span className="text-sm sm:text-base font-cinzel font-bold text-foreground capitalize">
                  {new Intl.DateTimeFormat(locale === 'pt' ? "pt-BR" : "en-US", { day: "numeric", month: "long", year: "numeric" }).format(currentTime)}
                </span>
              </div>
              <div className="hidden sm:block w-px h-8 bg-border/50 mx-1" />
              <span className="hidden sm:inline-flex items-center gap-2 text-xs text-muted-foreground font-medium">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>{t("mystery.label", { name: currentMysteryName })}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-foreground leading-tight tracking-tight">
              {getGreeting()},{" "}
              <span className="bg-gradient-to-r from-primary to-gold-dark bg-clip-text text-transparent">
                {user?.name ?? t("greeting")}
              </span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              {hasCheckedInToday ? t("hasCheckedIn") : t("notCheckedIn")}
            </p>

            {/* Hourly Saint Quote — integrated with header */}
            <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-card border border-border/40 shadow-sm relative overflow-hidden max-w-2xl" data-magic-bento>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm sm:text-base text-foreground/90 italic leading-relaxed font-manrope">
                    &ldquo;{t(`saintQuotes.${currentTime.getHours()}.text`)}&rdquo;
                  </p>
                  <p className="mt-2 text-xs text-primary font-bold uppercase tracking-widest">
                    — {t(`saintQuotes.${currentTime.getHours()}.author`)}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* ─── Continue Session Card ─── */}
          {savedSession && (
            <section className="animate-fade-up animate-delay-50">
              <button
                onClick={() => router.push("/ferramentas/guia-interativo" as any)}
                className="w-full group relative rounded-2xl overflow-hidden bg-gradient-to-r from-amber-500/10 to-primary/10 border border-primary/20 hover:border-primary/40 p-6 sm:p-8 text-left transition-all duration-300 hover:-translate-y-0.5 hover:shadow-gold-glow"
                data-testid="continue-session"
                data-magic-bento
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-lg flex-shrink-0 animate-pulse-gold">
                    <PlayCircle className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-cinzel font-bold text-foreground text-lg mb-1 group-hover:text-primary transition-colors">
                      {t("continueSession.title")}
                    </h3>
                    <p className="text-sm text-muted-foreground">{t("continueSession.desc")}</p>
                  </div>
                  <div className="hidden sm:flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-sm font-bold text-primary">
                      {t("continueSession.progress", { percent: savedSession.percent })}
                    </span>
                    <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-gold-dark transition-all" style={{ width: `${savedSession.percent}%` }} />
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform flex-shrink-0" />
                </div>
              </button>
            </section>
          )}

          {/* ─── Stats Row ─── */}
          <section className="animate-fade-up animate-delay-100">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6">
              {[
                { icon: Flame, value: currentStreak, label: t("stats.currentStreak"), gradient: "from-orange-500 to-red-500", badge: currentStreak >= 7 ? t("fire") : null, badgeColor: "bg-orange-500/20 text-orange-600 dark:text-orange-400" },
                { icon: Trophy, value: longestStreak, label: t("stats.longestStreak"), gradient: "from-primary to-gold-dark" },
                                { icon: Heart, value: totalCheckIns, label: t("stats.totalPrayers"), gradient: "from-secondary to-secondary/80 dark:from-muted dark:to-muted/80", iconClass: "text-primary" },
                { icon: Star, value: `${weeklyProgress}/7`, label: t("stats.thisWeek"), gradient: "from-emerald-500 to-green-600" },
              ].map((stat) => (
                <div key={stat.label} className="group p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 shadow-sm" data-magic-bento>
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className={`w-6 h-6 ${stat.iconClass ?? "text-primary-foreground"}`} />
                    </div>
                    {stat.badge && <span className={`text-xs px-3 py-1 rounded-full font-bold ${stat.badgeColor}`}>{stat.badge}</span>}
                  </div>
                  <p className="text-3xl lg:text-4xl font-cinzel font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
              {/* Favorite Mystery Card */}
              <div className="group p-6 lg:p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 col-span-2 md:col-span-1 shadow-sm" data-testid="favorite-mystery" data-magic-bento>
                <div className="flex items-start justify-between mb-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${favMystery ? mysteryColors[favMystery].gradient : "from-slate-400 to-slate-500"} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-xl">{favMystery ? mysteryColors[favMystery].icon : "📿"}</span>
                  </div>
                </div>
                <p className="text-2xl lg:text-3xl font-cinzel font-bold text-foreground mb-1">
                  {favMystery ? checkInT(`mysteries.${favMystery}.label`) : "—"}
                </p>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("favoriteMystery.label")}</p>
              </div>
            </div>
          </section>

          {/* ─── Mystery CTA ─── */}
          <section className="animate-fade-up animate-delay-200">
            <div className={`relative rounded-2xl overflow-hidden ${hasCheckedInToday ? "bg-emerald-700/90 dark:bg-emerald-800/90" : "bg-secondary dark:bg-card"}`} data-magic-bento>
              <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10 p-8 sm:p-12 lg:p-16">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
                  <div className="flex-1 min-w-0 max-w-2xl">
                    <div className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full ${mysteryStyle.bg} border border-white/10 dark:border-white/10 mb-6`}>
                      <Sparkles className={`w-4 h-4 ${mysteryStyle.text}`} />
                      <span className={`text-sm font-bold uppercase tracking-widest ${mysteryStyle.text}`}>{t("mystery.label", { name: currentMysteryName })}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-cinzel font-bold text-white mb-4 leading-tight">{hasCheckedInToday ? t("mystery.completed") : t("mystery.today")}</h2>
                    <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-xl">{hasCheckedInToday ? t("mystery.completedDesc") : (locale === 'en' ? mysteryInfo.descriptionEn || mysteryInfo.description : mysteryInfo.description)}</p>
                    {hasCheckedInToday ? (
                      <div className="flex items-center gap-4 text-emerald-100 bg-white/10 px-6 py-4 rounded-xl border border-white/10 w-fit">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center"><CheckCircle2 className="w-6 h-6 text-white" /></div>
                        <span className="font-cinzel font-bold text-lg">{t("mystery.prayedToday")}</span>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" onClick={() => setCheckInModalOpen(true)} className="group w-full sm:w-auto px-10 py-7 text-lg font-cinzel font-bold tracking-wide rounded-full bg-gradient-to-r from-primary to-gold-dark text-primary-foreground hover:shadow-gold-glow-lg transition-all duration-300 border-2 border-primary/20">
                          <CheckCircle2 className="w-5 h-5 mr-3" /><span>{t("mystery.startBtn")}</span>
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => router.push("/como-rezar")} className="group w-full sm:w-auto px-10 py-7 text-lg font-bold rounded-full border-white/30 text-white hover:bg-white/10 transition-all border-2">
                          <BookOpen className="w-5 h-5 mr-3" /><span>{t("mystery.guideBtn")}</span>
                        </Button>
                      </div>
                    )}
                  </div>
                  <div className="hidden lg:flex items-center justify-center flex-shrink-0">
                    <div className={`w-44 h-44 xl:w-56 xl:h-56 rounded-3xl bg-gradient-to-br ${mysteryStyle.gradient} flex items-center justify-center shadow-2xl ${hasCheckedInToday ? "" : "animate-pulse-gold"}`}>
                      <span className="text-6xl xl:text-8xl">{mysteryStyle.icon}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ─── Weekly Journey + Quick Actions ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up animate-delay-300">
            <div className="lg:col-span-2 p-7 sm:p-9 rounded-2xl bg-card border border-border shadow-sm" data-magic-bento>
              <div className="flex items-center justify-between mb-7">
                <div>
                  <h3 className="font-cinzel font-bold text-foreground text-xl mb-1">{t("weeklyJourney")}</h3>
                  <p className="text-sm text-muted-foreground">{t("weeklySubtitle")}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-7">
                {getWeekDays().map((day, index) => (
                  <div key={index} className={`flex flex-col items-center py-3 rounded-xl transition-colors duration-200 ${day.isToday ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"}`}>
                    <span className="text-[10px] sm:text-xs text-muted-foreground uppercase font-bold tracking-wider mb-1.5">{day.dayName}</span>
                    <span className={`text-base sm:text-lg font-cinzel font-bold mb-2 ${day.isToday ? "text-primary" : "text-foreground"}`}>{day.dayNum}</span>
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-colors ${day.hasCheckIn ? "bg-gradient-to-br from-primary to-gold-dark" : "bg-muted/60"}`}>
                      {day.hasCheckIn && <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />}
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-6 border-t border-border">
                <div className="flex items-center justify-between text-sm mb-3">
                  <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">{t("weeklyGoal")}</span>
                  <span className="font-bold text-base text-primary">{weeklyProgress} / 7 {t("days")}</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-gold-dark transition-all duration-1000" style={{ width: `${Math.min((weeklyProgress / 7) * 100, 100)}%` }} />
                </div>
              </div>
            </div>

            {/* Quick Access Hub */}
            <div className="space-y-6">
              {/* Prayer Tools */}
              <div>
                <h3 className="font-cinzel font-bold text-foreground text-[10px] uppercase tracking-[0.2em] px-1 mb-3">{t("sections.tools")}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: PlayCircle, label: t("actions.interactiveGuide"), path: "/ferramentas/guia-interativo", gradient: "from-primary to-gold-dark" },
                    { icon: PenLine, label: t("actions.journal"), path: "/ferramentas/diario-espiritual", gradient: "from-purple-500 to-purple-600" },
                    { icon: Timer, label: t("actions.timer"), path: null, gradient: "from-sky-500 to-blue-500", comingSoon: true },
                    { icon: MessageCircleHeart, label: t("actions.intentionsWall"), path: null, gradient: "from-rose-500 to-rose-600", comingSoon: true },
                  ].map((action, i) => (
                    <button
                      key={action.label}
                      onClick={() => action.comingSoon ? (setComingSoonFeature(action.label), setComingSoonOpen(true)) : router.push(action.path as any)}
                      className="group relative flex flex-col items-center justify-center p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 min-h-[100px] shadow-sm"
                      data-magic-bento
                    >
                      {action.comingSoon && (
                        <span className="absolute top-2 right-2 text-[7px] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
                          <Lock className="w-2 h-2" />{t("comingSoon")}
                        </span>
                      )}
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-2 shadow-md ${action.comingSoon ? "opacity-50" : ""}`}>
                        <action.icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <p className={`font-cinzel font-bold text-[9px] group-hover:text-primary text-center uppercase tracking-widest leading-tight transition-colors ${action.comingSoon ? "text-muted-foreground" : "text-foreground"}`}>{action.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              {/* Content & Learning */}
              <div>
                <h3 className="font-cinzel font-bold text-foreground text-[10px] uppercase tracking-[0.2em] px-1 mb-3">{t("sections.content")}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: BookOpen, label: t("actions.howToPray"), path: "/como-rezar", gradient: "from-secondary to-secondary/80" },
                    { icon: Sparkles, label: t("actions.mysteries"), path: "/misterios-do-dia", gradient: "from-amber-500 to-amber-600" },
                    { icon: GraduationCap, label: t("actions.teachings"), path: "/ensinamentos", gradient: "from-emerald-600 to-emerald-700" },
                    { icon: Library, label: t("actions.resources"), path: "/recursos", gradient: "from-blue-600 to-blue-700" },
                  ].map((action) => (
                    <button key={action.path} onClick={() => router.push(action.path as any)} className="group flex flex-col items-center justify-center p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 min-h-[100px] shadow-sm" data-magic-bento>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-2 shadow-md`}>
                        <action.icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <p className="font-cinzel font-bold text-foreground text-[9px] group-hover:text-primary text-center uppercase tracking-widest leading-tight transition-colors">{action.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─── Progress Ring + Recent Activity ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up animate-delay-350">
            {/* Weekly Progress Ring */}
            <div className="p-7 sm:p-9 rounded-2xl bg-card border border-border flex flex-col items-center justify-center text-center shadow-sm" data-testid="progress-ring" data-magic-bento>
              <h3 className="font-cinzel font-bold text-foreground text-lg mb-1">{t("progress.title")}</h3>
              <p className="text-sm text-muted-foreground mb-6">{t("progress.subtitle")}</p>
              <div className="relative">
                <ProgressRing progress={(weeklyProgress / 7) * 100} size={140} strokeWidth={10} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-cinzel font-bold text-foreground">{weeklyProgress}</span>
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">/ 7 {t("days")}</span>
                </div>
              </div>
              {weeklyProgress >= 7 && (
                <p className="mt-4 text-sm font-bold text-emerald-600 dark:text-emerald-400">{t("progress.complete")}</p>
              )}
            </div>

            {/* Recent Activity Feed */}
            <div className="lg:col-span-2 p-7 sm:p-9 rounded-2xl bg-card border border-border shadow-sm" data-testid="activity-feed" data-magic-bento>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-cinzel font-bold text-foreground text-lg mb-1">{t("activity.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("activity.subtitle")}</p>
                </div>
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
              </div>
              {recentActivity.length === 0 ? (
                <div className="text-center py-10">
                  <span className="text-4xl mb-3 block">🙏</span>
                  <p className="text-muted-foreground text-sm">{t("activity.empty")}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentActivity.map((checkIn) => {
                    const mysteryStyle = mysteryColors[checkIn.mystery];
                    const mysteryLabel = checkInT(`mysteries.${checkIn.mystery}.label`);
                    return (
                      <div key={checkIn.id} className="flex items-start gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors" data-magic-bento>
                        <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${mysteryStyle.bg}`}>
                          <span className="text-lg">{mysteryStyle.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-foreground">
                              {t("activity.prayedThe")} {mysteryLabel}
                            </span>
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${mysteryStyle.bg} ${mysteryStyle.text}`}>
                              {mysteryLabel}
                            </span>
                          </div>
                          {checkIn.reflection ? (
                            <p className="text-sm text-muted-foreground line-clamp-2 italic leading-relaxed">&ldquo;{checkIn.reflection}&rdquo;</p>
                          ) : (
                            <p className="text-xs text-muted-foreground">{t("activity.noReflection")}</p>
                          )}
                          <span className="text-[10px] text-muted-foreground mt-1.5 block font-medium">
                            {formatRelativeTime(new Date(checkIn.date))}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ─── Community Feed Preview ─── */}
          <section className="animate-fade-up animate-delay-350" data-testid="community-preview">
            <div className="p-7 sm:p-9 rounded-2xl bg-card border border-border shadow-sm" data-magic-bento>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-cinzel font-bold text-foreground text-lg mb-1">{t("community.title")}</h3>
                  <p className="text-sm text-muted-foreground">{t("community.subtitle")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="space-y-4">
                {communityFeed.map((checkIn) => {
                  const cStyle = mysteryColors[checkIn.mystery];
                  return (
                    <div key={checkIn.id} className="flex items-start gap-4 p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors" data-magic-bento>
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/10">
                        <span className="text-[10px] font-bold text-primary">
                          {checkIn.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-foreground">{checkIn.user.name}</span>
                          <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest ${cStyle.bg} ${cStyle.text}`}>
                            {cStyle.icon} {checkInT(`mysteries.${checkIn.mystery}.label`)}
                          </span>
                        </div>
                        {checkIn.reflection && (
                          <p className="text-sm text-muted-foreground line-clamp-1 italic">&ldquo;{checkIn.reflection}&rdquo;</p>
                        )}
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[10px] font-bold text-primary/80 uppercase tracking-widest">🙏 {checkIn.amens} {t("community.amen")}</span>
                          <span className="text-[10px] text-muted-foreground font-medium">{formatRelativeTime(checkIn.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ─── Suggested Content ─── */}
          <section className="animate-fade-up animate-delay-400">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-cinzel font-bold text-foreground text-xl">{t("sections.suggestedForYou")}</h3>
              <button onClick={() => router.push("/ensinamentos" as any)} className="flex items-center gap-1.5 text-xs font-bold text-primary hover:text-gold-dark transition-colors uppercase tracking-widest">
                {t("sections.viewAll")} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: t("suggested.pathTitle"), desc: t("suggested.pathDesc"), path: "/ensinamentos/caminhos/primeiros-passos", icon: Compass, gradient: "from-primary to-gold-dark", cta: t("sections.startPath") },
                { title: t("suggested.santosTitle"), desc: t("suggested.santosDesc"), path: "/ensinamentos/santos", icon: Users, gradient: "from-purple-500 to-purple-600", cta: t("sections.viewAll") },
                { title: t("suggested.oracoesTitle"), desc: t("suggested.oracoesDesc"), path: "/oracoes-tradicionais", icon: Cross, gradient: "from-emerald-500 to-emerald-600", cta: t("sections.viewAll") },
              ].map((card) => (
                <button key={card.path} onClick={() => router.push(card.path as any)} className="group text-left p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 shadow-sm" data-magic-bento>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-4 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                    <card.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h4 className="font-cinzel font-bold text-foreground text-lg mb-2 group-hover:text-primary transition-colors">{card.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{card.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest">
                    {card.cta} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* ─── Fixed Our Lady of Fatima Quote ─── */}
          <section className="animate-fade-up animate-delay-500">
            <div className="p-10 sm:p-14 rounded-2xl bg-secondary dark:bg-card relative overflow-hidden shadow-sacred" data-magic-bento>
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <div className="max-w-3xl mx-auto text-center">
                <div className="w-16 h-0.5 bg-primary mx-auto mb-8 rounded-full" />
                <blockquote className="text-xl sm:text-2xl md:text-3xl font-cinzel leading-relaxed mb-6 italic text-white dark:text-foreground">
                  {t("quote.text")}
                </blockquote>
                <cite className="text-primary font-bold uppercase tracking-[0.2em] text-xs not-italic">{t("quote.author")}</cite>
              </div>
            </div>
          </section>

        </div>
      </main>

      <CheckInModal open={checkInModalOpen} onOpenChange={setCheckInModalOpen} onSuccess={refreshData} />
      <ComingSoonModal isOpen={comingSoonOpen} onClose={() => setComingSoonOpen(false)} featureName={comingSoonFeature} />
    </div>
    </PageTransition>
  );
}
