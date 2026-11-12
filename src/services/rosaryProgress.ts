import type {DevotionType, RosaryStep} from './rosaryEngine';

export type RosaryPhase = 'opening' | 'decades' | 'closing';

export interface RosaryProgress {
  /** Where the step sits in the Rosary structure. */
  phase: RosaryPhase;
  /** 1-based step number within the 73-step sequence. */
  stepNumber: number;
  /** Total steps of the sequence (73). */
  totalSteps: number;
  /** 1–5, only while inside a decade. */
  decadeNumber?: number;
  /** 1–10, only on the decade Hail Mary steps. */
  beadInDecade?: number;
  /** 1–3, only on the opening Hail Mary steps. */
  openingHailMary?: number;
}

const OPENING_TYPES: ReadonlySet<string> = new Set([
  'sign_of_cross',
  'creed',
  'our_father_pope',
  'three_hail_marys',
  'glory_be_fatima',
]);

/**
 * Derives human-facing progress metadata from a single step of the
 * canonical sequence built by `buildRosarySequence`. Pure presentation
 * data: it never changes the 73-step semantics of the engine.
 */
export function getRosaryProgress(step: RosaryStep, devotion: DevotionType = 'rosario'): RosaryProgress {
  if (devotion !== 'rosario') {
    const openingCount = devotion === 'sao_jose' ? 6 : 1; // cross, creed, OF, 3 HM | opening prayer
    const closingCount = devotion === 'sao_jose' ? 3 : 3; // glory, litany, oremos | closing prayer + 2 jaculatories
    const phase: RosaryPhase =
      step.stepNumber <= openingCount ? 'opening' :
      step.stepNumber > step.totalSteps - closingCount ? 'closing' : 'decades';
    const progress: RosaryProgress = { phase, stepNumber: step.stepNumber, totalSteps: step.totalSteps };
    if (phase === 'decades') {
      // group size: sao_jose 11 (1 large + 10 small), lagrimas 8 (1 large + 7 small)
      const groupSize = devotion === 'sao_jose' ? 11 : 8;
      const group = Math.floor((step.stepNumber - openingCount - 1) / groupSize) + 1;
      const bead = ((step.stepNumber - openingCount - 1) % groupSize) + 1;
      progress.decadeNumber = Math.min(group, devotion === 'sao_jose' ? 5 : 7);
      if (bead >= 1) progress.beadInDecade = bead; // bead 1 = large bead
    }
    return progress;
  }
  const phase: RosaryPhase = step.type === 'salve_regina' ? 'closing' : OPENING_TYPES.has(step.type) ? 'opening' : 'decades';
  const progress: RosaryProgress = {
    phase,
    stepNumber: step.stepNumber,
    totalSteps: step.totalSteps,
  };
  if (phase === 'decades') progress.decadeNumber = step.decadeNumber;
  if (step.type === 'decade_hail_mary') progress.beadInDecade = step.beadInDecade;
  // The opening Hail Marys are steps 4, 5 and 6 of the canonical sequence.
  if (step.type === 'three_hail_marys') progress.openingHailMary = step.stepNumber - 3;
  return progress;
}
