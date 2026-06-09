import { useEffect, useRef } from 'react';
import { STATS } from '../data';
import styles from './Hero.module.css';

function useCounter(ref, target) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      const num = parseInt(target.replace(/\D/g,''));
      if (!num) return;
      const suffix = target.replace(/[\d]/g,'');
      let cur = 0;
      const step = Math.ceil(num / 50);
      const t = setInterval(() => {
        cur = Math.min(cur + step, num);
        el.textContent = cur + suffix;
        if (cur >= num) clearInterval(t);
      }, 30);
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
}

function StatItem({ val, label, src }) {
  const ref = useRef(null);
  useCounter(ref, val);
  return (
    <div className={styles.statItem}>
      <div className={styles.statVal} ref={ref}>{val}</div>
      <div className={styles.statLabel}>{label}</div>
      <div className={styles.statSrc}>{src}</div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.blob1}/>
      <div className={styles.blob2}/>
      <div className={styles.blob3}/>
      <div className={styles.left}>
        <div className={styles.badge}>🎗️ منصة أطفال متلازمة داون العربي</div>
        <h1 className={styles.title}>
          أطفالنا <span className={styles.gold}>الملائكة</span><br/>
          <span className={styles.blue}>هبةٌ</span> تستحق<br/>احتفاءً
        </h1>
        <p className={styles.desc}>
          فضاء متكامل يجمع العلم والقلب — يحتفي بأطفال متلازمة داون ويدعم عائلاتهم بمعرفة حقيقية من أرقى المجلات العلمية، وتجارب ملهمة وأدوات يومية عملية.
        </p>
        <div className={styles.actions}>
          <a href="#edu" className={styles.btnBlue}>🚀 ابدأ الرحلة</a>
          <a href="#rim" className={styles.btnYellow}>🌸 ركن ريم</a>
        </div>
        <div className={styles.stats}>
          {STATS.map(s => <StatItem key={s.val} {...s}/>)}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.photoWrap}>
          <div className={styles.floatBadge}>
            🎭 آخر إنجاز لريم<br/>
            <small>عرض مسرحي رائع ✨</small>
          </div>
          <img src="/rim-stage.jpg" alt="ريم على المسرح" className={styles.mainPhoto}/>
          <img src="/rim-paint.jpg" alt="ريم ترسم" className={`${styles.floatA}`}/>
          <img src="/rim-pool.jpg"  alt="ريم في الماء"  className={`${styles.floatB}`}/>
        </div>
      </div>
    </section>
  );
}
