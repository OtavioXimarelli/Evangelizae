
import {beforeEach, describe, expect, it, vi} from 'vitest';
import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const initRosary = vi.fn();

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'pt',
}));

vi.mock('@/store/usePrayerStore', () => ({
  usePrayerStore: () => ({initRosary}),
}));

vi.mock('@/i18n/routing', () => ({
  Link: () => null,
}));

vi.mock('lucide-react', () => ({
  ArrowLeft: () => null,
  ArrowRight: () => null,
}));

vi.mock('@/hooks/useDayContext', () => ({
  useDayContext: () => ({mystery: 'gloriosos'}),
}));

import {MysteryGate} from '@/components/rosary/MysteryGate';

describe('MysteryGate primary CTA', () => {
  beforeEach(() => {
    initRosary.mockClear();
    cleanup();
  });

  it('renders the primary CTA and starts today’s mysteries on click', async () => {
    render(<MysteryGate todayMystery="gloriosos" />);
    const cta = screen.getByRole('button', {name: 'prayTodayAction'});
    expect(cta).toHaveClass('button', 'mystery-gate-cta');
    await userEvent.click(cta);
    expect(initRosary).toHaveBeenCalledWith('gloriosos');
  });
});
