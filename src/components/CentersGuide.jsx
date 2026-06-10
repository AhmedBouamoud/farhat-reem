import { useState, useMemo } from "react";
import { CENTERS, PUBLIC_CENTERS, CENTERS_STATS } from "../centersData";
import styles from "./CentersGuide.module.css";

const VERIFICATION_BADGE = {
  "مؤكد":            { label: "مؤكد ✓",        color: "#16a34a", bg: "#dcfce7" },
  "جزئياً مؤكد":    { label: "جزئياً مؤكد",   color: "#d97706", bg: "#fef3c7" },
  "يحتاج إلى تأكيد":{ label: "يحتاج تأكيد",   color: "#dc2626", bg: "#fee2e2" },
};

const ALL_CITIES = ["الكل", ...new Set(CENTERS.map(c => c.city))];

function CenterCard({ center }) {
  const badge = VERIFICATION_BADGE[center.verification_status] || VERIFICATION_BADGE["يحتاج إلى تأكيد"];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTitles}>
          <h3 className={styles.cardName}>{center.name_ar}</h3>
          {center.name_fr && <p className={styles.cardNameFr}>{center.name_fr}</p>}
        </div>
        <span className={styles.badge} style={{ color: badge.color, background: badge.bg }}>
          {badge.label}
        </span>
      </div>

      <div className={styles.cardMeta}>
        <span className={styles.metaItem}>📍 {center.city}</span>
        <span className={styles.metaItem}>🏢 {center.type}</span>
        {center.age_range && center.age_range !== "يحتاج إلى تأكيد" && (
          <span className={styles.metaItem}>👶 {center.age_range}</span>
        )}
      </div>

      <div className={styles.services}>
        {center.services.map(s => (
          <span key={s} className={styles.serviceTag}>{s}</span>
        ))}
      </div>

      {center.address && (
        <p className={styles.address}>📌 {center.address}</p>
      )}

      <div className={styles.actions}>
        {center.phone && (
          <a href={`tel:${center.phone}`} className={`${styles.btn} ${styles.btnCall}`}>📞 اتصال</a>
        )}
        {center.whatsapp && (
          <a href={`https://wa.me/${center.whatsapp.replace(/\D/g,"")}`} target="_blank" rel="noreferrer"
            className={`${styles.btn} ${styles.btnWa}`}>💬 واتساب</a>
        )}
        {center.email && (
          <a href={`mailto:${center.email}`} className={`${styles.btn} ${styles.btnEmail}`}>✉️ بريد</a>
        )}
        {center.map_link && (
          <a href={center.map_link} target="_blank" rel="noreferrer"
            className={`${styles.btn} ${styles.btnMap}`}>🗺️ خريطة</a>
        )}
        {(center.website || center.facebook) && (
          <a href={center.website || center.facebook} target="_blank" rel="noreferrer"
            className={`${styles.btn} ${styles.btnWeb}`}>🌐 موقع</a>
        )}
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.lastChecked}>آخر تحقق: {center.last_checked}</span>
      </div>
    </div>
  );
}

export default function CentersGuide() {
  const [search, setSearch]   = useState("");
  const [city,   setCity]     = useState("الكل");
  const [tab,    setTab]      = useState("all");

  const filtered = useMemo(() => {
    const pool = tab === "public" ? PUBLIC_CENTERS : CENTERS;
    return pool.filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q ||
        c.name_ar.includes(search) ||
        c.city.includes(search) ||
        c.services.some(s => s.includes(search));
      const matchCity = city === "الكل" || c.city === city;
      return matchSearch && matchCity;
    });
  }, [search, city, tab]);

  return (
    <div className={styles.page} dir="rtl">

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroIcon}>🇲🇦 💛</div>
          <h1 className={styles.heroTitle}>دليل مراكز دعم أطفال متلازمة داون بالمغرب</h1>
          <p className={styles.heroSub}>
            لأن الأسرة لا ينبغي أن تبحث وحدها — جمعنا مراكز وجمعيات تساعد في التوجيه،
            التأهيل، التدخل المبكر، والدمج المدرسي.
          </p>
          <div className={styles.heroStats}>
            <span>🏢 {CENTERS_STATS.total} مركز وجمعية</span>
            <span>📍 {CENTERS_STATS.cities} مدن</span>
            <span>✅ {CENTERS_STATS.verified} مؤكد</span>
            <span>🕒 آخر تحديث: {CENTERS_STATS.lastUpdate}</span>
          </div>
        </div>
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* تنبيه */}
      <div className={styles.alert}>
        ⚠️ يُنصح بالاتصال بالمركز قبل الزيارة للتأكد من المواعيد والخدمات المتاحة.
      </div>

      {/* بحث وفلترة */}
      <section className={styles.searchSection}>
        <div className={styles.searchBox}>
          <span>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="ابحث باسم المركز أو المدينة أو الخدمة..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          <select value={city} onChange={e => setCity(e.target.value)} className={styles.select}>
            {ALL_CITIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className={styles.tabs}>
          {[["all","المراكز المتخصصة"],["public","توجيه عمومي"]].map(([v,l]) => (
            <button key={v}
              className={`${styles.tab} ${tab === v ? styles.tabActive : ""}`}
              onClick={() => setTab(v)}>{l}</button>
          ))}
        </div>
        <p className={styles.resultCount}>{filtered.length} مركز / جمعية</p>
      </section>

      {/* البطاقات */}
      <section className={styles.cardsSection}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span>🔍</span><p>لا توجد نتائج. جرّب كلمة مختلفة.</p>
          </div>
        ) : (
          <div className={styles.cardsGrid}>
            {filtered.map(c => <CenterCard key={c.id} center={c} />)}
          </div>
        )}
      </section>

      {/* المصادر */}
      <section className={styles.sourcesSection}>
        <h2 className={styles.sectionTitle}>📚 المصادر</h2>
        <div className={styles.sourcesList}>
          {[
            ["Orphanet","https://www.orpha.net"],
            ["Edulink Maroc","https://www.edulink.ma"],
            ["Annuaire-Gratuit.ma","https://www.annuaire-gratuit.ma"],
            ["Association Malaïka Marrakech","https://www.association-malaika-marrakech.com"],
            ["handicapamal.ma","http://handicapamal.ma"],
          ].map(([name,url]) => (
            <div key={name} className={styles.sourceItem}>
              <a href={url} target="_blank" rel="noreferrer">{name}</a>
            </div>
          ))}
        </div>
        <p className={styles.sourcesNote}>
          نحرص على تحديث هذا الدليل باستمرار. قد تتغير أرقام الهاتف أو العناوين — اتصلوا قبل الزيارة.
        </p>
      </section>

      <footer className={styles.pageFooter}>
        <p>إعداد وتنسيق: <strong>الأستاذ أحمد بوعمود</strong></p>
        <p>ضمن مشروع <strong>فرحة ريم | متلازمة داون ببساطة</strong></p>
      </footer>

    </div>
  );
}
