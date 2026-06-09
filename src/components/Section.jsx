import { useEffect, useRef } from 'react';
import styles from './Section.module.css';

export function Section({ id, alt, blue, children }) {
  return (
    <section
      id={id}
      className={`${styles.sec} ${alt ? styles.alt : ''} ${blue ? styles.blue : ''}`}
    >
      {children}
    </section>
  );
}

export function SectionHeader({ eyebrow, title, desc, eyeColor }) {
  return (
    <div className={styles.sh}>
      <div className={styles.eye} style={eyeColor ? {color:eyeColor} : {}}>{eyebrow}</div>
      <h2 className={styles.h2}>{title}</h2>
      {desc && <p className={styles.lead}>{desc}</p>}
    </div>
  );
}

export function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

export function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = `opacity .65s ease ${delay}ms, transform .65s ease ${delay}ms`;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return <div ref={ref}>{children}</div>;
}
