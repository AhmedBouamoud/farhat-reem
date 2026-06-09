import { Section, SectionHeader, FadeIn } from './Section';
import styles from './Support.module.css';
const ITEMS = [
  { ico:'🧑‍⚕️', h:'استشارة متخصصة', p:'احجز جلسة مع طبيب أو معالج متخصص يفهم رحلة طفلك تماماً', btn:'احجز الآن', link:`https://wa.me/212662087421` },
  { ico:'📞', h:'خط دعم الأسر', p:'متاح للتحدث والتوجيه العاطفي والعملي — لأنك لست وحدك', btn:'تواصل الآن', link:`https://wa.me/212662087421` },
  { ico:'🏫', h:'دليل المراكز', p:'قاعدة بيانات محدّثة لمراكز التدخل المبكر في المنطقة العربية', btn:'استعرض الدليل', link:'#' },
  { ico:'💰', h:'الدعم المالي', p:'معلومات الجمعيات والمنح الحكومية والبرامج المتاحة للأسر', btn:'اكتشف الموارد', link:'#' }
];
export default function Support() {
  return (
    <Section id="support" blue>
      <SectionHeader eyebrow="✦ الموارد والدعم" title="نحن هنا لأجلكم" desc="لا تمشوا هذا الطريق الجميل وحدكم — مجتمعنا في خدمتكم دائماً" eyeColor="var(--b)"/>
      <div className={styles.grid}>
        {ITEMS.map((s,i)=>(
          <FadeIn key={i} delay={i*80}>
            <div className={styles.card}>
              <div className={styles.ico}>{s.ico}</div>
              <h3 className={styles.h}>{s.h}</h3>
              <p className={styles.p}>{s.p}</p>
              <a href={s.link} className={styles.btn} target={s.link.startsWith('http')?'_blank':''} rel="noopener">{s.btn} →</a>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}
