'use client';

import {useEffect, useId, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {BookOpen, HelpCircle, X} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useIsMounted} from '@/hooks/useIsMounted';
import {usePreferencesStore} from '@/store/usePreferencesStore';

export function RosaryGuideDialog({
  open,
  onClose,
  returnFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
}) {
  const t = useTranslations('Rosary');
  const tCommon = useTranslations('Common');
  const titleId = useId();
  const modalRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const modal = modalRef.current;
    const trigger = returnFocusRef?.current ?? (document.activeElement as HTMLElement | null);
    closeButtonRef.current?.focus();

    const getFocusable = () =>
      modal
        ? Array.from(modal.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])'))
        : [];

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

  return createPortal(
    <div className="beta-overlay rosary-guide-overlay" onClick={onClose}>
      <section
        ref={modalRef}
        className="beta-modal rosary-guide-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="rosary-guide-header">
          <div className="rosary-guide-header-copy">
            <span className="eyebrow">{t('guideEyebrow')}</span>
            <h2 id={titleId} className="rosary-guide-title">{t('guideTitle')}</h2>
            <p className="rosary-guide-subtitle">{t('guideSubtitle')}</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="beta-close rosary-guide-close"
            onClick={onClose}
            aria-label={tCommon('close')}
          >
            <X size={18} />
          </button>
        </div>

        <div className="rosary-guide-body">
          <section className="rosary-guide-section">
            <h3>{t('guideWhatTitle')}</h3>
            <p>{t('guideWhatBody')}</p>
          </section>

          <blockquote className="rosary-guide-quote">
            <p>“{t('guideQuote')}”</p>
            <cite>— {t('guideQuoteSource')}</cite>
          </blockquote>

          <section className="rosary-guide-section">
            <h3>{t('guideWhyTitle')}</h3>
            <p>{t('guideWhyBody')}</p>
          </section>

          <section className="rosary-guide-section">
            <h3>{t('guideHowTitle')}</h3>
            <ol className="rosary-guide-steps">
              <li>
                <span className="rosary-guide-step-num" aria-hidden="true">I</span>
                <div>
                  <strong>{t('guideStep1Title')}</strong>
                  <p>{t('guideStep1Body')}</p>
                </div>
              </li>
              <li>
                <span className="rosary-guide-step-num" aria-hidden="true">II</span>
                <div>
                  <strong>{t('guideStep2Title')}</strong>
                  <p>{t('guideStep2Body')}</p>
                </div>
              </li>
              <li>
                <span className="rosary-guide-step-num" aria-hidden="true">III</span>
                <div>
                  <strong>{t('guideStep3Title')}</strong>
                  <p>{t('guideStep3Body')}</p>
                </div>
              </li>
            </ol>
          </section>

          <aside className="rosary-guide-welcome">
            <span className="rosary-guide-welcome-mark" aria-hidden="true">✢</span>
            <div>
              <h3>{t('guideWelcomeTitle')}</h3>
              <p>{t('guideWelcomeBody')}</p>
            </div>
          </aside>
        </div>

        <div className="rosary-guide-footer">
          <button type="button" className="button" onClick={onClose}>
            {t('guideCloseAction')}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  );
}

export function RosaryGuideTrigger({
  variant = 'quiet',
  className = '',
  focusRef,
}: {
  variant?: 'quiet' | 'secondary' | 'pill';
  className?: string;
  focusRef?: React.RefObject<HTMLButtonElement | null>;
}) {
  const t = useTranslations('Rosary');
  const dismissRosaryGuide = usePreferencesStore((state) => state.dismissRosaryGuide);
  const [open, setOpen] = useState(false);
  const localTriggerRef = useRef<HTMLButtonElement>(null);
  const triggerRef = focusRef ?? localTriggerRef;

  const handleOpen = () => {
    dismissRosaryGuide();
    setOpen(true);
  };

  const buttonClass =
    variant === 'secondary'
      ? `button button-secondary rosary-guide-trigger ${className}`.trim()
      : variant === 'pill'
        ? `rosary-guide-pill ${className}`.trim()
        : `button button-quiet rosary-guide-trigger ${className}`.trim();

  return (
    <>
      <button ref={triggerRef} type="button" className={buttonClass} onClick={handleOpen}>
        <HelpCircle size={15} aria-hidden="true" />
        <span>{t('guideTrigger')}</span>
      </button>
      <RosaryGuideDialog open={open} onClose={() => setOpen(false)} returnFocusRef={triggerRef} />
    </>
  );
}

export function RosaryGuidePrompt({
  returnFocusRef,
}: {
  returnFocusRef?: React.RefObject<HTMLElement | null>;
} = {}) {
  const t = useTranslations('Rosary');
  const mounted = useIsMounted();
  const rosaryGuideSeen = usePreferencesStore((state) => state.rosaryGuideSeen);
  const dismissRosaryGuide = usePreferencesStore((state) => state.dismissRosaryGuide);
  const [open, setOpen] = useState(false);
  const acceptRef = useRef<HTMLButtonElement>(null);
  const dialogReturnFocusRef = useRef<HTMLElement | null>(null);

  if (!mounted || (rosaryGuideSeen && !open)) return null;

  return (
    <>
      {!rosaryGuideSeen && (
        <aside className="rosary-guide-prompt" aria-label={t('guidePromptTitle')}>
          <div className="rosary-guide-prompt-copy">
            <span className="eyebrow">{t('guidePromptEyebrow')}</span>
            <h2 className="rosary-guide-prompt-title">{t('guidePromptTitle')}</h2>
            <p className="rosary-guide-prompt-body">{t('guidePromptBody')}</p>
          </div>
          <div className="rosary-guide-prompt-actions">
            <button
              ref={acceptRef}
              type="button"
              className="button button-small"
              onClick={() => {
                dialogReturnFocusRef.current = returnFocusRef?.current ?? acceptRef.current;
                dismissRosaryGuide();
                setOpen(true);
              }}
            >
              <BookOpen size={15} aria-hidden="true" />
              <span>{t('guidePromptAccept')}</span>
            </button>
            <button
              type="button"
              className="button button-quiet button-small"
              onClick={dismissRosaryGuide}
            >
              {t('guidePromptDismiss')}
            </button>
          </div>
        </aside>
      )}
      <RosaryGuideDialog open={open} onClose={() => setOpen(false)} returnFocusRef={dialogReturnFocusRef} />
    </>
  );
}
