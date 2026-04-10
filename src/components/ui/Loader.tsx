import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import styles from './Loader.module.css';

export default function Loader() {
  const { progress, active } = useProgress();
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(true);

  // Fade out once all assets finish loading, then unmount after the
  // transition so the overlay doesn't swallow clicks.
  useEffect(() => {
    if (!active && progress >= 100) {
      const fade = setTimeout(() => setHidden(true), 200);
      const unmount = setTimeout(() => setMounted(false), 900);
      return () => {
        clearTimeout(fade);
        clearTimeout(unmount);
      };
    }
  }, [active, progress]);

  if (!mounted) return null;

  return (
    <div className={`${styles.loader} ${hidden ? styles.hidden : ''}`}>
      <div className={styles.box}>
        <h2>Loading character…</h2>
        <div className={styles.bar}>
          <div className={styles.fill} style={{ width: `${Math.round(progress)}%` }} />
        </div>
        <div className={styles.pct}>{Math.round(progress)}%</div>
      </div>
    </div>
  );
}
