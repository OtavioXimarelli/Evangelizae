'use client';

import {useMemo} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import type {RosaryStep} from '@/services/rosaryEngine';

const CENTER_X = 120;
const CENTER_Y = 118;
const RING_RADIUS = 76;
const SLOT_COUNT = 56; // medal + 5 decades × (Pai-Nosso + 10 Ave-Marias)
const TAIL_X = CENTER_X;

type BeadState = 'future' | 'current' | 'complete';

interface RingBead {
  key: string;
  cx: number;
  cy: number;
  r: number;
  state: BeadState;
  /** Step the bead jumps to when clicked; null when purely visual. */
  selectStep: number | null;
  /** Accessible label: only keyboard-focusable beads carry one. */
  focusLabel?: string;
  ariaCurrent?: boolean;
  /** Number rendered inside the bead, for the active decade's Ave-Marias. */
  number?: string;
  emphasis?: boolean;
}

export interface RosaryRingProps {
  steps: RosaryStep[];
  currentStepIndex: number;
  furthestStepIndex: number;
  onSelectStep: (index: number) => void;
}

function slotPosition(slot: number): {cx: number; cy: number} {
  const angle = ((90 + (slot * 360) / SLOT_COUNT) * Math.PI) / 180;
  return {cx: CENTER_X + RING_RADIUS * Math.cos(angle), cy: CENTER_Y + RING_RADIUS * Math.sin(angle)};
}

/**
 * The whole Rosary chain as a quiet visual map: crucifix and opening beads
 * on the tail, the medal at the junction, and five decades around the ring.
 * It replaces the former decade strip and in-decade bead line, which showed
 * progress twice without ever naming where the person was.
 */
export function RosaryRing({steps, currentStepIndex, furthestStepIndex, onSelectStep}: RosaryRingProps) {
  const t = useTranslations('Rosary');
  const locale = useLocale();

  const beads = useMemo<RingBead[]>(() => {
    const indexOf = (id: string) => steps.findIndex((step) => step.id === id);
    const introIndexes = [1, 2, 3, 4, 5].map((decade) => indexOf(`decade-${decade}-intro`));
    const salveIndex = indexOf('closing-salve-regina');

    const stateOf = (min: number, max: number): BeadState =>
      currentStepIndex >= min && currentStepIndex <= max ? 'current' : currentStepIndex > max ? 'complete' : 'future';

    const medalCurrent = currentStepIndex === salveIndex || introIndexes.includes(currentStepIndex);
    const lastIntro = Math.max(...introIndexes);
    const medalState: BeadState = medalCurrent ? 'current' : currentStepIndex > lastIntro ? 'complete' : 'future';

    const result: RingBead[] = [
      {key: 'medal', ...slotPosition(0), r: 5.4, state: medalState, selectStep: null},
    ];

    for (let decade = 1; decade <= 5; decade += 1) {
      const intro = introIndexes[decade - 1];
      const pater = indexOf(`decade-${decade}-our-father`);
      const glory = indexOf(`decade-${decade}-glory`);
      const mystery = steps[intro]?.mystery;
      const decadeName = mystery ? (locale === 'en' ? mystery.nameEn : mystery.namePt) : '';
      const inDecade = currentStepIndex >= intro && currentStepIndex <= glory;

      result.push({
        key: `pater-${decade}`,
        ...slotPosition(1 + (decade - 1) * 11),
        r: 4.2,
        // The separator bead stays lit from the Our Father through the Glory Be.
        state: stateOf(pater, glory),
        // Jumping to a decade lands on its mystery announcement, like the old strip.
        selectStep: intro,
        focusLabel: t('ringDecadeLabel', {number: decade, name: decadeName}),
        ariaCurrent: inDecade || undefined,
      });

      for (let bead = 1; bead <= 10; bead += 1) {
        const stepIndex = pater + bead;
        result.push({
          key: `ave-${decade}-${bead}`,
          ...slotPosition(1 + (decade - 1) * 11 + bead),
          r: 3.2,
          state: stateOf(stepIndex, stepIndex),
          selectStep: stepIndex,
          number: inDecade ? String(bead) : undefined,
          emphasis: inDecade && steps[currentStepIndex]?.beadInDecade === bead,
        });
      }
    }

    // Tail: from the medal down — Glória, three Ave-Marias, Pai-Nosso, Cruz.
    const tail: ReadonlyArray<{key: string; id: string; cy: number; r: number}> = [
      {key: 'tail-glory', id: 'intro-glory', cy: 212, r: 4},
      {key: 'tail-ave-1', id: 'intro-hail-mary-1', cy: 228, r: 3.2},
      {key: 'tail-ave-2', id: 'intro-hail-mary-2', cy: 243, r: 3.2},
      {key: 'tail-ave-3', id: 'intro-hail-mary-3', cy: 258, r: 3.2},
      {key: 'tail-pater', id: 'intro-our-father', cy: 273, r: 4.2},
    ];
    for (const entry of tail) {
      const stepIndex = indexOf(entry.id);
      result.push({key: entry.key, cx: TAIL_X, cy: entry.cy, r: entry.r, state: stateOf(stepIndex, stepIndex), selectStep: stepIndex});
    }

    result.push({
      key: 'cross',
      cx: TAIL_X,
      cy: 296,
      r: 6,
      state: stateOf(0, 1),
      selectStep: 0,
      focusLabel: t('ringCrossLabel'),
    });

    return result;
  }, [steps, currentStepIndex, locale, t]);

  const selectBead = (bead: RingBead, disabled: boolean) => {
    if (!disabled && bead.selectStep !== null) onSelectStep(bead.selectStep);
  };

  const onBeadKeyDown = (bead: RingBead, disabled: boolean) => (event: React.KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    selectBead(bead, disabled);
  };

  return (
    <svg className="rosary-ring" viewBox="0 0 240 320" role="group" aria-label={t('ringLabel')}>
      <circle className="rosary-chain" cx={CENTER_X} cy={CENTER_Y} r={RING_RADIUS} />
      <line className="rosary-chain" x1={TAIL_X} y1={CENTER_Y + RING_RADIUS} x2={TAIL_X} y2={286} />
      {beads.map((bead) => {
        const disabled = bead.selectStep === null || bead.selectStep > furthestStepIndex;
        if (bead.key === 'cross') {
          return (
            <g
              key={bead.key}
              className="bead-cross"
              data-state={bead.state}
              role="button"
              tabIndex={0}
              aria-label={bead.focusLabel}
              aria-disabled={disabled || undefined}
              onClick={() => selectBead(bead, disabled)}
              onKeyDown={onBeadKeyDown(bead, disabled)}
            >
              <line className="bead-cross-line" x1={TAIL_X} y1={286} x2={TAIL_X} y2={306} />
              <line className="bead-cross-line" x1={TAIL_X - 7} y1={294} x2={TAIL_X + 7} y2={294} />
            </g>
          );
        }
        const clickable = bead.selectStep !== null;
        const classes = ['bead', clickable ? 'bead-clickable' : '', bead.key === 'medal' ? 'bead-medal' : ''].filter(Boolean).join(' ');
        return (
          <g key={bead.key}>
            <circle
              className={classes}
              data-bead={bead.key}
              data-state={bead.state}
              data-disabled={clickable && disabled ? 'true' : undefined}
              role={bead.focusLabel ? 'button' : undefined}
              tabIndex={bead.focusLabel ? 0 : undefined}
              aria-label={bead.focusLabel}
              aria-current={bead.ariaCurrent ? 'step' : undefined}
              aria-disabled={bead.focusLabel && disabled ? 'true' : undefined}
              cx={bead.cx}
              cy={bead.cy}
              r={bead.r}
              onClick={clickable ? () => selectBead(bead, disabled) : undefined}
              onKeyDown={bead.focusLabel ? onBeadKeyDown(bead, disabled) : undefined}
            />
            {/* The drawn bead is a few pixels wide once scaled; this invisible
                pad makes the clickable ones reachable by thumb on touchscreens. */}
            {clickable && (
              <circle className="bead-hit" cx={bead.cx} cy={bead.cy} r={bead.r + 4.5} aria-hidden="true" onClick={() => selectBead(bead, disabled)} />
            )}
            {bead.number && (
              <text className="bead-num" data-emphasis={bead.emphasis ? 'true' : undefined} x={bead.cx} y={bead.cy} aria-hidden="true">
                {bead.number}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
