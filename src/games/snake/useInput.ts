import { useEffect } from 'react';
import type { Action, Dir, Status } from './state';

type Dispatch = (a: Action) => void;

const KEY_DIR: Record<string, Dir> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  KeyW: 'up',
  KeyS: 'down',
  KeyA: 'left',
  KeyD: 'right',
};

const SWIPE_MIN_PX = 30;

export function useInput(
  dispatch: Dispatch,
  status: Status,
  canvasEl: HTMLElement | null,
) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Start on any key when idle or gameover.
      if (status === 'idle' || status === 'gameover') {
        if (
          e.code === 'Space' ||
          e.code === 'Enter' ||
          e.code in KEY_DIR
        ) {
          dispatch({ type: 'start' });
          if (e.code in KEY_DIR) dispatch({ type: 'turn', dir: KEY_DIR[e.code] });
          e.preventDefault();
          return;
        }
      }

      if (e.code === 'Space') {
        dispatch(status === 'paused' ? { type: 'resume' } : { type: 'pause' });
        e.preventDefault();
        return;
      }

      if (e.code in KEY_DIR) {
        dispatch({ type: 'turn', dir: KEY_DIR[e.code] });
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch, status]);

  useEffect(() => {
    if (!canvasEl) return;

    let startX = 0;
    let startY = 0;
    let active = false;

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      active = true;
      if (status === 'idle' || status === 'gameover') {
        dispatch({ type: 'start' });
      }
    };

    const onEnd = (e: TouchEvent) => {
      if (!active) return;
      active = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (Math.max(absX, absY) < SWIPE_MIN_PX) return;
      const dir: Dir =
        absX > absY ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';
      dispatch({ type: 'turn', dir });
    };

    // passive:false so we can block page scroll when the touch begins on
    // the game canvas.
    canvasEl.addEventListener('touchstart', onStart, { passive: true });
    canvasEl.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      canvasEl.removeEventListener('touchstart', onStart);
      canvasEl.removeEventListener('touchend', onEnd);
    };
  }, [canvasEl, dispatch, status]);
}
