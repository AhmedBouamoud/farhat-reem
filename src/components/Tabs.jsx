import { useState } from 'react';
import styles from './Tabs.module.css';

export default function Tabs({ tabs, children }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div className={styles.row}>
        <div className={styles.inner}>
          {tabs.map((t, i) => (
            <button
              key={i}
              className={`${styles.tab} ${i === active ? styles.on : ''}`}
              onClick={() => setActive(i)}
            >{t}</button>
          ))}
        </div>
      </div>
      <div>{children[active]}</div>
    </div>
  );
}
