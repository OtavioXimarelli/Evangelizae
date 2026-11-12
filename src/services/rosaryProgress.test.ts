import {describe, expect, it} from 'vitest';
import {buildRosarySequence, ROSARY_MYSTERIES, type MysteryType} from './rosaryEngine';
import {getRosaryProgress} from './rosaryProgress';

const mysteryTypes = Object.keys(ROSARY_MYSTERIES) as MysteryType[];

describe('getRosaryProgress', () => {
  it('classifies the opening steps', () => {
    const steps = buildRosarySequence('gloriosos');
    expect(steps).toHaveLength(73);
    expect(getRosaryProgress(steps[0])).toMatchObject({phase: 'opening', stepNumber: 1, totalSteps: 73});
    expect(getRosaryProgress(steps[2])).toMatchObject({phase: 'opening', stepNumber: 3});
    expect(getRosaryProgress(steps[2]).decadeNumber).toBeUndefined();
  });

  it('numbers the opening Hail Marys one to three', () => {
    const steps = buildRosarySequence('gozosos');
    expect(getRosaryProgress(steps[3]).openingHailMary).toBe(1);
    expect(getRosaryProgress(steps[4]).openingHailMary).toBe(2);
    expect(getRosaryProgress(steps[5]).openingHailMary).toBe(3);
  });

  it('tracks decade and bead for every decade step of all mystery groups', () => {
    for (const type of mysteryTypes) {
      const steps = buildRosarySequence(type);
      for (let decade = 1; decade <= 5; decade += 1) {
        const start = 7 + (decade - 1) * 13;
        expect(getRosaryProgress(steps[start])).toMatchObject({phase: 'decades', decadeNumber: decade});
        expect(getRosaryProgress(steps[start + 1])).toMatchObject({phase: 'decades', decadeNumber: decade});
        expect(getRosaryProgress(steps[start + 2])).toMatchObject({decadeNumber: decade, beadInDecade: 1});
        expect(getRosaryProgress(steps[start + 11])).toMatchObject({decadeNumber: decade, beadInDecade: 10});
        expect(getRosaryProgress(steps[start + 12])).toMatchObject({phase: 'decades', decadeNumber: decade});
        expect(getRosaryProgress(steps[start + 12]).beadInDecade).toBeUndefined();
      }
    }
  });

  it('classifies the final step as closing', () => {
    const steps = buildRosarySequence('dolorosos');
    expect(getRosaryProgress(steps[72])).toMatchObject({phase: 'closing', stepNumber: 73, totalSteps: 73});
  });
});
