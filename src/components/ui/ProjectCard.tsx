import { forwardRef } from 'react';
import type { MouseEvent } from 'react';
import styles from './ProjectCard.module.css';
import type { Project } from '../../data/projects';

type Props = {
  project: Project;
  index: number;
  active: boolean;
  cornerClass?: string;
  extraClass?: string;
  onEnter?: (idx: number) => void;
  onLeave?: (idx: number) => void;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
};

const ProjectCard = forwardRef<HTMLAnchorElement, Props>(function ProjectCard(
  { project, index, active, cornerClass, extraClass, onEnter, onLeave, onClick },
  ref,
) {
  const classes = [
    styles.card,
    cornerClass,
    extraClass,
    active ? styles.active : '',
  ]
    .filter(Boolean)
    .join(' ');

  const isInternal = project.href === '#';
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isInternal) e.preventDefault();
    onClick?.(e);
  };

  return (
    <a
      ref={ref}
      href={project.href}
      target={isInternal ? undefined : '_blank'}
      rel={isInternal ? undefined : 'noopener'}
      className={classes}
      data-idx={index}
      onMouseEnter={() => onEnter?.(index)}
      onMouseLeave={() => onLeave?.(index)}
      onClick={handleClick}
    >
      <span className={`${styles.badge} ${project.badgeFeatured ? styles.badgeFeatured : ''}`}>
        {project.badge}
      </span>
      <h3 className={styles.title}>{project.title}</h3>
      <div className={styles.role}>{project.role}</div>
      <p className={styles.desc} data-desc>
        {project.desc}
      </p>
      <div className={styles.cta}>
        {isInternal ? 'Internal product' : project.href.includes('synder') ? 'synder.com' : 'Visit site'}
        <span className={styles.arrow}>→</span>
      </div>
    </a>
  );
});

export default ProjectCard;
