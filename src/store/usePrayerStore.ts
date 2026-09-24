'use client';

import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {calendarDayDifference, getCalendarDateInTimeZone, getLocalDateKey, getResolvedTimeZone} from '@/lib/date';
import {getDailyMysteryType, MysteryType} from '@/services/rosaryEngine';

export interface PrayerCompletion {
  id: string;
  localDate: string;
  completedAt: string;
  timeZone: string;
  mysteryType: MysteryType;
  intentions?: string[];
  reflection?: string;
}

export interface PrayerStats {
  consecutiveDays: number;
  totalRosariesPrayed: number;
  lastCompletionDate: string | null;
  completedToday: boolean;
}

export interface PrayerState {
  activeMysteryType: MysteryType;
  currentStepIndex: number;
  furthestStepIndex: number;
  sessionStartedAt: string | null;
  isCompleted: boolean;
  intentions: string[];
  reflection: string;
  completions: PrayerCompletion[];
  initRosary: (type?: MysteryType) => void;
  advanceStep: (totalSteps: number) => void;
  previousStep: () => void;
  setStep: (index: number) => void;
  addIntention: (intention: string) => void;
  removeIntention: (index: number) => void;
  setReflection: (text: string) => void;
  completeRosary: () => void;
  discardSession: () => void;
  resetPrayerData: () => void;
}

const initialPrayerState = {
        activeMysteryType: getDailyMysteryType(getCalendarDateInTimeZone()),
  currentStepIndex: 0,
  furthestStepIndex: 0,
  sessionStartedAt: null,
  isCompleted: false,
  intentions: [] as string[],
  reflection: '',
  completions: [] as PrayerCompletion[],
};

export function getPrayerStats(completions: PrayerCompletion[], now: Date = new Date()): PrayerStats {
  const uniqueDates = [...new Set(completions.map((item) => item.localDate))].sort().reverse();
  const today = getLocalDateKey(now);
  let consecutiveDays = 0;

  if (uniqueDates.length > 0) {
    const distanceFromToday = calendarDayDifference(uniqueDates[0], today);
    if (distanceFromToday <= 1) {
      consecutiveDays = 1;
      for (let index = 1; index < uniqueDates.length; index += 1) {
        if (calendarDayDifference(uniqueDates[index], uniqueDates[index - 1]) === 1) {
          consecutiveDays += 1;
        } else {
          break;
        }
      }
    }
  }

  return {
    consecutiveDays,
    totalRosariesPrayed: completions.length,
    lastCompletionDate: uniqueDates[0] ?? null,
    completedToday: uniqueDates[0] === today,
  };
}

export const usePrayerStore = create<PrayerState>()(
  persist(
    (set, get) => ({
      ...initialPrayerState,
      initRosary: (type) => set({
        activeMysteryType: type ?? getDailyMysteryType(getCalendarDateInTimeZone()),
        currentStepIndex: 0,
        furthestStepIndex: 0,
        sessionStartedAt: new Date().toISOString(),
        isCompleted: false,
        intentions: [],
        reflection: '',
      }),
      advanceStep: (totalSteps) => {
        const {currentStepIndex, furthestStepIndex, sessionStartedAt} = get();
        if (currentStepIndex >= totalSteps - 1) return;
        const nextIndex = currentStepIndex + 1;
        set({
          currentStepIndex: nextIndex,
          furthestStepIndex: Math.max(furthestStepIndex, nextIndex),
          sessionStartedAt: sessionStartedAt ?? new Date().toISOString(),
        });
      },
      previousStep: () => set((state) => ({currentStepIndex: Math.max(0, state.currentStepIndex - 1)})),
      setStep: (index) => set((state) => ({
        currentStepIndex: Math.max(0, Math.min(index, state.furthestStepIndex)),
      })),
      addIntention: (intention) => {
        const value = intention.trim().slice(0, 140);
        if (value && get().intentions.length < 5) set((state) => ({intentions: [...state.intentions, value]}));
      },
      removeIntention: (index) => set((state) => ({
        intentions: state.intentions.filter((_, itemIndex) => itemIndex !== index),
      })),
      setReflection: (reflection) => set((state) => {
        if (!state.isCompleted || state.completions.length === 0) return {reflection};
        const completions = [...state.completions];
        const last = completions[completions.length - 1];
        completions[completions.length - 1] = {...last, reflection};
        return {reflection, completions};
      }),
      completeRosary: () => {
        const state = get();
        if (state.isCompleted) return;
        const completedAt = new Date();
        const completion: PrayerCompletion = {
          id: `rosary-${completedAt.getTime()}`,
          localDate: getLocalDateKey(completedAt),
          completedAt: completedAt.toISOString(),
          timeZone: getResolvedTimeZone(),
          mysteryType: state.activeMysteryType,
          intentions: state.intentions.length > 0 ? [...state.intentions] : undefined,
        };
        set({isCompleted: true, completions: [...state.completions, completion]});
      },
      discardSession: () => set({
  activeMysteryType: getDailyMysteryType(getCalendarDateInTimeZone()),
        currentStepIndex: 0,
        furthestStepIndex: 0,
        sessionStartedAt: null,
        isCompleted: false,
        intentions: [],
        reflection: '',
      }),
      resetPrayerData: () => set({...initialPrayerState}),
    }),
    {
      name: 'evangelizae-prayer-session',
      version: 2,
      migrate: (persistedState, version) => {
        if (version >= 2) return persistedState as PrayerState;
        const legacy = persistedState as Partial<PrayerState>;
        const currentStepIndex = legacy.currentStepIndex ?? 0;
        return {
          ...initialPrayerState,
          activeMysteryType: legacy.activeMysteryType ?? getDailyMysteryType(),
          currentStepIndex,
          furthestStepIndex: currentStepIndex,
          sessionStartedAt: currentStepIndex ? new Date().toISOString() : null,
          intentions: Array.isArray(legacy.intentions) ? legacy.intentions : [],
          reflection: typeof legacy.reflection === 'string' ? legacy.reflection : '',
        };
      },
    },
  ),
);
