'use client';

import {useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import {useTranslations} from 'next-intl';

/**
 * Confirmation before the Rosary is marked as complete. The final step used
 * to complete in a single click with no way back; this dialog keeps the
 * closing deliberate without interrupting the prayer until the very end.
 */
export function FinishRosaryDialog({
  open,
  onClose,
  onConfirm,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  returnFocusRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  const t = useTranslations('Rosary');
  const confirmRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!open) return;
    const modal = modalRef.current;
    const trigger = returnFocusRef?.current ?? (document.activeElement as HTMLElement | null);
    confirmRef.current?.focus();

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

  if (!open) return null;

  return createPortal(
    <div className="beta-overlay" onClick={onClose}>
      <section
        ref={modalRef}
        className="beta-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="finish-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="finish-dialog-title" className="exit-dialog-title">{t('finishConfirmTitle')}</h2>
        <p className="exit-dialog-body">{t('finishConfirmBody')}</p>
        <div className="exit-actions">
          <button ref={confirmRef} type="button" className="button" onClick={onConfirm}>{t('finishConfirmAction')}</button>
          <button type="button" className="button button-secondary" onClick={onClose}>{t('finishCancelAction')}</button>
        </div>
      </section>
    </div>,
    document.body,
  );
}
