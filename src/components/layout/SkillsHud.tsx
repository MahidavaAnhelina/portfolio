import styles from './SkillsHud.module.css';
import type { CSSProperties } from 'react';

const SKILLS: Array<{ label: string; value: string; target: number; delay: number }> = [
  { label: 'React / Next.js', value: '10/10', target: 100, delay: 0.2 },
  { label: 'TypeScript', value: '10/10', target: 100, delay: 0.35 },
  { label: 'Webflow', value: '9/10', target: 90, delay: 0.5 },
  { label: 'Node / NestJS', value: '8/10', target: 80, delay: 0.65 },
  { label: 'GraphQL', value: '8/10', target: 80, delay: 0.8 },
  { label: 'Performance', value: '10/10', target: 100, delay: 0.95 },
];

type FillStyle = CSSProperties & { '--target'?: string };

export default function SkillsHud() {
  return (
    <div className={styles.skills}>
      <h4 className={styles.heading}>Skills</h4>
      {SKILLS.map((s) => {
        const style: FillStyle = {
          '--target': `${s.target}%`,
          animationDelay: `${s.delay}s`,
        };
        return (
          <div key={s.label} className={styles.row}>
            <div className={styles.label}>
              <span>{s.label}</span>
              <span className={styles.val}>{s.value}</span>
            </div>
            <div className={styles.bar}>
              <div className={styles.fill} style={style} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
