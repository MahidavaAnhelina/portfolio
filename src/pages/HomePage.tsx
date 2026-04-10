import { useCallback, useEffect, useRef, useState } from 'react';
import Scene from '../components/scene/Scene';
import Nameplate from '../components/layout/Nameplate';
import Hint from '../components/layout/Hint';
import SkillsHud from '../components/layout/SkillsHud';
import ActionBar from '../components/layout/ActionBar';
import DesktopProjectCards from '../components/layout/DesktopProjectCards';
import MobileCarousel from '../components/layout/MobileCarousel';
import SpeechBubble from '../components/ui/SpeechBubble';
import Loader from '../components/ui/Loader';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { projects } from '../data/projects';
import { useIsMobile } from '../hooks/useIsMobile';

export default function HomePage() {
  useDocumentTitle('Anhelina Mahidava — Front-End Developer');
  const isMobile = useIsMobile();
  const [hoveredProject, setHoveredProject] = useState(-1);

  // Desktop card elements (for rect lookup) and a separate array for the
  // mobile carousel cards. Which one the scene reads from depends on
  // isMobile at the time of the frame.
  const desktopCardsRef = useRef<Array<HTMLAnchorElement | null>>([]);
  const mobileCardsRef = useRef<Array<HTMLAnchorElement | null>>([]);

  const mouseRef = useRef({ nx: 0, ny: 0 });
  const manualRotationRef = useRef(0);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, rot: 0 });

  // Mouse tracking for head/body idle motion and drag-rotate.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.nx = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.ny = -((e.clientY / window.innerHeight) * 2 - 1);
      if (isDraggingRef.current) {
        const dx = e.clientX - dragStartRef.current.x;
        manualRotationRef.current = dragStartRef.current.rot + dx * 0.01;
      }
    };
    const onDown = (e: MouseEvent) => {
      // Only start dragging if the click landed on the canvas/background,
      // not on UI.
      const target = e.target as HTMLElement;
      if (target.closest('a, button')) return;
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.clientX, rot: manualRotationRef.current };
      document.body.style.cursor = 'grabbing';
    };
    const onUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
    };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const target = e.target as HTMLElement;
      if (target.closest('a, button')) return;
      isDraggingRef.current = true;
      dragStartRef.current = { x: e.touches[0].clientX, rot: manualRotationRef.current };
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingRef.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - dragStartRef.current.x;
      manualRotationRef.current = dragStartRef.current.rot + dx * 0.01;
    };
    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const getActiveCardRect = useCallback((): DOMRect | null => {
    if (hoveredProject < 0) return null;
    const list = isMobile ? mobileCardsRef.current : desktopCardsRef.current;
    const el = list[hoveredProject];
    return el ? el.getBoundingClientRect() : null;
  }, [hoveredProject, isMobile]);

  const pointingArm =
    hoveredProject >= 0 && !isMobile ? projects[hoveredProject].pointingArm : null;

  const speechText = hoveredProject >= 0 ? projects[hoveredProject].speech : '';

  return (
    <>
      <Scene
        isMobile={isMobile}
        hoveredProject={hoveredProject}
        pointingArm={pointingArm}
        getActiveCardRect={getActiveCardRect}
        manualRotationRef={manualRotationRef}
        isDraggingRef={isDraggingRef}
        mouseRef={mouseRef}
      />

      <Nameplate />
      <Hint />
      <SkillsHud />

      {!isMobile && (
        <DesktopProjectCards
          hoveredProject={hoveredProject}
          onEnter={setHoveredProject}
          onLeave={(idx) => {
            setHoveredProject((cur) => (cur === idx ? -1 : cur));
          }}
          cardsRef={desktopCardsRef}
        />
      )}

      {isMobile && (
        <MobileCarousel
          activeIdx={Math.max(0, hoveredProject)}
          onActiveChange={setHoveredProject}
          cardsRef={mobileCardsRef}
        />
      )}

      <SpeechBubble text={speechText} visible={!isMobile && hoveredProject >= 0} />

      <ActionBar />

      <Loader />
    </>
  );
}
