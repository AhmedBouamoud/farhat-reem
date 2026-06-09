import { STATS } from '../data';
import styles from './StatsBanner.module.css';
export default function StatsBanner() {
  return (
    <div className={styles.banner}>
      {STATS.map((s,i) => (
        <div key={i} className={styles.item}>
          <div className={styles.val}>{s.val}</div>
          <div className={styles.lbl}>{s.label}</div>
          <div className={styles.src}>{s.src}</div>
        </div>
      ))}
    </div>
  );
}
