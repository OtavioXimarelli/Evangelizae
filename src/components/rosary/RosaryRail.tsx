'use client';

import {useMemo} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import type {RosaryStep} from '@/services/rosaryEngine';
import {getRosaryProgress} from '@/services/rosaryProgress';

type BeadState = 'future' | 'current' | 'complete';

interface RailSegment {
  number: number;
  state: BeadState;
  /** 0–1 fraction of the decade already prayed. */
  fill: number;
}

interface RailBead {
  key: string;
  stepIndex: number;
  label: string;
  state: BeadState;
  /** The Our Father bead is drawn slightly larger. */
  ourFather?: boolean;
}

export interface RosaryRailProps {
  steps: RosaryStep[];
  currentStepIndex: number;
  furthestStepIndex: number;
  onSelectStep: (index: number) => void;
  /** Human-facing decade or phase name, computed by the page. */
  phaseLabel: string;
  /** e.g. "Ave Maria 4 de 10", when the current step is a bead. */
  beadLabel: string | null;
  /** Which devotion the rail renders. Defaults to the Rosary. */
  devotion?: import('@/services/rosaryEngine').DevotionType;
  /** Number of rail segments. Defaults to 5 (Rosary). */
  segments?: number;
  /** Beads per group (decade) for non-Rosary devotions. Defaults to 10. */
  beadsPerGroup?: number;
  /** Number of opening steps (shown as beads) for non-Rosary devotions. */
  openingSteps?: number;
  /** Number of closing steps (shown as beads) for non-Rosary devotions. */
  closingSteps?: number;
}

const OPENING_LAST_INDEX = 6;

/** Drops the trailing parenthesis that repeats the decade in step titles. */
function shortTitle(title: string): string {
  return title.replace(/\s*\([^)]*\)\s*$/, '');
}

/**
 * The Rosary's orientation band for the prayer room: five decade segments
 * (the whole Rosary at a glance, exposed as a progressbar for assistive
 * technology) and the beads of the decade being prayed, which double as
 * jump targets back to an already-prayed prayer.
 *
 * Presentational only: it reads the canonical sequence built by
 * `buildRosarySequence` and never changes step semantics.
 */
export function RosaryRail({
  steps,
  currentStepIndex,
  furthestStepIndex,
  onSelectStep,
  phaseLabel,
  beadLabel,
  devotion = 'rosario',
  segments = 5,
  beadsPerGroup = 10,
  openingSteps = 6,
  closingSteps = 1,
}: RosaryRailProps) {
  const t = useTranslations('Rosary');
  const locale = useLocale();

  const progress = getRosaryProgress(steps[currentStepIndex], devotion);

  const segmentPrefix = devotion === 'rosario' ? 'decade' : `${devotion}-group`;
  const segmentsList = useMemo(() => Array.from({length: segments}, (_, i) => i + 1), [segments]);

  const railSegments = useMemo<RailSegment[]>(() => {
    return segmentsList.map((number) => {
      const first = steps.findIndex((step) => step.id === `${segmentPrefix}-${number}-intro`);
      const prefix = `${segmentPrefix}-${number}-`;
      let last = -1;
      for (let i = steps.length - 1; i >= 0; i -= 1) {
        if (steps[i].id.startsWith(prefix)) { last = i; break; }
      }
      const span = last - first + 1;
      const fill = currentStepIndex < first ? 0 : currentStepIndex >= last ? 1 : (currentStepIndex - first + 1) / span;
      return {
        number,
        state: currentStepIndex < first ? 'future' : currentStepIndex > last ? 'complete' : 'current',
        fill,
      };
    });
  }, [steps, currentStepIndex, segmentsList, segmentPrefix]);

  const beads = useMemo<RailBead[]>(() => {
    if (devotion !== 'rosario') {
      const stateOf = (index: number): BeadState =>
        index === currentStepIndex ? 'current' : index < currentStepIndex ? 'complete' : 'future';
      const titleOf = (index: number) => shortTitle(locale === 'en' ? steps[index].titleEn : steps[index].titlePt);
      const result: RailBead[] = [];

      if (progress.phase === 'opening') {
        for (let index = 0; index < Math.min(openingSteps, steps.length); index += 1) {
          result.push({ key: `opening-${index}`, stepIndex: index, label: titleOf(index), state: stateOf(index) });
        }
        return result;
      }

      if (progress.phase === 'closing') {
        const start = Math.max(0, steps.length - closingSteps);
        for (let index = start; index < steps.length; index += 1) {
          result.push({ key: `closing-${index}`, stepIndex: index, label: titleOf(index), state: stateOf(index) });
        }
        return result;
      }

      const decade = progress.decadeNumber ?? 1;
      const prefix = `${devotion}-group`;
      const first = steps.findIndex((step) => step.id === `${prefix}-${decade}-intro`);
      if (first < 0) return result;
      for (let bead = 0; bead < beadsPerGroup; bead += 1) {
        const index = first + bead;
        if (index >= steps.length) break;
        result.push({
          key: `${devotion}-${decade}-${bead}`,
          stepIndex: index,
          label: titleOf(index),
          state: stateOf(index),
          ourFather: bead === 0,
        });
      }
      return result;
    }
    const indexOf = (id: string) => steps.findIndex((step) => step.id === id);
    const stateOf = (index: number): BeadState =>
      index === currentStepIndex ? 'current' : index < currentStepIndex ? 'complete' : 'future';
    const titleOf = (index: number) => shortTitle(locale === 'en' ? steps[index].titleEn : steps[index].titlePt);
    const result: RailBead[] = [];

    if (progress.phase === 'opening') {
      for (let index = 0; index <= OPENING_LAST_INDEX; index += 1) {
        const isOpeningHailMary = index >= 3 && index <= 5;
        result.push({
          key: `opening-${index}`,
          stepIndex: index,
          label: isOpeningHailMary ? t('openingHailMaryOf', {current: index - 2}) : titleOf(index),
          state: stateOf(index),
        });
      }
      return result;
    }

    if (progress.phase === 'closing') {
      const salve = indexOf('closing-salve-regina');
      if (salve >= 0) {
        result.push({key: 'closing', stepIndex: salve, label: titleOf(salve), state: stateOf(salve)});
      }
      return result;
    }

    const decade = progress.decadeNumber ?? 1;
    const ourFather = indexOf(`decade-${decade}-our-father`);
    result.push({
      key: `pater-${decade}`,
      stepIndex: ourFather,
      label: shortTitle(locale === 'en' ? steps[ourFather].titleEn : steps[ourFather].titlePt),
      state: stateOf(ourFather),
      ourFather: true,
    });
    for (let bead = 1; bead <= 10; bead += 1) {
      const index = ourFather + bead;
      result.push({
        key: `ave-${decade}-${bead}`,
        stepIndex: index,
        label: t('hailMaryOf', {current: bead, total: 10}),
        state: stateOf(index),
      });
    }
    return result;
  }, [steps, currentStepIndex, locale, progress.phase, progress.decadeNumber, t, devotion, beadsPerGroup, openingSteps, closingSteps]);

  return (
    <div className="rosary-rail">
      <div
        className="rosary-rail-track"
        role="progressbar"
        aria-label={t('progress', {current: progress.stepNumber, total: progress.totalSteps})}
        aria-valuemin={1}
        aria-valuemax={progress.totalSteps}
        aria-valuenow={progress.stepNumber}
      >
        {railSegments.map((segment) => (
          <span key={segment.number} className="rosary-rail-seg" data-state={segment.state}>
            <span style={{width: `${Math.round(segment.fill * 100)}%`}} />
          </span>
        ))}
      </div>

      <div className="rosary-rail-meta">
        <p className="rosary-rail-phase">{phaseLabel}</p>
        <p className="rosary-rail-count" aria-hidden="true">
          {progress.stepNumber}/{progress.totalSteps}
        </p>
        {beadLabel && <p className="rosary-rail-bead">{beadLabel}</p>}
      </div>

      <ol className="rosary-beads" aria-label={t('beadsLabel')}>
        {beads.map((bead) => {
          const canJump = bead.state === 'complete' && bead.stepIndex <= furthestStepIndex;
          return (
            <li key={bead.key} aria-current={bead.state === 'current' ? 'step' : undefined}>
              {canJump ? (
                <button
                  type="button"
                  className="bead-marker"
                  data-state={bead.state}
                  data-our-father={bead.ourFather || undefined}
                  aria-label={bead.label}
                  onClick={() => onSelectStep(bead.stepIndex)}
                >
                  <span className="bead-dot" aria-hidden="true" />
                </button>
              ) : (
                <span
                  className="bead-marker"
                  data-state={bead.state}
                  data-our-father={bead.ourFather || undefined}
                  aria-label={bead.state === 'current' ? bead.label : undefined}
                  aria-hidden={bead.state === 'future' ? true : undefined}
                >
                  <span className="bead-dot" aria-hidden="true" />
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
