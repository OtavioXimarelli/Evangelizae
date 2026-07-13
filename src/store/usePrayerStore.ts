'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { MysteryType, getDailyMysteryType } from '@/services/rosaryEngine';

export interface OfflineCheckIn {
  id: string;
  mysteryType: MysteryType;
  prayedBeadsCount: number;
  intentions: string[];
  reflection?: string;
  timestamp: string;
}

export interface PrayerState {
  // Active Rosary Session State
  activeMysteryType: MysteryType;
  currentStepIndex: number;
  isCompleted: boolean;
  intentions: string[];
  reflection: string;

  // Personal Progress Metrics (No leaderboards)
  consecutiveDays: number;
  totalRosariesPrayed: number;
  lastCheckInDate: string | null;

  // Offline Queue
  offlineCheckIns: OfflineCheckIn[];

  // Actions
  initRosary: (type?: MysteryType) => void;
  advanceStep: (totalSteps: number) => void;
  previousStep: () => void;
  setStep: (index: number) => void;
  addIntention: (intention: string) => void;
  removeIntention: (index: number) => void;
  setReflection: (text: string) => void;
  submitCheckIn: () => void;
  syncOfflineCheckIns: () => Promise<void>;
}

export const usePrayerStore = create<PrayerState>()(
  persist(
    (set, get) => ({
      activeMysteryType: getDailyMysteryType(),
      currentStepIndex: 0,
      isCompleted: false,
      intentions: [],
      reflection: '',

      consecutiveDays: 1,
      totalRosariesPrayed: 3,
      lastCheckInDate: null,
      offlineCheckIns: [],

      initRosary: (type) => {
        const targetType = type || getDailyMysteryType();
        set({
          activeMysteryType: targetType,
          currentStepIndex: 0,
          isCompleted: false
        });
      },

      advanceStep: (totalSteps) => {
        const { currentStepIndex } = get();
        if (currentStepIndex + 1 < totalSteps) {
          set({ currentStepIndex: currentStepIndex + 1 });
        } else {
          set({ isCompleted: true });
        }
      },

      previousStep: () => {
        const { currentStepIndex } = get();
        if (currentStepIndex > 0) {
          set({ currentStepIndex: currentStepIndex - 1, isCompleted: false });
        }
      },

      setStep: (index) => {
        set({ currentStepIndex: Math.max(0, index), isCompleted: false });
      },

      addIntention: (intention) => {
        if (!intention.trim()) return;
        set((state) => ({ intentions: [...state.intentions, intention.trim()] }));
      },

      removeIntention: (index) => {
        set((state) => ({
          intentions: state.intentions.filter((_, i) => i !== index)
        }));
      },

      setReflection: (text) => {
        set({ reflection: text });
      },

      submitCheckIn: () => {
        const state = get();
        const todayStr = new Date().toISOString().split('T')[0];
        const isConsecutive = state.lastCheckInDate 
          ? (new Date(todayStr).getTime() - new Date(state.lastCheckInDate).getTime()) <= 86400000 * 2 
          : true;

        const newDays = isConsecutive ? state.consecutiveDays + 1 : 1;

        const checkInPayload: OfflineCheckIn = {
          id: `checkin-${Date.now()}`,
          mysteryType: state.activeMysteryType,
          prayedBeadsCount: 53,
          intentions: state.intentions,
          reflection: state.reflection,
          timestamp: new Date().toISOString()
        };

        set({
          isCompleted: true,
          consecutiveDays: newDays,
          totalRosariesPrayed: state.totalRosariesPrayed + 1,
          lastCheckInDate: todayStr,
          offlineCheckIns: [...state.offlineCheckIns, checkInPayload]
        });

        // Try syncing right away if online
        if (typeof window !== 'undefined' && navigator.onLine) {
          get().syncOfflineCheckIns();
        }
      },

      syncOfflineCheckIns: async () => {
        const { offlineCheckIns } = get();
        if (offlineCheckIns.length === 0) return;

        // In MVP Phase 1 (before backend endpoint is live), simulate sync success
        try {
          // Future Spring Boot endpoint: POST /api/v1/prayer/checkin
          set({ offlineCheckIns: [] });
        } catch (error) {
          console.error('Failed to sync offline check-ins:', error);
        }
      }
    }),
    {
      name: 'evangelizae-prayer-session'
    }
  )
);
