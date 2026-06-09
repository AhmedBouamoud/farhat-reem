import styles from './Footer.module.css';
export default function Footer() {
  const cols = [
    { h:'المحتوى', links:[['الأبحاث الطبية','#edu'],['النمو والمعرفة','#edu'],['الرعاية اليومية','#edu'],['ارفع وعيك','#edu'],['مكتبة الفرح','#gallery']] },
    { h:'المجتمع', links:[['منتدى الأسر','#family'],['مجموعات الدعم','#family'],['الفيديوهات','#videos'],['ركن ريم','#rim'],['قصص النجاح','#gallery']] },
    { h:'الموارد',  links:[['دليل المراكز','#support'],['الاستشارات','#support'],['خط الدعم','#support'],['النصائح اليومية','#tips'],['عن المنصة','#hero']] }
  ];
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <div className={styles.brand}>
            <div className={styles.mark}>🌟</div>
            <span>فرحة <em>ريم</em></span>
          </div>
          <p className={styles.desc}>منصة عربية تحتفي بأطفال متلازمة داون وتدعم عائلاتهم — من أكادير إلى كل العالم العربي.</p>
          <div className={styles.contact}>
            <a href="mailto:ahmedbouamoud@gmail.com">📧 ahmedbouamoud@gmail.com</a>
            <a href="https://wa.me/212662087421">💬 +212 662 087 421</a>
          </div>
          <div className={styles.socials}>
            {['📘','📸','🐦','📺'].map((s,i)=><a key={i} href="#" className={styles.soc}>{s}</a>)}
          </div>
        </div>
        {cols.map(col=>(
          <div key={col.h}>
            <h4 className={styles.colH}>{col.h}</h4>
            <ul className={styles.links}>
              {col.links.map(([l,h])=><li key={l}><a href={h}>{l}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <hr className={styles.sep}/>
      <div className={styles.bot}>
        <span>© 2025 فرحة ريم — منصة أطفال متلازمة داون العربي</span>
        <span>صُنع بـ ❤️ لريم بوعمود · أكادير، المغرب 🇲🇦</span>
      </div>
    </footer>
  );
}
