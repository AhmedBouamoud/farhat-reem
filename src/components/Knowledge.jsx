import { useEffect, useMemo, useState } from 'react';
import { Section, SectionHeader } from './Section';
import Tabs from './Tabs';
import ArticleCard from './ArticleCard';
import { ARTICLES } from '../data';
import { fetchWeeklyArticles } from '../services/weeklyContent';
import styles from './Knowledge.module.css';

const CATEGORY_ORDER = ['medical', 'psychological', 'care', 'awareness'];

function mergeArticles(staticArticles, weeklyArticles) {
  const merged = Object.fromEntries(
    CATEGORY_ORDER.map((key) => [key, [...(staticArticles[key] || [])]])
  );

  for (const article of weeklyArticles) {
    const key = CATEGORY_ORDER.includes(article.categoryKey) ? article.categoryKey : 'awareness';
    const duplicate = merged[key].some((item) =>
      (article.url && item.url === article.url) || item.title === article.title
    );
    if (!duplicate) merged[key].unshift(article);
  }

  return merged;
}

export default function Knowledge() {
  const [showAll, setShowAll] = useState(false);
  const [weeklyArticles, setWeeklyArticles] = useState([]);
  const tabs = ['🧬 الأبحاث الطبية','🧠 النمو والمعرفة','💊 الرعاية اليومية','📖 ارفع وعيك'];

  useEffect(() => {
    let active = true;
    fetchWeeklyArticles()
      .then((items) => active && setWeeklyArticles(items))
      .catch((error) => console.warn('تعذر تحميل المقالات الأسبوعية؛ سيتم عرض المحتوى المحفوظ.', error));
    return () => { active = false; };
  }, []);

  const articles = useMemo(
    () => mergeArticles(ARTICLES, weeklyArticles),
    [weeklyArticles]
  );
  const sets = CATEGORY_ORDER.map((key) => articles[key]);
  const allArticles = Object.values(articles).flat();

  return (
    <Section id="edu" alt>
      <SectionHeader
        eyebrow="✦ الفهم والمواكبة"
        title="مركز المعرفة العلمية"
        desc="محتوى عربي مبسّط من مصادر علمية موثوقة — مع إضافة مقالات جديدة تلقائياً كل أسبوع"
      />
      {showAll ? (
        <div className={styles.grid}>
          {allArticles.map((a, i) => <ArticleCard key={a.url || `${a.title}-${i}`} article={a}/>)}
        </div>
      ) : (
        <Tabs tabs={tabs}>
          {sets.map((set, i) => (
            <div key={i} className={styles.grid}>
              {set.map((a, j) => <ArticleCard key={a.url || `${a.title}-${j}`} article={a}/>)}
            </div>
          ))}
        </Tabs>
      )}
      <div className={styles.more}>
        <button className={styles.btnMore} onClick={() => setShowAll(v => !v)}>
          {showAll ? '← تصفح حسب التصنيف' : `عرض جميع المقالات (${allArticles.length}) ←`}
        </button>
      </div>
    </Section>
  );
}
