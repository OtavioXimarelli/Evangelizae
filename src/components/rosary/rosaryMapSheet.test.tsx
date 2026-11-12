import {beforeEach, describe, expect, it, vi} from 'vitest';
import {cleanup, fireEvent, render} from '@testing-library/react';

const pushMock = vi.fn();

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string, values?: Record<string, unknown>) =>
    values ? `${key} ${JSON.stringify(values)}` : key,
  useLocale: () => 'pt',
}));

vi.mock('@/i18n/routing', () => ({
  useRouter: () => ({push: pushMock}),
}));

import {buildRosarySequence} from '@/services/rosaryEngine';
import {RosaryMapSheet} from '@/components/rosary/RosaryMapSheet';

const steps = buildRosarySequence('gloriosos');
const indexOf = (id: string) => steps.findIndex((step) => step.id === id);

const renderSheet = (currentStepIndex: number, furthestStepIndex = currentStepIndex) => {
  const onClose = vi.fn();
  const onSelectStep = vi.fn();
  const utils = render(
    <RosaryMapSheet
      open
      onClose={onClose}
      steps={steps}
      activeMysteryType="gloriosos"
      currentStepIndex={currentStepIndex}
      furthestStepIndex={furthestStepIndex}
      onSelectStep={onSelectStep}
    />,
  );
  const decades = () => Array.from(document.querySelectorAll<HTMLButtonElement>('.rosary-map-decade'));
  return {...utils, onClose, onSelectStep, decades};
};

describe('RosaryMapSheet', () => {
  beforeEach(() => {
    pushMock.mockClear();
    cleanup();
  });

  it('lists the five mysteries with their fruit', () => {
    const {decades} = renderSheet(0);
    expect(decades()).toHaveLength(5);
    expect(decades()[0].textContent).toContain('fruit');
    expect(decades()[0].textContent).toContain(steps[indexOf('decade-1-intro')].mystery!.fruitPt);
  });

  it('locks decades that were never reached', () => {
    const {decades} = renderSheet(0, 0);
    expect(decades().every((decade) => decade.disabled)).toBe(true);
  });

  it('jumps to a reached decade and closes the map', () => {
    const third = indexOf('decade-3-intro');
    const {decades, onClose, onSelectStep} = renderSheet(7, third);
    expect(decades().map((decade) => decade.disabled)).toEqual([false, false, false, true, true]);
    fireEvent.click(decades()[2]);
    expect(onSelectStep).toHaveBeenCalledWith(third);
    expect(onClose).toHaveBeenCalled();
  });

  it('returns to the sanctuary when pausing', () => {
    const {getByRole} = renderSheet(0);
    fireEvent.click(getByRole('button', {name: 'pauseAction'}));
    expect(pushMock).toHaveBeenCalledWith('/sanctuary');
  });
});
