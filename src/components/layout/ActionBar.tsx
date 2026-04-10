import { Link } from 'react-router-dom';
import styles from './ActionBar.module.css';

export default function ActionBar() {
  return (
    <div className={styles.actionbar}>
      <a
        href="https://www.upwork.com/freelancers/~015b351ae7129daea2"
        target="_blank"
        rel="noopener"
        className={styles.action}
      >
        <span className={styles.ico}>✦</span> Upwork
      </a>
      <a href="mailto:mahidavaanhelina@gmail.com" className={styles.action}>
        <span className={styles.ico}>✉</span> Email
      </a>
      <a
        href="https://www.linkedin.com/in/anhelina-mahidava/"
        target="_blank"
        rel="noopener"
        className={styles.action}
      >
        <span className={styles.ico}>in</span> LinkedIn
      </a>
      <Link to="/games" className={styles.action}>
        <span className={styles.ico}>◆</span> Mini games
      </Link>
    </div>
  );
}
