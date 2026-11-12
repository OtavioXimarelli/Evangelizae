'use client';

import {useEffect, useId, useMemo, useRef} from 'react';
import {createPortal} from 'react-dom';
import {X} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {useRouter} from '@/i18n/routing';
import {ROSARY_MYSTERIES, type MysteryType, type RosaryStep} from '@/services/rosaryEngine';
import {RosaryRing} from '@/components/rosary/RosaryRing';

interface DecadeRow {
  number: number;
  name: string;
  fruit: string;
  first: number;
  last: number;
  state: 'future' | 'current' | 'complete';
}

export interface RosaryMapSheetProps {
  open: boolean;
  onClose: () => void;
  steps: RosaryStep[];
  activeMysteryType: MysteryType;
  currentStepIndex: number;
  furthestStepIndex: number;
  onSelectStep: (index: number) => void;
  returnFocusRef?: React.RefObject<HTMLButtonElement | null>;
}

/**
 * The whole Rosary chain, kept out of the prayer room's daily flow. It is the
 * one place where the person can look at all five mysteries, see the full
 * ring, jump between decades, or pause and return to the sanctuary.
 */
export function RosaryMapSheet({
  open,
  onClose,
  steps,
  activeMysteryType,
  currentStepIndex,
  furthestStepIndex,
  onSelectStep,
  returnFocusRef,
}: RosaryMapSheetProps) {
  const t = useTranslations('Rosary');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const titleId = useId();
  const modalRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const decades = useMemo<DecadeRow[]>(
    () => ROSARY_MYSTERIES[activeMysteryType].decades.map((mystery) => {
      const first = steps.findIndex((step) => step.id === `decade-${mystery.decadeNumber}-intro`);
      const last = steps.findIndex((step) => step.id === `decade-${mystery.decadeNumber}-glory`);
      return {
        number: mystery.decadeNumber,
        name: locale === 'en' ? mystery.nameEn : mystery.namePt,
        fruit: locale === 'en' ? mystery.fruitEn : mystery.fruitPt,
        first,
        last,
        state: currentStepIndex < first ? 'future' : currentStepIndex > last ? 'complete' : 'current',
      };
    }),
    [activeMysteryType, steps, currentStepIndex, locale],
  );

  useEffect(() => {
    if (!open) return;
    const modal = modalRef.current;
    const trigger = returnFocusRef?.current ?? (document.activeElement as HTMLElement | null);
    closeRef.current?.focus();

    const getFocusable = () =>
      modal ? Array.from(modal.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex]:not([tabindex="-1"])')) : [];

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== 'Tab') return;
      const current = getFocusable();
      if (current.length === 0) return;
      const first = current[0];
      const last = current[current.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      trigger?.focus();
    };
  }, [open, onClose, returnFocusRef]);

  if (!open || typeof document === 'undefined') return null;

  const jumpTo = (index: number) => {
    if (index < 0 || index > furthestStepIndex) return;
    onSelectStep(index);
    onClose();
  };

  return createPortal(
    <div className="beta-overlay rosary-map-overlay" onClick={onClose}>
      <section
        ref={modalRef}
        className="beta-modal rosary-map-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="rosary-map-sheet-head">
          <div>
            <span className="eyebrow">{t('mapEyebrow')}</span>
            <h2 id={titleId} className="rosary-map-sheet-title">{t('mapTitle')}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            className="beta-close"
            onClick={onClose}
            aria-label={tCommon('close')}
          >
            <X size={18} />
          </button>
        </div>

        <RosaryRing
          steps={steps}
          currentStepIndex={currentStepIndex}
          furthestStepIndex={furthestStepIndex}
          onSelectStep={jumpTo}
        />

        <ol className="rosary-map-decades">
          {decades.map((decade) => {
            const locked = decade.first > furthestStepIndex;
            return (
              <li key={decade.number}>
                <button
                  type="button"
                  className="rosary-map-decade"
                  data-state={decade.state}
                  disabled={locked}
                  onClick={() => jumpTo(decade.first)}
                  aria-current={decade.state === 'current' ? 'step' : undefined}
                >
                  <span className="rosary-map-decade-num" aria-hidden="true">{decade.number}</span>
                  <span className="rosary-map-decade-copy">
                    <strong>{decade.name}</strong>
                    <span className="rosary-map-decade-fruit">{t('fruit')} · {decade.fruit}</span>
                  </span>
                  {decade.state === 'current' && <span className="rosary-map-decade-state">{t('mapCurrent')}</span>}
                  {decade.state === 'complete' && <span className="rosary-map-decade-state">{t('mapComplete')}</span>}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="rosary-map-sheet-foot">
          <button type="button" className="button button-secondary" onClick={() => router.push('/sanctuary')}>
            {t('pauseAction')}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
