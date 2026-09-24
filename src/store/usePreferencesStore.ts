'use client';

import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {getDatePartsInTimeZone, getLocalDateKey} from '@/lib/date';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ReaderScale = 'normal' | 'large' | 'xl';
export type PrayerWindow = 'morning' | 'afternoon' | 'evening';

export interface PreferencesState {
  firstName: string;
  prayerWindow: PrayerWindow;
  reminderTime: string;
  reminderEnabled: boolean;
  theme: ThemePreference;
  readerScale: ReaderScale;
  onboardedAt: string | null;
  reminderDismissedDate: string | null;
  betaNoticeDismissed: boolean;
  setProfile: (profile: Partial<Pick<PreferencesState, 'firstName' | 'prayerWindow' | 'reminderTime' | 'reminderEnabled' | 'theme' | 'readerScale'>>) => void;
  completeOnboarding: () => void;
  dismissReminderToday: () => void;
  dismissBetaNotice: () => void;
  resetPreferences: () => void;
}

export const initialPreferences = {
  firstName: '',
  prayerWindow: 'morning' as PrayerWindow,
  reminderTime: '07:00',
  reminderEnabled: false,
  theme: 'system' as ThemePreference,
  readerScale: 'large' as ReaderScale,
  onboardedAt: null as string | null,
  reminderDismissedDate: null as string | null,
  betaNoticeDismissed: false as boolean,
};

export function isReminderDue(reminderTime: string, dismissedDate: string | null, now: Date = new Date()) {
  if (dismissedDate === getLocalDateKey(now)) return false;
  const {hour, minute} = getDatePartsInTimeZone(now);
  const [hours, minutes] = reminderTime.split(':').map(Number);
  return hour * 60 + minute >= hours * 60 + minutes;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      ...initialPreferences,
      setProfile: (profile) => set(profile),
      completeOnboarding: () => {
        document.cookie = 'evangelizae_onboarded=1; Path=/; Max-Age=15552000; SameSite=Lax';
        set({onboardedAt: new Date().toISOString()});
      },
      dismissReminderToday: () => set({reminderDismissedDate: getLocalDateKey()}),
      dismissBetaNotice: () => set({betaNoticeDismissed: true}),
      resetPreferences: () => {
        document.cookie = 'evangelizae_onboarded=; Path=/; Max-Age=0; SameSite=Lax';
        set({...initialPreferences});
      },
    }),
    {
      name: 'evangelizae-preferences',
      version: 3,
      migrate: (persisted, version) => ({
        ...(persisted as Record<string, unknown>),
        reminderEnabled: version >= 3 ? Boolean((persisted as Record<string, unknown>).reminderEnabled) : false,
        betaNoticeDismissed: version >= 2 ? Boolean((persisted as Record<string, unknown>).betaNoticeDismissed) : false,
      }),
    },
  ),
);
