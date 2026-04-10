import { useEffect, useReducer, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import SnakeScene from '../games/snake/SnakeScene';
import { useInput } from '../games/snake/useInput';
import { initialState, levelForScore, reducer } from '../games/snake/state';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useIsMobile } from '../hooks/useIsMobile';
import styles from './SnakePage.module.css';

export default function SnakePage() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  const [highscore, setHighscore] = useLocalStorage<number>('snake:highscore', 0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [wrapEl, setWrapEl] = useState<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    setWrapEl(wrapRef.current);
  }, []);

  useInput(dispatch, state.status, wrapEl);

  // Persist highscore whenever we beat it.
  useEffect(() => {
    if (state.status === 'gameover' && state.score > highscore) {
      setHighscore(state.score);
    }
  }, [state.status, state.score, highscore, setHighscore]);

  const level = levelForScore(state.score);

  return (
    <div className={styles.page}>
      <div ref={wrapRef} className={styles.canvasWrap}>
        <SnakeScene state={state} dispatch={dispatch} />
      </div>

      <div className={styles.backBar}>
        <Link to="/games" className={styles.back}>
          ← Games
        </Link>
      </div>

      <div className={styles.hud}>
        <div className={styles.hudBox}>
          <div className={styles.hudLabel}>Score</div>
          <div className={styles.hudValue}>{state.score}</div>
        </div>
        <div className={styles.hudBox}>
          <div className={styles.hudLabel}>Best</div>
          <div className={styles.hudValue}>{Math.max(highscore, state.score)}</div>
        </div>
        <div className={styles.hudBox}>
          <div className={styles.hudLabel}>Level</div>
          <div className={styles.hudValue}>{level}</div>
        </div>
      </div>

      {state.status === 'idle' && (
        <div className={styles.overlay}>
          <div className={styles.overlayBox}>
            <div className={styles.overlayTitle}>Snake 🐍</div>
            <div className={styles.overlaySub}>
              Eat the pink sphere to grow. Hit a wall or yourself and it's over.
            </div>
            <button className={styles.primaryBtn} onClick={() => dispatch({ type: 'start' })}>
              ▶ Start
            </button>
            <div className={styles.hintRow}>
              {isMobile ? 'Swipe to turn · Tap to start' : 'Arrows or WASD · Space to pause'}
            </div>
          </div>
        </div>
      )}

      {state.status === 'paused' && (
        <div className={styles.overlay}>
          <div className={styles.overlayBox}>
            <div className={styles.overlayTitle}>Paused</div>
            <button className={styles.primaryBtn} onClick={() => dispatch({ type: 'resume' })}>
              ▶ Resume
            </button>
          </div>
        </div>
      )}

      {state.status === 'gameover' && (
        <div className={styles.overlay}>
          <div className={styles.overlayBox}>
            <div className={styles.overlayTitle}>Game over</div>
            <div className={styles.overlayStats}>
              <div className={styles.overlayStat}>
                <div className={styles.overlayStatLabel}>Score</div>
                <div className={styles.overlayStatValue}>{state.score}</div>
              </div>
              <div className={styles.overlayStat}>
                <div className={styles.overlayStatLabel}>Best</div>
                <div className={styles.overlayStatValue}>
                  {Math.max(highscore, state.score)}
                </div>
              </div>
            </div>
            <div className={styles.overlayButtons}>
              <button className={styles.primaryBtn} onClick={() => dispatch({ type: 'start' })}>
                ↻ Play again
              </button>
              <Link to="/games" className={styles.secondaryBtn}>
                ← Games
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
