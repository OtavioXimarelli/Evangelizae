'use client';

import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {ArrowLeft} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {Link, useRouter} from '@/i18n/routing';
import {usePrayerStore} from '@/store/usePrayerStore';

export function ExitPrayerControl({hasActiveSession}: {hasActiveSession: boolean}) {
  const t = useTranslations('Rosary');
  const tNav = useTranslations('Navigation');
  const router = useRouter();
  const discardSession = usePrayerStore((state) => state.discardSession);
  const [open, setOpen] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const modal = modalRef.current;
    const trigger = triggerRef.current;
    confirmRef.current?.focus();
    const getFocusable = () => modal ? Array.from(modal.querySelectorAll<HTMLElement>('button:not(:disabled), [tabindex]:not([tabindex="-1"])')) : [];
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        trigger?.focus();
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
  }, [open]);

  if (!hasActiveSession) {
    return <Link href="/sanctuary" className="focus-exit"><ArrowLeft size={16} aria-hidden="true" /><span>{tNav('backToSanctuary')}</span></Link>;
  }

  return (
    <>
      <button ref={triggerRef} type="button" className="focus-exit" onClick={() => setOpen(true)}>
        <ArrowLeft size={16} aria-hidden="true" />
        <span>{tNav('leavePrayer')}</span>
      </button>

      {open && createPortal(
        <div className="beta-overlay" onClick={() => setOpen(false)}>
          <section
            ref={modalRef}
            className="beta-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="exit-dialog-title" className="beta-title">{t('exitTitle')}</h2>
            <p className="beta-body">{t('exitBody')}</p>
            <div className="exit-actions">
              <button type="button" ref={confirmRef} className="button" onClick={() => { setOpen(false); router.push('/sanctuary'); }}>{t('exitSave')}</button>
              <button type="button" className="button button-secondary" onClick={() => { discardSession(); router.push('/sanctuary'); }}>{t('exitDiscard')}</button>
              <button type="button" className="text-link exit-keep" onClick={() => setOpen(false)}>{t('exitKeep')}</button>
            </div>
          </section>
        </div>,
        document.body,
      )}
    </>
  );
}
