import type { MutableRefObject } from 'react';
import ProjectCard from '../ui/ProjectCard';
import cardStyles from '../ui/ProjectCard.module.css';
import { projects } from '../../data/projects';

type Props = {
  hoveredProject: number;
  onEnter: (idx: number) => void;
  onLeave: (idx: number) => void;
  cardsRef: MutableRefObject<Array<HTMLAnchorElement | null>>;
};

const cornerClass = {
  tl: cardStyles.tl,
  tr: cardStyles.tr,
  bl: cardStyles.bl,
  br: cardStyles.br,
};

export default function DesktopProjectCards({
  hoveredProject,
  onEnter,
  onLeave,
  cardsRef,
}: Props) {
  return (
    <>
      {projects.map((p, i) => (
        <ProjectCard
          key={p.id}
          project={p}
          index={i}
          active={hoveredProject === i}
          cornerClass={cornerClass[p.corner]}
          onEnter={onEnter}
          onLeave={onLeave}
          ref={(el) => {
            cardsRef.current[i] = el;
          }}
        />
      ))}
    </>
  );
}
