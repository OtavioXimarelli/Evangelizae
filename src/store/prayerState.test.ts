import {describe, expect, it} from 'vitest';
import {getPrayerStats, PrayerCompletion, usePrayerStore} from './usePrayerStore';
import {isReminderDue, initialPreferences, usePreferencesStore} from './usePreferencesStore';

function completion(localDate: string, suffix = '1'): PrayerCompletion {
  return {id: `${localDate}-${suffix}`, localDate, completedAt: `${localDate}T12:00:00.000Z`, timeZone: 'America/Sao_Paulo', devotion: 'rosario', mysteryType: 'gloriosos'};
}

describe('devotion state', () => {
  it('defaults to the Rosary', () => {
    expect(usePrayerStore.getState().activeDevotion).toBe('rosario');
  });

  it('keeps back-compat when initRosary receives a MysteryType', () => {
    usePrayerStore.getState().initRosary('gloriosos');
    const state = usePrayerStore.getState();
    expect(state.activeDevotion).toBe('rosario');
    expect(state.activeMysteryType).toBe('gloriosos');
  });

  it('switches devotion when given a DevotionType', () => {
    usePrayerStore.getState().initRosary('sao_jose');
    expect(usePrayerStore.getState().activeDevotion).toBe('sao_jose');
  });
});

describe('private prayer statistics', () => {
  it('counts every complete Rosary but only one streak day per date', () => {
    const stats = getPrayerStats([completion('2026-08-20'), completion('2026-08-20', '2')], new Date('2026-08-20T21:00:00Z'));
    expect(stats.totalRosariesPrayed).toBe(2);
    expect(stats.consecutiveDays).toBe(1);
    expect(stats.completedToday).toBe(true);
  });

  it('derives a consecutive run from unique calendar dates', () => {
    const stats = getPrayerStats([completion('2026-08-18'), completion('2026-08-19'), completion('2026-08-20')], new Date('2026-08-20T21:00:00Z'));
    expect(stats.consecutiveDays).toBe(3);
  });

  it('keeps yesterday active but resets an older streak', () => {
    expect(getPrayerStats([completion('2026-08-19')], new Date('2026-08-20T11:00:00Z')).consecutiveDays).toBe(1);
    expect(getPrayerStats([completion('2026-08-18')], new Date('2026-08-20T11:00:00Z')).consecutiveDays).toBe(0);
  });
});

describe('in-app reminder', () => {
  it('is opt-in and can be enabled explicitly', () => {
    expect(initialPreferences.reminderEnabled).toBe(false);
    usePreferencesStore.setState({...initialPreferences}, false);
    usePreferencesStore.getState().setProfile({reminderEnabled: true});
    expect(usePreferencesStore.getState().reminderEnabled).toBe(true);
  });

  it('is due after the selected time and can be dismissed for the date', () => {
    const now = new Date('2026-08-20T12:30:00Z');
    expect(isReminderDue('09:00', null, now)).toBe(true);
    expect(isReminderDue('10:00', null, now)).toBe(false);
    expect(isReminderDue('09:00', '2026-08-20', now)).toBe(false);
  });
});
