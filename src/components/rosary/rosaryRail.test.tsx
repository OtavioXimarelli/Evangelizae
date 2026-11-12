import {beforeEach, describe, expect, it, vi} from 'vitest';
import {cleanup, fireEvent, render} from '@testing-library/react';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    values ? `${key} ${JSON.stringify(values)}` : key,
  useLocale: () => 'pt',
}));

import {buildRosarySequence} from '@/services/rosaryEngine';
import {RosaryRail} from '@/components/rosary/RosaryRail';

const steps = buildRosarySequence('gloriosos');
const indexOf = (id: string) => steps.findIndex((step) => step.id === id);

const renderRail = (currentStepIndex: number, furthestStepIndex = currentStepIndex) =>
  render(
    <RosaryRail
      steps={steps}
      currentStepIndex={currentStepIndex}
      furthestStepIndex={furthestStepIndex}
      onSelectStep={onSelectStep}
      phaseLabel="Abertura"
      beadLabel={null}
    />,
  );

const onSelectStep = vi.fn();

describe('RosaryRail', () => {
  beforeEach(() => {
    onSelectStep.mockClear();
    cleanup();
  });

  it('exposes the canonical step count as a progressbar', () => {
    const {getByRole} = renderRail(0);
    const bar = getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuemin', '1');
    expect(bar).toHaveAttribute('aria-valuemax', '73');
    expect(bar).toHaveAttribute('aria-valuenow', '1');
    expect(bar).toHaveAttribute('aria-label', 'progress {"current":1,"total":73}');
  });

  it('renders the seven opening prayers and keeps them in place', () => {
    const {container} = renderRail(4);
    expect(container.querySelectorAll('.bead-marker')).toHaveLength(7);
    expect(container.querySelectorAll('.bead-marker[data-our-father]')).toHaveLength(0);
    expect(container.querySelector('li[aria-current="step"] .bead-marker[data-state="current"]')).not.toBeNull();
  });

  it('renders the Our Father and ten Hail Marys of the current decade', () => {
    const first = indexOf('decade-1-our-father');
    const {container} = renderRail(first + 3);
    expect(container.querySelectorAll('.bead-marker')).toHaveLength(11);
    expect(container.querySelectorAll('.bead-marker[data-our-father]')).toHaveLength(1);
    expect(container.querySelectorAll('.bead-marker[data-state="complete"]')).toHaveLength(3);
    expect(container.querySelectorAll('.bead-marker[data-state="future"]')).toHaveLength(7);
  });

  it('renders only the Salve Regina in the closing phase', () => {
    const {container} = renderRail(steps.length - 1);
    expect(container.querySelectorAll('.bead-marker')).toHaveLength(1);
    expect(container.querySelector('li[aria-current="step"] .bead-marker')).not.toBeNull();
  });

  it('jumps back to an already prayed bead', () => {
    const first = indexOf('decade-1-our-father');
    const {container} = renderRail(first + 4);
    fireEvent.click(container.querySelectorAll('button.bead-marker')[0]);
    expect(onSelectStep).toHaveBeenCalledWith(first);
  });

  it('never offers a jump beyond the furthest prayed step', () => {
    const first = indexOf('decade-1-our-father');
    const {container} = renderRail(first + 4, first + 4);
    // Beads ahead of the current one are not interactive.
    expect(container.querySelectorAll('button.bead-marker')).toHaveLength(4);
  });

  it('fills the five segments according to the current decade', () => {
    const secondDecade = indexOf('decade-2-intro');
    const lastDecade = indexOf('decade-5-glory');
    const {container, rerender} = renderRail(indexOf('decade-1-intro'));
    const state = () => Array.from(container.querySelectorAll('.rosary-rail-seg')).map((seg) => seg.getAttribute('data-state'));
    expect(state()).toEqual(['current', 'future', 'future', 'future', 'future']);

    rerender(
      <RosaryRail
        steps={steps}
        currentStepIndex={secondDecade}
        furthestStepIndex={lastDecade}
        onSelectStep={onSelectStep}
        phaseLabel="2º mistério"
        beadLabel={null}
      />,
    );
    expect(state()).toEqual(['complete', 'current', 'future', 'future', 'future']);

    rerender(
      <RosaryRail
        steps={steps}
        currentStepIndex={lastDecade}
        furthestStepIndex={lastDecade}
        onSelectStep={onSelectStep}
        phaseLabel="5º mistério"
        beadLabel={null}
      />,
    );
    expect(state()).toEqual(['complete', 'complete', 'complete', 'complete', 'current']);

    rerender(
      <RosaryRail
        steps={steps}
        currentStepIndex={steps.length - 1}
        furthestStepIndex={lastDecade}
        onSelectStep={onSelectStep}
        phaseLabel="Encerramento"
        beadLabel={null}
      />,
    );
    expect(state()).toEqual(['complete', 'complete', 'complete', 'complete', 'complete']);
  });

  it('shows the phase and bead labels it receives', () => {
    const first = indexOf('decade-1-our-father');
    const {getByText, rerender} = render(
      <RosaryRail
        steps={steps}
        currentStepIndex={first + 3}
        furthestStepIndex={first + 3}
        onSelectStep={onSelectStep}
        phaseLabel="1º mistério — A Anunciação"
        beadLabel="Ave Maria 3 de 10"
      />,
    );
    expect(getByText('1º mistério — A Anunciação')).toBeInTheDocument();
    expect(getByText('Ave Maria 3 de 10')).toBeInTheDocument();

    rerender(
      <RosaryRail
        steps={steps}
        currentStepIndex={0}
        furthestStepIndex={0}
        onSelectStep={onSelectStep}
        phaseLabel="Abertura"
        beadLabel={null}
      />,
    );
    expect(getByText('Abertura')).toBeInTheDocument();
  });
});
