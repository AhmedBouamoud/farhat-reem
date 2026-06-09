import { Section, SectionHeader, FadeIn } from './Section';
import { GALLERY } from '../data';
import styles from './Gallery.module.css';

const STORIES = [
  { img:'/rim-dad.jpg', quote:'يوم وُلدت ريم، أمسك الخوف بتلابيبي ولم يتركني. كنت أظن أن الحياة ستضيق — فإذا بها تتسع. لم أكن أعلم أن طفلة بعيون اللوز ستعيد تعريفي لنفسي من جديد.', name:'أ. أحمد بوعمود', sub:'والد ريم — أكادير، المغرب', badge:'🌟 مؤسس هذه المنصة بسبب ريم' },
  { img:'/rim-cowgirl.jpg', quote:'قبل ريم، كنتُ أعرف الحياة. بعدها، صرتُ أفهمها. علّمتني أن أجمل ما في الوجود لا يُقاس ولا يُوصف — يُعاش فقط في حضورها.', name:'أ. أحمد بوعمود', sub:'عن رحلته مع ريم', badge:'🎨 الخيال لا حدود له' },
  { img:'/rim-fairy.jpg', quote:'ريم الجنية، ريم الفارسة، ريم الفنانة — هذه الطفلة تحمل ألف شخصية وكلها رائعة. كل صورة معها تحكي قصة انتصار صغير نحتفل به كل يوم.', name:'أم ريم', sub:'عن رحلة الإبداع والفرح', badge:'🦋 جنية أكادير' }
];

export default function Gallery() {
  return (
    <Section id="gallery">
      <SectionHeader eyebrow="✦ مكتبة الفرح" title="لحظات ريم المضيئة" desc="صور حقيقية من رحلة ريم بوعمود — من الطفولة الأولى حتى اليوم"/>
      <div className={styles.gal}>
        {GALLERY.map((item, i) => (
          <div key={i} className={`${styles.gi} ${item.tall ? styles.tall : ''} ${item.wide ? styles.wide : ''}`}>
            <img src={item.src} alt={item.label} loading="lazy"/>
            <div className={styles.ov}>
              <div className={styles.lbl}>📌 {item.label}</div>
              <div className={styles.sub}>{item.age}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.stories}>
        <div className={styles.storiesHd}>
          <div className={styles.eye}>✦ كلمات من القلب</div>
          <h2 className={styles.storiesH}>أصوات العائلة</h2>
        </div>
        <div className={styles.storiesGrid}>
          {STORIES.map((s, i) => (
            <FadeIn key={i} delay={i*100}>
              <div className={styles.story}>
                <div className={styles.sq}>❝</div>
                <p className={styles.stxt}>{s.quote}</p>
                <div className={styles.sau}>
                  <img src={s.img} alt={s.name} className={styles.sav}/>
                  <div>
                    <div className={styles.sname}>{s.name}</div>
                    <div className={styles.ssub}>{s.sub}</div>
                  </div>
                </div>
                <div className={styles.sbadge}>{s.badge}</div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </Section>
  );
}
