import { FadeIn } from './Section';
import styles from './ArticleCard.module.css';

export default function ArticleCard({ article }) {
  const { img, icon, bg, cat, tag, tagType, title, excerpt, date, readTime, source, url, automated } = article;
  const card = (
    <div className={styles.card}>
      <div className={styles.imgWrap}>
        {img
          ? <img src={img} alt={title} loading="lazy" className={styles.img}/>
          : <div className={styles.placeholder} style={{background:bg}}><span>{icon}</span></div>
        }
      </div>
      <div className={styles.body}>
        {source && <div className={styles.source}>📰 {automated ? 'جديد · ' : ''}{source}</div>}
        <div className={styles.cat}>{cat}</div>
        <h3 className={styles.h}>{title}</h3>
        <p className={styles.excerpt}>{excerpt}</p>
        <div className={styles.footer}>
          <span className={`${styles.tag} ${tagType === 'blue' ? styles.tagB : styles.tagY}`}>{tag}</span>
          <div className={styles.meta}>
            {date && <span>📅 {date}</span>}
            <span>⏱ {readTime}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <FadeIn>
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          aria-label={`قراءة المصدر الأصلي: ${title}`}
          style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}
        >
          {card}
        </a>
      ) : card}
    </FadeIn>
  );
}
