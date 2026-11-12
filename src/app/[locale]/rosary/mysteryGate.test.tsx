
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
  BookOpen: () => null,
  HelpCircle: () => null,
  X: () => null,
}));

vi.mock('@/hooks/useDayContext', () => ({
  useDayContext: () => ({mystery: 'gloriosos'}),
}));

import {MysteryGate} from '@/components/rosary/MysteryGate';

describe('MysteryGate', () => {
  beforeEach(() => {
    initRosary.mockClear();
    cleanup();
  });

  it('renders the primary CTA and starts today’s mysteries on click', async () => {
    render(<MysteryGate todayMystery="gloriosos" />);
    const cta = screen.getByRole('button', {name: 'prayTodayAction'});
    expect(cta).toHaveClass('button', 'mystery-gate-cta');
    await userEvent.click(cta);
    expect(initRosary).toHaveBeenCalledWith('rosario', 'gloriosos');
  });

  it('renders the Rosary guide trigger and opens the modal when clicked', async () => {
    render(<MysteryGate todayMystery="gloriosos" />);
    const trigger = screen.getByRole('button', {name: 'guideTrigger'});
    await userEvent.click(trigger);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('guideTitle')).toBeInTheDocument();
  });

  it('illuminates today’s mysteries with their theme and day', () => {
    render(<MysteryGate todayMystery="gloriosos" />);
    expect(screen.getByText('todayBadge')).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Mistérios Gloriosos'})).toBeInTheDocument();
    expect(screen.getByText('A Ressurreição e Glória')).toBeInTheDocument();
    expect(screen.getByText('domingo e quarta-feira', {selector: '.gate-today-days'})).toBeInTheDocument();
  });

  it('lists the other three sets visibly, without repeating today', () => {
    const {container} = render(<MysteryGate todayMystery="gloriosos" />);
    expect(screen.getByRole('heading', {name: 'gateOtherTitle'})).toBeInTheDocument();
    const options = container.querySelectorAll('.mystery-gate-option');
    expect(options).toHaveLength(3);
    expect(screen.queryByRole('button', {name: /Mistérios Gloriosos/})).not.toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Mistérios Gozosos/})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Mistérios Luminosos/})).toBeInTheDocument();
    expect(screen.getByRole('button', {name: /Mistérios Dolorosos/})).toBeInTheDocument();
  });

  it('starts the chosen alternative set from its row', async () => {
    render(<MysteryGate todayMystery="gloriosos" />);
    await userEvent.click(screen.getByRole('button', {name: /Mistérios Dolorosos/}));
    expect(initRosary).toHaveBeenCalledWith('rosario', 'dolorosos');
  });
});
