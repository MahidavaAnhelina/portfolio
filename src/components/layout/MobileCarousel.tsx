import { useEffect, useRef } from 'react';
import type { MutableRefObject } from 'react';
import ProjectCard from '../ui/ProjectCard';
import styles from './MobileCarousel.module.css';
import { projects } from '../../data/projects';

type Props = {
  activeIdx: number;
  onActiveChange: (idx: number) => void;
  cardsRef: MutableRefObject<Array<HTMLAnchorElement | null>>;
};

export default function MobileCarousel({ activeIdx, onActiveChange, cardsRef }: Props) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const computeActive = () => {
      rafRef.current = null;
      const mid = scroller.scrollLeft + scroller.clientWidth / 2;
      let bestIdx = 0;
      let bestDist = Infinity;
      cardsRef.current.forEach((c, i) => {
        if (!c) return;
        const cardMid = c.offsetLeft + c.offsetWidth / 2;
        const d = Math.abs(cardMid - mid);
        if (d < bestDist) {
          bestDist = d;
          bestIdx = i;
        }
      });
      onActiveChange(bestIdx);
    };

    const onScroll = () => {
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(computeActive);
      }
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    // Initial pass once layout settles.
    rafRef.current = requestAnimationFrame(computeActive);

    return () => {
      scroller.removeEventListener('scroll', onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [cardsRef, onActiveChange]);

  return (
    <>
      <div ref={scrollerRef} className={styles.carousel}>
        {projects.map((p, i) => (
          <ProjectCard
            key={p.id}
            project={p}
            index={i}
            active={activeIdx === i}
            extraClass={styles.carouselCard}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
          />
        ))}
      </div>
      <div className={styles.dots}>
        {projects.map((p, i) => (
          <div
            key={p.id}
            className={`${styles.dot} ${activeIdx === i ? styles.dotActive : ''}`}
          />
        ))}
      </div>
    </>
  );
}
