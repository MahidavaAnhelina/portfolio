import styles from './Nameplate.module.css';

export default function Nameplate() {
  return (
    <div className={styles.topbar}>
      <div className={styles.nameplate}>
        <div className={styles.title}>Anhelina Mahidava</div>
        <div className={styles.sub}>Sr. React &amp; Webflow Developer · 7+ yrs · Wrocław</div>
      </div>
      <div className={styles.controls}>
        <div className={styles.pill}>
          <span className={styles.pillStatus} />
          Available for work
        </div>
        <div className={styles.pill}>◆ Level 7 · Front-End</div>
      </div>
    </div>
  );
}
