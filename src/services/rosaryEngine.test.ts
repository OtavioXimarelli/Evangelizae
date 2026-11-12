import {describe, expect, it} from 'vitest';
import {buildDevotionSequence, buildRosarySequence, getDailyMysteryType, ROSARY_PRAYERS} from './rosaryEngine';

describe('rosary engine', () => {
  it('builds the complete 73-step Rosary for every mystery group', () => {
    for (const mystery of ['gozosos', 'luminosos', 'dolorosos', 'gloriosos'] as const) {
      const steps = buildRosarySequence(mystery);
      expect(steps).toHaveLength(73);
      expect(steps.every((step) => step.totalSteps === 73)).toBe(true);
      expect(steps.filter((step) => step.type === 'decade_hail_mary')).toHaveLength(50);
      expect(steps.at(-1)?.type).toBe('salve_regina');
    }
  });

  it('keeps the Rosary identical through the devotion abstraction', () => {
    for (const mystery of ['gozosos', 'luminosos', 'dolorosos', 'gloriosos'] as const) {
      expect(buildDevotionSequence('rosario', {mysteryType: mystery})).toEqual(buildRosarySequence(mystery));
    }
  });

  it('uses complete canonical repeated prayers', () => {
    const steps = buildRosarySequence('gloriosos');
    for (const step of steps.filter((item) => item.type === 'decade_our_father')) {
      expect(step.prayerTextPt).toBe(ROSARY_PRAYERS.ourFatherPt);
      expect(step.latinText).toBe(ROSARY_PRAYERS.ourFatherLa);
    }
    for (const step of steps.filter((item) => item.type === 'decade_hail_mary')) {
      expect(step.prayerTextPt).toBe(ROSARY_PRAYERS.hailMaryPt);
      expect(step.latinText).toBe(ROSARY_PRAYERS.hailMaryLa);
    }
  });

  it('keeps Scripture and the contemplative fruit from being repeated in the same step', () => {
    const introductions = buildRosarySequence('gloriosos').filter((step) => step.type === 'mystery_intro');
    expect(introductions).toHaveLength(5);
    for (const step of introductions) {
      expect(step.prayerTextPt).toMatch(/^Palavra de Deus:/);
      expect(step.prayerTextPt).not.toContain('Fruto da contemplação');
      expect(step.mystery?.fruitPt).toBeTruthy();
    }
  });

  it('maps weekdays to the traditional daily mysteries', () => {
    expect(getDailyMysteryType(new Date(2026, 7, 17))).toBe('gozosos');
    expect(getDailyMysteryType(new Date(2026, 7, 18))).toBe('dolorosos');
    expect(getDailyMysteryType(new Date(2026, 7, 19))).toBe('gloriosos');
    expect(getDailyMysteryType(new Date(2026, 7, 20))).toBe('luminosos');
  });
});
