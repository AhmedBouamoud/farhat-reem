import { useState } from 'react';
import { Section, SectionHeader, FadeIn } from './Section';
import styles from './Videos.module.css';

const VIDS = [
  { id:'9HpLhxMFJR8', org:'World Down Syndrome Day', title:'Assume That I Can — يوم متلازمة داون العالمي 2024', dur:'2:30', lang:'EN+مترجم' },
  { id:'4fHGsLuA76w', org:'WDSD Campaign', title:'الافتراضات تصبح حقيقة — رسالة للعالم', dur:'1:45', lang:'EN' },
  { id:'Z6h7UBBnzLY', org:'Inspiring Stories', title:'أطفال متلازمة داون يغيرون العالم', dur:'4:20', lang:'EN' }
];

function VideoModal({ vid, onClose }) {
  if (!vid) return null;
  return (
    <div className={styles.modal} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modalBox}>
        <div className={styles.modalHd}>
          <span className={styles.modalTitle}>{vid.title}</span>
          <button className={styles.modalX} onClick={onClose}>✕</button>
        </div>
        <iframe
          className={styles.iframe}
          src={`https://www.youtube.com/embed/${vid.id}?autoplay=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title={vid.title}
        />
      </div>
    </div>
  );
}

export default function Videos() {
  const [playing, setPlaying] = useState(null);
  return (
    <Section id="videos" alt>
      <SectionHeader eyebrow="✦ فيديوهات ملهمة" title="شاهد قصصاً تلمس القلب" desc="مقاطع حقيقية من حول العالم تحتفي بأطفال متلازمة داون"/>
      <div className={styles.grid}>
        {VIDS.map((v, i) => (
          <FadeIn key={i} delay={i*80}>
            <div className={styles.card} onClick={() => setPlaying(v)}>
              <img src={`https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`} alt={v.title} className={styles.thumb} loading="lazy"/>
              <div className={styles.overlay}/>
              <div className={styles.play}>▶</div>
              <div className={styles.info}>
                <div className={styles.org}>{v.org}</div>
                <div className={styles.vtitle}>{v.title}</div>
                <div className={styles.meta}>
                  <span className={styles.vtag}>⏱ {v.dur}</span>
                  <span className={styles.lang}>{v.lang}</span>
                </div>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
      <VideoModal vid={playing} onClose={() => setPlaying(null)}/>
    </Section>
  );
}
