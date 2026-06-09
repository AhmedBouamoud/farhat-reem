import { Section, SectionHeader, FadeIn } from './Section';
import Tabs from './Tabs';
import { TIPS } from '../data';
import styles from './Tips.module.css';

function TipCard({ tip, num, pers }) {
  return (
    <FadeIn>
      <div className={`${styles.tip} ${pers ? styles.pers : ''}`}>
        <div className={styles.num}>{num}</div>
        <div>
          <div className={styles.h}>{tip.title}</div>
          <p className={styles.p}>{tip.body}</p>
        </div>
      </div>
    </FadeIn>
  );
}

export default function Tips() {
  const tabs = ['📚 التعليم','🏥 الصحة','🌍 الاجتماعي','💛 من تجربتي'];
  const sets = [TIPS.education, TIPS.health, TIPS.social, TIPS.personal];
  return (
    <Section id="tips" alt>
      <SectionHeader eyebrow="✦ نصائح يومية" title="دليلك العملي اليومي" desc="خطوات بسيطة وفعّالة تصنع فارقاً حقيقياً في حياة طفلك وعائلتك"/>
      <Tabs tabs={tabs}>
        {sets.map((set, si) => (
          <div key={si} className={styles.grid}>
            {set.map((tip, i) => <TipCard key={i} tip={tip} num={i+1} pers={si===3}/>)}
          </div>
        ))}
      </Tabs>
    </Section>
  );
}
