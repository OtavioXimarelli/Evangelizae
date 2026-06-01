"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter } from "@/i18n/routing";
import { PageHeader } from "@/components/page-header";
import { PageTransition } from "@/components/page-transition";
import { BreadcrumbNav } from "@/components/learning/breadcrumb-nav";
import { Button } from "@/components/ui/button";
import {
    ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, Smartphone, Monitor,
    BookOpen, Heart, ChevronRight, PlayCircle, Sparkles
} from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { getTodaysMystery, MysteryType } from "@/types";
import { usePrayerStore } from "@/store/use-prayer-store";
import { useIsMounted } from "@/hooks/use-hydrated";

// ── Types ──

type BeadType =
    | "cross" | "intro" | "montfort_intro" | "montfort_salutation"
    | "decade_offering" | "mystery_start" | "our_father" | "hail_mary"
    | "glory" | "fatima" | "montfort_closing" | "sub_tuum" | "closing";

type RosaryStep = {
    titleKey: string;
    prayerKey: string;
    latinKey?: string;
    type: BeadType;
    mysteryIndex?: number;
    mysteryType?: MysteryType;
};

type RosaryMode = "daily" | "full";
type MeditationTab = "gospel" | "meditation" | "prayer";

const ALL_MYSTERIES: MysteryType[] = ["joyful", "sorrowful", "glorious", "luminous"];

// ── Build Rosary Sequence ──

function buildRosarySequence(mysteryTypes: MysteryType[]): RosaryStep[] {
    const steps: RosaryStep[] = [];

    // Opening
    steps.push({ titleKey: "beads.signOfCross", prayerKey: "prayers.signOfCross", latinKey: "latin.signOfCross", type: "cross" });
    steps.push({ titleKey: "beads.montfortIntro", prayerKey: "prayers.montfortIntro", type: "montfort_intro" });
    steps.push({ titleKey: "beads.creed", prayerKey: "prayers.creed", latinKey: "latin.creed", type: "intro" });
    steps.push({ titleKey: "beads.ourFather", prayerKey: "prayers.ourFather", latinKey: "latin.ourFather", type: "our_father" });
    steps.push({ titleKey: "beads.hailMaryFaith", prayerKey: "prayers.hailMary", latinKey: "latin.hailMary", type: "hail_mary" });
    steps.push({ titleKey: "beads.hailMaryHope", prayerKey: "prayers.hailMary", latinKey: "latin.hailMary", type: "hail_mary" });
    steps.push({ titleKey: "beads.hailMaryCharity", prayerKey: "prayers.hailMary", latinKey: "latin.hailMary", type: "hail_mary" });
    steps.push({ titleKey: "beads.glory", prayerKey: "prayers.glory", latinKey: "latin.glory", type: "glory" });

    // Decades
    for (const mType of mysteryTypes) {
        for (let decade = 1; decade <= 5; decade++) {
            // Mystery announcement
            steps.push({
                titleKey: `mysteries.${mType}.m${decade}`,
                prayerKey: `mysteries.${mType}.m${decade}`,
                type: "mystery_start",
                mysteryIndex: decade,
                mysteryType: mType,
            });
            // Decade offering (Montfort)
            steps.push({
                titleKey: "beads.decadeOffering",
                prayerKey: `offerings.${mType}.d${decade}`,
                type: "decade_offering",
                mysteryIndex: decade,
                mysteryType: mType,
            });
            // Our Father
            steps.push({ titleKey: "beads.ourFather", prayerKey: "prayers.ourFather", latinKey: "latin.ourFather", type: "our_father" });
            // 10 Hail Marys
            for (let hm = 1; hm <= 10; hm++) {
                steps.push({
                    titleKey: "beads.hailMaryN",
                    prayerKey: "prayers.hailMary",
                    latinKey: "latin.hailMary",
                    type: "hail_mary",
                });
            }
            // Glory Be
            steps.push({ titleKey: "beads.glory", prayerKey: "prayers.glory", latinKey: "latin.glory", type: "glory" });
            // Fatima Prayer
            steps.push({ titleKey: "beads.fatimaPrayer", prayerKey: "prayers.fatimaPrayer", latinKey: "latin.fatimaPrayer", type: "fatima" });
        }
    }

    // Closing
    steps.push({ titleKey: "beads.salveRegina", prayerKey: "prayers.salveRegina", latinKey: "latin.salveRegina", type: "closing" });
    steps.push({ titleKey: "beads.montfortSalutation", prayerKey: "prayers.montfortSalutation", type: "montfort_salutation" });
    steps.push({ titleKey: "beads.montfortClosing", prayerKey: "prayers.montfortClosing", type: "montfort_closing" });
    steps.push({ titleKey: "beads.subTuum", prayerKey: "prayers.subTuum", latinKey: "latin.subTuum", type: "sub_tuum" });
    steps.push({ titleKey: "beads.signOfCross", prayerKey: "prayers.signOfCross", latinKey: "latin.signOfCross", type: "cross" });

    return steps;
}

// ── Constants ──

const BEAD_COLORS: Record<BeadType, string> = {
    cross: "bg-primary",
    intro: "bg-muted-foreground/40",
    montfort_intro: "bg-primary/80",
    montfort_salutation: "bg-rose-400/80",
    decade_offering: "bg-primary/60",
    mystery_start: "bg-primary",
    our_father: "bg-secondary",
    hail_mary: "bg-muted-foreground/30",
    glory: "bg-accent/60",
    fatima: "bg-rose-500/60",
    montfort_closing: "bg-primary/80",
    sub_tuum: "bg-emerald-500/60",
    closing: "bg-primary",
};

const SESSION_KEY = "rosary-guide-session";
const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;

interface SavedSession {
    step: number;
    mode: RosaryMode;
    savedAt: number;
}

// ── Bead Visualizer ──

function BeadMap({ steps, currentStep, onBeadClick }: {
    steps: RosaryStep[];
    currentStep: number;
    onBeadClick: (index: number) => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const activeRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (activeRef.current) {
            activeRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
    }, [currentStep]);

    // Single linear pass grouping logic
    const introBeads: RosaryStep[] = [];
    const decades: { label: string; startIndex: number; beads: RosaryStep[] }[] = [];
    const closingBeads: RosaryStep[] = [];
    
    let currentDecadeBeads: RosaryStep[] = [];
    let currentDecadeStartIndex = 0;
    let phase: "intro" | "decades" | "closing" = "intro";

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        if (phase === "intro") {
            if (step.type === "mystery_start") {
                phase = "decades";
                currentDecadeStartIndex = i;
                currentDecadeBeads = [step];
            } else {
                introBeads.push(step);
            }
        } else if (phase === "decades") {
            if (step.type === "mystery_start") {
                decades.push({ 
                    label: `${steps[currentDecadeStartIndex].mysteryIndex || 1}`, 
                    startIndex: currentDecadeStartIndex, 
                    beads: currentDecadeBeads 
                });
                currentDecadeStartIndex = i;
                currentDecadeBeads = [step];
            } else if (step.type === "closing") {
                decades.push({ 
                    label: `${steps[currentDecadeStartIndex].mysteryIndex || 1}`, 
                    startIndex: currentDecadeStartIndex, 
                    beads: currentDecadeBeads 
                });
                phase = "closing";
                closingBeads.push(step);
            } else {
                currentDecadeBeads.push(step);
            }
        } else if (phase === "closing") {
            closingBeads.push(step);
        }
    }

    if (phase === "decades" && currentDecadeBeads.length > 0) {
        decades.push({ 
            label: `${steps[currentDecadeStartIndex].mysteryIndex || 1}`, 
            startIndex: currentDecadeStartIndex, 
            beads: currentDecadeBeads 
        });
    }

    const closingStartIndex = steps.length - closingBeads.length;

    const renderBead = (step: RosaryStep, globalIndex: number) => {
        const isActive = globalIndex === currentStep;
        const isPast = globalIndex < currentStep;
        const beadColor = BEAD_COLORS[step.type];
        
        const sizeClass = isActive ? "w-8 h-8 md:w-10 md:h-10 border-2 border-background" : "w-3.5 h-3.5 sm:w-4 sm:h-4";

        return (
            <button
                key={globalIndex}
                ref={isActive ? activeRef : undefined}
                onClick={() => onBeadClick(globalIndex)}
                className={`
                    rounded-full transition-all duration-300 flex-shrink-0 relative
                    ${sizeClass}
                    ${isPast ? `${beadColor} opacity-50` : isActive ? `${beadColor} ring-4 ring-primary shadow-gold-glow z-10` : `${beadColor} opacity-30 hover:opacity-60`}
                `}
                aria-label={`Bead ${globalIndex + 1}`}
            />
        );
    };

    return (
        <div ref={containerRef} className="py-4 px-2 sm:px-4 w-full max-w-sm mx-auto flex flex-col items-center gap-4 sm:gap-5" data-testid="bead-map">
            {/* Intro row */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 sm:pl-6 w-full min-h-[48px]">
                {introBeads.map((step, i) => renderBead(step, i))}
            </div>

            {/* Decades 1-5 */}
            <div className="flex flex-col gap-2 sm:gap-3 w-full">
                {decades.map((decade, i) => (
                    <div key={i} className="flex items-center justify-start gap-3 sm:gap-4 w-full min-h-[48px]">
                        <span className="text-[10px] sm:text-xs font-bold text-muted-foreground/60 w-3 text-right">{decade.label}</span>
                        <div className="flex items-center gap-1 sm:gap-1.5 flex-1 flex-wrap">
                            {decade.beads.map((step, j) => renderBead(step, decade.startIndex + j))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Closing row */}
            {closingBeads.length > 0 && (
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 sm:pl-6 w-full min-h-[48px] mt-2">
                    {closingBeads.map((step, i) => renderBead(step, closingStartIndex + i))}
                </div>
            )}
        </div>
    );
}

// ── Mode Selection Screen ──

function ModeSelection({ onSelect, t, checkInT, todaysMystery }: {
    onSelect: (mode: RosaryMode) => void;
    t: ReturnType<typeof useTranslations>;
    checkInT: ReturnType<typeof useTranslations>;
    todaysMystery: MysteryType;
}) {
    const [selected, setSelected] = useState<RosaryMode>("daily");
    const mysteryLabel = checkInT(`mysteries.${todaysMystery}.label`);

    return (
        <PageTransition>
            <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
                <div className="max-w-lg w-full space-y-8 text-center">
                    <div>
                        <span className="text-6xl mb-4 block">📿</span>
                        <h1 className="text-3xl font-cinzel font-bold text-foreground mb-2">{t("modeSelect.title")}</h1>
                        <p className="text-muted-foreground">{t("modeSelect.subtitle")}</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => setSelected("daily")}
                            className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 ${
                                selected === "daily"
                                    ? "border-primary bg-primary/5 shadow-gold-glow"
                                    : "border-border bg-card hover:border-primary/30"
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected === "daily" ? "bg-gradient-to-br from-primary to-gold-dark" : "bg-muted"}`}>
                                    <Sparkles className={`w-6 h-6 ${selected === "daily" ? "text-primary-foreground" : "text-muted-foreground"}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-cinzel font-bold text-foreground text-lg">{t("modeSelect.daily")}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{t("modeSelect.dailyDesc")}</p>
                                    <p className="text-xs text-primary font-bold mt-2">{t("modeSelect.todayMystery", { name: mysteryLabel })}</p>
                                </div>
                                {selected === "daily" && <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />}
                            </div>
                        </button>

                        <button
                            onClick={() => setSelected("full")}
                            className={`w-full text-left p-6 rounded-2xl border-2 transition-all duration-200 ${
                                selected === "full"
                                    ? "border-primary bg-primary/5 shadow-gold-glow"
                                    : "border-border bg-card hover:border-primary/30"
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected === "full" ? "bg-gradient-to-br from-primary to-gold-dark" : "bg-muted"}`}>
                                    <PlayCircle className={`w-6 h-6 ${selected === "full" ? "text-primary-foreground" : "text-muted-foreground"}`} />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-cinzel font-bold text-foreground text-lg">{t("modeSelect.full")}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{t("modeSelect.fullDesc")}</p>
                                </div>
                                {selected === "full" && <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />}
                            </div>
                        </button>
                    </div>

                    <Button
                        size="lg"
                        onClick={() => onSelect(selected)}
                        className="rounded-full px-12 py-7 text-lg font-cinzel font-bold bg-gradient-to-r from-primary to-gold-dark text-primary-foreground hover:shadow-gold-glow-lg transition-all w-full sm:w-auto"
                    >
                        {t("modeSelect.start")}
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            </main>
        </PageTransition>
    );
}

// ── Main Component ──

export default function GuiaInterativoPage() {
    const router = useRouter();
    const t = useTranslations("RosaryGuide");
    const checkInT = useTranslations("CheckIn");
    const isMounted = useIsMounted();
    const addCheckIn = usePrayerStore((s) => s.addCheckIn);

    const todaysMystery = getTodaysMystery();

    const [mode, setMode] = useState<RosaryMode | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [showResumePrompt, setShowResumePrompt] = useState(false);
    const [hapticEnabled, setHapticEnabled] = useState(true);
    const [wakeLockActive, setWakeLockActive] = useState(false);
    const [autoCheckedIn, setAutoCheckedIn] = useState(false);
    const [activeTab, setActiveTab] = useState<MeditationTab>("gospel");
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    const mysteryTypes = useMemo(() => {
        if (mode === "full") return ALL_MYSTERIES;
        return [todaysMystery];
    }, [mode, todaysMystery]);

    const rosarySteps = useMemo(() => buildRosarySequence(mysteryTypes), [mysteryTypes]);

    // Session recovery
    useEffect(() => {
        if (!isMounted) return;
        try {
            const saved = localStorage.getItem(SESSION_KEY);
            if (saved) {
                const session: SavedSession = JSON.parse(saved);
                const age = Date.now() - session.savedAt;
                if (age < SESSION_MAX_AGE_MS && session.step > 0) {
                    setShowResumePrompt(true);
                } else {
                    localStorage.removeItem(SESSION_KEY);
                }
            }
        } catch {
            localStorage.removeItem(SESSION_KEY);
        }
    }, [isMounted]);

    // Screen WakeLock
    const requestWakeLock = useCallback(async () => {
        try {
            if ("wakeLock" in navigator) {
                wakeLockRef.current = await navigator.wakeLock.request("screen");
                setWakeLockActive(true);
                wakeLockRef.current.addEventListener("release", () => setWakeLockActive(false));
            }
        } catch { /* not supported */ }
    }, []);

    useEffect(() => {
        if (!isMounted || completed || !mode) return;
        requestWakeLock();
        const handleVisibility = () => {
            if (document.visibilityState === "visible" && !completed) requestWakeLock();
        };
        document.addEventListener("visibilitychange", handleVisibility);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibility);
            if (wakeLockRef.current) {
                wakeLockRef.current.release().catch(() => {});
                wakeLockRef.current = null;
            }
        };
    }, [isMounted, completed, requestWakeLock, mode]);

    const triggerHaptic = useCallback(() => {
        if (hapticEnabled && "vibrate" in navigator) navigator.vibrate(50);
    }, [hapticEnabled]);

    const saveSession = useCallback((step: number) => {
        if (!mode) return;
        const session: SavedSession = { step, mode, savedAt: Date.now() };
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }, [mode]);

    const handleNext = useCallback(() => {
        triggerHaptic();
        if (currentStep < rosarySteps.length - 1) {
            const next = currentStep + 1;
            setCurrentStep(next);
            saveSession(next);
            if (rosarySteps[next].type === "mystery_start") setActiveTab("gospel");
        } else {
            setCompleted(true);
            localStorage.removeItem(SESSION_KEY);
            if (!autoCheckedIn) {
                addCheckIn(new Date().toISOString(), todaysMystery, [], undefined);
                setAutoCheckedIn(true);
            }
            if (wakeLockRef.current) wakeLockRef.current.release().catch(() => {});
        }
    }, [currentStep, rosarySteps, triggerHaptic, saveSession, addCheckIn, todaysMystery, autoCheckedIn]);

    const handlePrev = useCallback(() => {
        triggerHaptic();
        if (currentStep > 0) {
            const prev = currentStep - 1;
            setCurrentStep(prev);
            saveSession(prev);
        }
    }, [currentStep, triggerHaptic, saveSession]);

    const handleBeadClick = useCallback((index: number) => {
        triggerHaptic();
        setCurrentStep(index);
        saveSession(index);
        if (rosarySteps[index].type === "mystery_start") setActiveTab("gospel");
    }, [triggerHaptic, saveSession, rosarySteps]);

    const handleReset = useCallback(() => {
        setCurrentStep(0);
        setCompleted(false);
        setAutoCheckedIn(false);
        setMode(null);
        localStorage.removeItem(SESSION_KEY);
    }, []);

    const handleResume = useCallback(() => {
        try {
            const saved = localStorage.getItem(SESSION_KEY);
            if (saved) {
                const session: SavedSession = JSON.parse(saved);
                setMode(session.mode);
                setCurrentStep(session.step);
            }
        } catch {}
        setShowResumePrompt(false);
    }, []);

    const handleStartFresh = useCallback(() => {
        localStorage.removeItem(SESSION_KEY);
        setCurrentStep(0);
        setShowResumePrompt(false);
    }, []);

    const handleModeSelect = useCallback((selectedMode: RosaryMode) => {
        setMode(selectedMode);
        setCurrentStep(0);
    }, []);

    // ── SSR Loading ──
    if (!isMounted) {
        return (
            <PageTransition>
                <main className="min-h-screen bg-background flex items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center animate-pulse-gold shadow-gold-glow">
                        <span className="text-4xl">📿</span>
                    </div>
                </main>
            </PageTransition>
        );
    }

    // ── Resume Prompt ──
    if (showResumePrompt) {
        return (
            <PageTransition>
                <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
                    <div className="max-w-md w-full glass p-8 sm:p-12 rounded-[2.5rem] text-center shadow-sacred">
                        <span className="text-5xl mb-6 block">📿</span>
                        <h2 className="text-2xl font-cinzel font-bold text-foreground mb-3">{t("resume.title")}</h2>
                        <p className="text-muted-foreground mb-8 text-sm">{t("resume.desc")}</p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button size="lg" onClick={handleResume} className="rounded-full px-8 bg-gradient-to-r from-primary to-gold-dark text-primary-foreground font-cinzel font-bold shadow-gold-glow">
                                {t("resume.continue")}
                            </Button>
                            <Button size="lg" variant="outline" onClick={handleStartFresh} className="rounded-full px-8 border-primary/20 hover:bg-primary/5 font-bold">
                                {t("resume.restart")}
                            </Button>
                        </div>
                    </div>
                </main>
            </PageTransition>
        );
    }

    // ── Mode Selection ──
    if (!mode) {
        return <ModeSelection onSelect={handleModeSelect} t={t} checkInT={checkInT} todaysMystery={todaysMystery} />;
    }

    // ── Active Prayer ──
    const step = rosarySteps[currentStep];
    const progressPercent = ((currentStep + 1) / rosarySteps.length) * 100;

    const getStepTitle = (s: RosaryStep, index: number): string => {
        if (s.titleKey === "beads.hailMaryN") {
            let hmCount = 0;
            for (let i = index; i >= 0; i--) {
                if (rosarySteps[i].type === "hail_mary") hmCount++;
                if (rosarySteps[i].type === "our_father" && i < index) break;
            }
            return t("beads.hailMaryN", { n: hmCount });
        }
        if (s.titleKey === "beads.decadeOffering") {
            return t("beads.decadeOffering", { n: s.mysteryIndex ?? 1 });
        }
        return t(s.titleKey);
    };

    // Determine current mystery type for this step (for meditations lookup)
    const getCurrentMysteryType = (): MysteryType | null => {
        for (let i = currentStep; i >= 0; i--) {
            if (rosarySteps[i].type === "mystery_start" && rosarySteps[i].mysteryType) {
                return rosarySteps[i].mysteryType!;
            }
        }
        return mysteryTypes[0];
    };

    const getCurrentMysteryIndex = (): number => {
        for (let i = currentStep; i >= 0; i--) {
            if (rosarySteps[i].type === "mystery_start" && rosarySteps[i].mysteryIndex) {
                return rosarySteps[i].mysteryIndex!;
            }
        }
        return 1;
    };

    // Is this a step with a long prayer text? (for font sizing)
    const isLongPrayer = ["intro", "montfort_intro", "montfort_salutation", "montfort_closing", "closing", "decade_offering"].includes(step.type);

    return (
        <PageTransition>
            <main className="min-h-screen bg-background flex flex-col" data-testid="rosary-guide">
                <PageHeader title={t("title")} subtitle={t("subtitle")} icon="📿" />

                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-grow flex flex-col">
                    <BreadcrumbNav
                        items={[
                            { label: "Ferramentas", path: "/ferramentas" },
                            { label: t("breadcrumb") },
                        ]}
                    />

                    {/* Status bar */}
                    <div className="flex items-center justify-center gap-3 mt-3 mb-1 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-bold">
                            <Monitor className={`w-3.5 h-3.5 ${wakeLockActive ? "text-emerald-500" : ""}`} />
                            <span className="uppercase tracking-widest text-[9px]">{wakeLockActive ? t("wakelock.active") : t("wakelock.inactive")}</span>
                        </div>
                        <button
                            onClick={() => setHapticEnabled(!hapticEnabled)}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-bold"
                        >
                            <Smartphone className={`w-3.5 h-3.5 ${hapticEnabled ? "text-emerald-500" : ""}`} />
                            <span className="uppercase tracking-widest text-[9px]">{hapticEnabled ? t("haptic.enabled") : t("haptic.disabled")}</span>
                        </button>
                    </div>

                    {!completed ? (
                        <div className="flex-grow flex flex-col justify-center py-3">
                            {/* Bead Map */}
                            <BeadMap steps={rosarySteps} currentStep={currentStep} onBeadClick={handleBeadClick} />

                            {/* Progress */}
                            <div className="mb-4 mt-2 px-2 sm:px-6">
                                <div className="flex justify-between items-end text-[10px] text-muted-foreground mb-2 font-bold uppercase tracking-[0.2em]">
                                    <span>{t("start")}</span>
                                    <span className="text-primary">{Math.round(progressPercent)}%</span>
                                </div>
                                <div className="w-full bg-primary/10 rounded-full h-1.5 border border-primary/5 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-primary to-gold-dark h-full rounded-full transition-all duration-500 ease-out"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>
                                <div className="text-center mt-2 text-[10px] text-muted-foreground/80 font-bold uppercase tracking-widest">
                                    {t("step", { current: currentStep + 1, total: rosarySteps.length })}
                                </div>
                            </div>

                            {/* Prayer Card */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative"
                                >
                                    {step.type === "mystery_start" && step.mysteryIndex && step.mysteryType ? (
                                        /* ── Mystery Step: Tabbed View ── */
                                        <div className="rounded-[2.5rem] overflow-hidden border border-primary/10 shadow-sacred bg-card">
                                            {/* Header */}
                                            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b border-primary/10 px-6 py-6 text-center">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                                                        {checkInT(`mysteries.${step.mysteryType}.label`)} — {step.mysteryIndex}/5
                                                    </span>
                                                </div>
                                                <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-foreground leading-tight">
                                                    {getStepTitle(step, currentStep)}
                                                </h2>
                                            </div>

                                            {/* Tabs */}
                                            <div className="flex border-b border-primary/10 bg-muted/30">
                                                {(["gospel", "meditation", "prayer"] as MeditationTab[]).map((tab) => (
                                                    <button
                                                        key={tab}
                                                        onClick={() => setActiveTab(tab)}
                                                        className={`flex-1 px-2 py-4 text-center text-xs font-bold transition-all duration-200 relative uppercase tracking-widest
                                                            ${activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                                                    >
                                                        <span>{t(`tabs.${tab}`)}</span>
                                                        {activeTab === tab && (
                                                            <motion.div layoutId="activeTab" className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Tab Content */}
                                            <div className="p-6 sm:p-10 min-h-[280px] flex flex-col justify-between">
                                                <AnimatePresence mode="wait">
                                                    <motion.div
                                                        key={activeTab}
                                                        initial={{ opacity: 0, x: 10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: -10 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="flex-1"
                                                    >
                                                        {activeTab === "gospel" && (
                                                            <div className="space-y-4">
                                                                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest">
                                                                    <BookOpen className="w-4 h-4" />
                                                                    <span>{t("bibleLabel")}</span>
                                                                </div>
                                                                <blockquote className="text-base sm:text-lg leading-relaxed text-foreground italic border-l-4 border-primary/30 pl-4 py-2">
                                                                    {t(`meditations.${step.mysteryType}.m${step.mysteryIndex}.bible`)}
                                                                </blockquote>
                                                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
                                                                    📖 {t(`meditations.${step.mysteryType}.m${step.mysteryIndex}.bibleRef`)}
                                                                </p>
                                                                <button
                                                                    onClick={() => setActiveTab("meditation")}
                                                                    className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-gold-dark transition-colors mt-2 uppercase tracking-widest"
                                                                >
                                                                    {t("tabs.meditation")} <ChevronRight className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        )}

                                                        {activeTab === "meditation" && (
                                                            <div className="space-y-4">
                                                                <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest">
                                                                    <Heart className="w-4 h-4" />
                                                                    <span>{t("montfortLabel")}</span>
                                                                </div>
                                                                <p className="text-base leading-relaxed text-foreground font-medium">
                                                                    {t(`meditations.${step.mysteryType}.m${step.mysteryIndex}.montfort`)}
                                                                </p>
                                                                <p className="text-[9px] text-muted-foreground/70 italic uppercase tracking-widest">
                                                                    {t("sourceLabel")}
                                                                </p>
                                                                <button
                                                                    onClick={() => setActiveTab("prayer")}
                                                                    className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:text-gold-dark transition-colors mt-2 uppercase tracking-widest"
                                                                >
                                                                    {t("tabs.prayer")} <ChevronRight className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        )}

                                                        {activeTab === "prayer" && (
                                                            <div className="space-y-4 text-center py-4">
                                                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
                                                                    {t("meditate")}
                                                                </p>
                                                                <p className="text-lg sm:text-xl leading-relaxed text-foreground italic font-manrope font-medium">
                                                                    &ldquo;{t(step.prayerKey)}&rdquo;
                                                                </p>
                                                            </div>
                                                        )}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    ) : (
                                        /* ── Regular Prayer Step ── */
                                        <div className="bg-card border border-primary/10 rounded-[2.5rem] p-8 sm:p-12 text-center relative overflow-hidden shadow-sacred min-h-[250px] flex flex-col justify-center">
                                            {/* Decorative glow inside card */}
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40 bg-primary/10 rounded-[100%] blur-3xl" />

                                            {/* Step type badge */}
                                            {(step.type === "montfort_intro" || step.type === "montfort_salutation" || step.type === "montfort_closing" || step.type === "decade_offering") && (
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mx-auto mb-4 relative z-10">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                                                        {t("montfortLabel")}
                                                    </span>
                                                </div>
                                            )}

                                            <h2 className={`font-cinzel font-bold text-primary uppercase tracking-widest mb-8 relative z-10 ${isLongPrayer ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}>
                                                {getStepTitle(step, currentStep)}
                                            </h2>

                                            {step.latinKey ? (
                                                /* ── Latin / Vernacular split ── */
                                                <div className="flex flex-col gap-8 relative z-10 text-left">
                                                    <div>
                                                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-3">
                                                            {t("latin.showVernacular")}
                                                        </p>
                                                        <p className={`leading-relaxed text-foreground italic font-manrope font-medium ${isLongPrayer ? "text-sm sm:text-base" : "text-base sm:text-lg"}`}>
                                                            {t(step.prayerKey)}
                                                        </p>
                                                    </div>
                                                    <div className="w-full h-px bg-primary/10" />
                                                    <div>
                                                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-primary mb-3">
                                                            {t("latin.toggle")}
                                                        </p>
                                                        <p className={`leading-relaxed text-muted-foreground italic font-manrope ${isLongPrayer ? "text-sm sm:text-base" : "text-base sm:text-lg"}`}>
                                                            {t(step.latinKey)}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* No Latin version — single column */
                                                <div className="relative z-10 text-center">
                                                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                                                        {t("meditate")}
                                                    </p>
                                                    <p className={`leading-relaxed text-foreground italic font-manrope font-medium ${isLongPrayer ? "text-sm sm:text-base" : "text-lg sm:text-xl"}`}>
                                                        {t(step.prayerKey)}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            </AnimatePresence>

                            {/* Controls */}
                            <div className="flex items-center mt-8 gap-4 px-2 sm:px-0">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handlePrev}
                                    disabled={currentStep === 0}
                                    className="rounded-full min-w-[3.5rem] w-14 h-14 bg-card border-primary/20 hover:bg-primary/5 text-primary transition-all shadow-sm"
                                    title={t("prev")}
                                >
                                    <ArrowLeft className="w-6 h-6" />
                                </Button>

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleReset}
                                    disabled={currentStep === 0}
                                    className="rounded-full min-w-[3.5rem] w-14 h-14 bg-card border-primary/20 hover:bg-primary/5 text-muted-foreground hover:text-primary transition-all shadow-sm"
                                    title={t("reset")}
                                >
                                    <RefreshCw className="w-5 h-5" />
                                </Button>

                                <Button
                                    size="lg"
                                    onClick={handleNext}
                                    className="flex-1 rounded-full h-14 text-base font-cinzel font-bold bg-gradient-to-r from-primary to-gold-dark text-primary-foreground hover:shadow-gold-glow transition-all border-none"
                                >
                                    {currentStep === rosarySteps.length - 1 ? t("finish") : t("next")}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        /* ── Completion Screen ── */
                        <div className="flex-grow flex flex-col items-center justify-center py-20 text-center">
                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-8 relative"
                            >
                                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
                                <CheckCircle2 className="w-12 h-12 text-white dark:text-white" />
                            </motion.div>

                            <h2 className="text-3xl font-cinzel font-bold text-foreground mb-4">
                                {t("completion.title")}
                            </h2>
                            <p className="text-lg text-muted-foreground mb-6 max-w-md">
                                {t("completion.desc")}
                            </p>
                            {autoCheckedIn && (
                                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mb-10 bg-emerald-500/10 py-2 px-6 rounded-full inline-block">
                                    {t("completion.checkedIn")}
                                </p>
                            )}
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <Button variant="outline" size="lg" onClick={handleReset} className="rounded-full px-10 border-primary/20 hover:bg-primary/5 font-bold">
                                    <RefreshCw className="w-5 h-5 mr-2" />
                                    {t("completion.prayAgain")}
                                </Button>
                                <Button size="lg" onClick={() => router.push("/dashboard")} className="rounded-full px-10 bg-secondary text-secondary-foreground font-bold shadow-lg">
                                    {t("completion.goToDashboard")}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </PageTransition>
    );
}
