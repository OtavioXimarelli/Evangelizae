'use client';

import {useRef} from 'react';

interface SwipeOrigin {
  x: number;
  y: number;
  time: number;
}

const MIN_HORIZONTAL = 60;
const MAX_VERTICAL = 50;
const MAX_DURATION = 700;

/**
 * Horizontal swipe between prayer steps, used only as a shortcut over the
 * explicit "Voltar"/"Próxima" buttons. Deliberately conservative: it stays
 * out of the way of vertical scrolling, text selection and form controls.
 */
export function useStepSwipe({
  onNext,
  onPrevious,
  enabled = true,
}: {
  onNext: () => void;
  onPrevious: () => void;
  enabled?: boolean;
}) {
  const origin = useRef<SwipeOrigin | null>(null);

  const onTouchStart = (event: React.TouchEvent) => {
    if (!enabled || event.touches.length !== 1) {
      origin.current = null;
      return;
    }
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, a, input, textarea, select, [contenteditable="true"], [role="dialog"]')) {
      origin.current = null;
      return;
    }
    const touch = event.touches[0];
    origin.current = {x: touch.clientX, y: touch.clientY, time: Date.now()};
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = origin.current;
    origin.current = null;
    if (!enabled || !start) return;
    if (window.getSelection()?.toString()) return;

    const touch = event.changedTouches[0];
    if (!touch) return;

    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Date.now() - start.time > MAX_DURATION) return;
    if (Math.abs(dy) > MAX_VERTICAL) return;
    if (Math.abs(dx) < MIN_HORIZONTAL || Math.abs(dx) < Math.abs(dy) * 1.4) return;

    if (dx < 0) onNext();
    else onPrevious();
  };

  return {onTouchStart, onTouchEnd};
}
