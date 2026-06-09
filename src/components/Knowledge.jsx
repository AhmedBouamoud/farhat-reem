import { useState } from 'react';
import { Section, SectionHeader } from './Section';
import Tabs from './Tabs';
import ArticleCard from './ArticleCard';
import { ARTICLES } from '../data';
import styles from './Knowledge.module.css';

export default function Knowledge() {
  const [showAll, setShowAll] = useState(false);
  const tabs = ['🧬 الأبحاث الطبية','🧠 النمو والمعرفة','💊 الرعاية اليومية','📖 ارفع وعيك'];
  const sets = [ARTICLES.medical, ARTICLES.psychological, ARTICLES.care, ARTICLES.awareness];
  const allArticles = Object.values(ARTICLES).flat();

  return (
    <Section id="edu" alt>
      <SectionHeader
        eyebrow="✦ الفهم والمواكبة"
        title="مركز المعرفة العلمية"
        desc="محتوى مترجم ومُراجَع من أرقى المجلات العلمية العالمية — لأن أطفالنا يستحقون أفضل ما توصّل إليه العلم"
      />
      {showAll ? (
        <div className={styles.grid}>
          {allArticles.map((a, i) => <ArticleCard key={i} article={a}/>)}
        </div>
      ) : (
        <Tabs tabs={tabs}>
          {sets.map((set, i) => (
            <div key={i} className={styles.grid}>
              {set.map((a, j) => <ArticleCard key={j} article={a}/>)}
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
