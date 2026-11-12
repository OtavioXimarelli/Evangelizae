import {beforeEach, describe, expect, it, vi} from 'vitest';
import {cleanup, render} from '@testing-library/react';
import {fireEvent} from '@testing-library/react';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    values ? `${key} ${JSON.stringify(values)}` : key,
  useLocale: () => 'pt',
}));

import {buildRosarySequence} from '@/services/rosaryEngine';
import {RosaryRing} from '@/components/rosary/RosaryRing';

const steps = buildRosarySequence('gloriosos');

describe('RosaryRing', () => {
  const onSelectStep = vi.fn();

  beforeEach(() => {
    onSelectStep.mockClear();
    cleanup();
  });

  it('renders the full chain with cross and decade separators keyboard-focusable', () => {
    const {container} = render(
      <RosaryRing steps={steps} currentStepIndex={0} furthestStepIndex={0} onSelectStep={onSelectStep} />,
    );
    expect(container.querySelectorAll('.bead')).toHaveLength(61); // medal + 5×(pater+10 aves) + 5 tail beads
    expect(container.querySelectorAll('.rosary-ring [role="button"]')).toHaveLength(6); // cross + 5 separators
  });

  it('jumps to a decade announcement when its separator is clicked', () => {
    const {container} = render(
      <RosaryRing steps={steps} currentStepIndex={0} furthestStepIndex={40} onSelectStep={onSelectStep} />,
    );
    fireEvent.click(container.querySelector('[data-bead="pater-3"]')!);
    expect(onSelectStep).toHaveBeenCalledWith(33); // start of the 3rd decade
  });

  it('ignores clicks on beads beyond the furthest prayed step', () => {
    const {container} = render(
      <RosaryRing steps={steps} currentStepIndex={0} furthestStepIndex={0} onSelectStep={onSelectStep} />,
    );
    const pater = container.querySelector('[data-bead="pater-3"]')!;
    expect(pater).toHaveAttribute('data-disabled', 'true');
    fireEvent.click(pater);
    expect(onSelectStep).not.toHaveBeenCalled();
  });

  it('keeps the medal as a purely visual marker', () => {
    const {container} = render(
      <RosaryRing steps={steps} currentStepIndex={0} furthestStepIndex={0} onSelectStep={onSelectStep} />,
    );
    const medal = container.querySelector('[data-bead="medal"]')!;
    expect(medal).not.toHaveAttribute('role');
    fireEvent.click(medal);
    expect(onSelectStep).not.toHaveBeenCalled();
  });

  it('numbers only the beads of the active decade', () => {
    const {container} = render(
      <RosaryRing steps={steps} currentStepIndex={9} furthestStepIndex={9} onSelectStep={onSelectStep} />, // 1ª Ave Maria da 1ª década
    );
    expect(container.querySelectorAll('.bead-num')).toHaveLength(10);
    expect(container.querySelector('.bead-num[data-emphasis="true"]')).not.toBeNull();
  });
});
