import { useState, useMemo } from "react";
import { CENTERS, PUBLIC_CENTERS, CENTERS_STATS } from "../centersData";
import styles from "./CentersGuide.module.css";

const VERIFICATION_BADGE = {
  "مؤكد": { label: "مؤكد ✓", color: "#16a34a", bg: "#dcfce7" },
  "جزئياً مؤكد": { label: "جزئياً مؤكد", color: "#d97706", bg: "#fef3c7" },
  "يحتاج إلى تأكيد": { label: "يحتاج تأكيد", color: "#dc2626", bg: "#fee2e2" },
};

const ALL_SERVICES = [
  "تدخل مبكر", "تقويم النطق", "علاج نفسي حركي", "دعم أسري",
  "تعليم خاص", "دعم نفسي", "أنشطة اجتماعية", "إدماج مدرسي",
];

const ALL_CITIES = ["الكل", ...new Set([...CENTERS, ...PUBLIC_CENTERS].map(c => c.city).filter(c => c !== "متعددة المدن"))];

function CenterCard({ center, onReport }) {
  const [expanded, setExpanded] = useState(false);
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
        {center.age_range && <span className={styles.metaItem}>👶 {center.age_range}</span>}
      </div>

      <div className={styles.services}>
        {center.services.map(s => (
          <span key={s} className={styles.serviceTag}>{s}</span>
        ))}
      </div>

      {center.address && (
        <p className={styles.address}>
          <span>📌</span> {center.address}
        </p>
      )}

      <div className={styles.actions}>
        {center.phone && (
          <a href={`tel:${center.phone}`} className={`${styles.btn} ${styles.btnCall}`}>
            📞 اتصال
          </a>
        )}
        {center.whatsapp && (
          <a
            href={`https://wa.me/${center.whatsapp.replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className={`${styles.btn} ${styles.btnWa}`}
          >
            💬 واتساب
          </a>
        )}
        {center.email && (
          <a href={`mailto:${center.email}`} className={`${styles.btn} ${styles.btnEmail}`}>
            ✉️ بريد
          </a>
        )}
        {center.map_link && (
          <a href={center.map_link} target="_blank" rel="noreferrer" className={`${styles.btn} ${styles.btnMap}`}>
            🗺️ خريطة
          </a>
        )}
        {(center.website || center.facebook) && (
          <a
            href={center.website || center.facebook}
            target="_blank"
            rel="noreferrer"
            className={`${styles.btn} ${styles.btnWeb}`}
          >
            🌐 موقع
          </a>
        )}
      </div>

      <div className={styles.cardFooter}>
        <span className={styles.lastChecked}>آخر تحقق: {center.last_checked}</span>
        <button className={styles.reportBtn} onClick={() => onReport(center)}>
          🚩 الإبلاغ عن خطأ
        </button>
        {center.notes && (
          <button className={styles.expandBtn} onClick={() => setExpanded(!expanded)}>
            {expanded ? "▲ أقل" : "▼ ملاحظات"}
          </button>
        )}
      </div>

      {expanded && center.notes && (
        <p className={styles.notes}>💡 {center.notes}</p>
      )}
    </div>
  );
}

function ReportModal({ center, onClose }) {
  const [form, setForm] = useState({ wrong: "", correction: "", source: "", name: "", contact: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    // في الإنتاج: إرسال عبر Supabase أو EmailJS
    console.log("Report:", { center: center.id, ...form });
    setSent(true);
  };

  if (sent) return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal}>
        <div className={styles.modalSuccess}>
          <span>✅</span>
          <p>شكراً! تم إرسال ملاحظتك وسنراجعها قريباً.</p>
          <button onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <h3>🚩 تصحيح معلومة — {center.name_ar}</h3>
        <label>ما المعلومة الخاطئة؟</label>
        <textarea value={form.wrong} onChange={e => setForm({ ...form, wrong: e.target.value })} rows={2} />
        <label>التصحيح المقترح</label>
        <textarea value={form.correction} onChange={e => setForm({ ...form, correction: e.target.value })} rows={2} />
        <label>المصدر (اختياري)</label>
        <input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} />
        <label>اسمك (اختياري)</label>
        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <label>وسيلة تواصل (اختياري)</label>
        <input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} />
        <div className={styles.modalActions}>
          <button className={styles.btnSend} onClick={handleSubmit}>إرسال</button>
          <button className={styles.btnCancel} onClick={onClose}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

function AddCenterModal({ onClose }) {
  const [form, setForm] = useState({
    name: "", city: "", address: "", phone: "", email: "",
    website: "", services: "", source: "", senderName: "", senderContact: ""
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    console.log("New center:", form);
    setSent(true);
  };

  if (sent) return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal}>
        <div className={styles.modalSuccess}>
          <span>✅</span>
          <p>شكراً! سيتم مراجعة المعلومات قبل نشرها.</p>
          <button onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.modalOverlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={styles.modal}>
        <h3>➕ إضافة مركز جديد</h3>
        <p className={styles.modalNote}>⚠️ لن تُنشر المعلومات مباشرة — ستُراجع من إدارة الموقع أولاً.</p>
        {[
          ["اسم المركز *", "name"],
          ["المدينة *", "city"],
          ["العنوان", "address"],
          ["الهاتف", "phone"],
          ["البريد الإلكتروني", "email"],
          ["الموقع أو فيسبوك", "website"],
          ["الخدمات المقدمة", "services"],
          ["مصدر المعلومة *", "source"],
          ["اسمك", "senderName"],
          ["بريدك أو رقمك للتأكيد", "senderContact"],
        ].map(([label, key]) => (
          <div key={key}>
            <label>{label}</label>
            <input value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
        <div className={styles.modalActions}>
          <button className={styles.btnSend} onClick={handleSubmit}>إرسال</button>
          <button className={styles.btnCancel} onClick={onClose}>إلغاء</button>
        </div>
      </div>
    </div>
  );
}

export default function CentersGuide() {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("الكل");
  const [service, setService] = useState("الكل");
  const [reportTarget, setReportTarget] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const allCenters = useMemo(() => [...CENTERS, ...PUBLIC_CENTERS], []);

  const filtered = useMemo(() => {
    return allCenters.filter(c => {
      const matchSearch = !search ||
        c.name_ar.includes(search) ||
        c.city.includes(search) ||
        c.services.some(s => s.includes(search));
      const matchCity = city === "الكل" || c.city === city;
      const matchService = service === "الكل" || c.services.includes(service);
      const matchTab = activeTab === "all" || (activeTab === "public" ? c.type.includes("توجيه عمومي") : !c.type.includes("توجيه عمومي"));
      return matchSearch && matchCity && matchService && matchTab;
    });
  }, [allCenters, search, city, service, activeTab]);

  return (
    <div className={styles.page} dir="rtl">
      {/* Meta */}
      <title>دليل مراكز دعم متلازمة داون بالمغرب | فرحة ريم</title>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroIcon}>🇲🇦 💛</div>
          <h1 className={styles.heroTitle}>دليل مراكز دعم أطفال متلازمة داون بالمغرب</h1>
          <p className={styles.heroSub}>
            لأن الأسرة لا ينبغي أن تبحث وحدها — جمعنا في هذه الصفحة مراكز وجمعيات يمكن أن تساعد في
            التوجيه، التأهيل، التدخل المبكر، الإدماج المدرسي، والدعم النفسي والاجتماعي.
          </p>
          <div className={styles.heroStats}>
            <span>🏢 {CENTERS_STATS.total} مركز وجمعية</span>
            <span>📍 {CENTERS_STATS.cities} مدن</span>
            <span>✅ {CENTERS_STATS.verified} مؤكد</span>
          </div>
          <div className={styles.heroActions}>
            <button className={styles.heroBtnPrimary} onClick={() => document.getElementById("search-section").scrollIntoView({ behavior: "smooth" })}>
              🔍 ابحث عن مركز قريب
            </button>
            <button className={styles.heroBtnSecondary} onClick={() => setShowAdd(true)}>
              ➕ أضف مركزاً
            </button>
          </div>
        </div>
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* تنبيه */}
      <div className={styles.alert}>
        ⚠️ يُنصح بالاتصال بالمركز قبل الزيارة للتأكد من المواعيد والخدمات المتاحة.
        المعلومات محدّثة إلى حدود <strong>{CENTERS_STATS.lastUpdate}</strong>.
      </div>

      {/* بحث وفلترة */}
      <section id="search-section" className={styles.searchSection}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="ابحث باسم المركز أو المدينة أو نوع الخدمة..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          <select value={city} onChange={e => setCity(e.target.value)} className={styles.select}>
            {ALL_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={service} onChange={e => setService(e.target.value)} className={styles.select}>
            <option value="الكل">كل الخدمات</option>
            {ALL_SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className={styles.tabs}>
          {[["all", "الكل"], ["specialized", "متخصصة"], ["public", "توجيه عمومي"]].map(([val, label]) => (
            <button
              key={val}
              className={`${styles.tab} ${activeTab === val ? styles.tabActive : ""}`}
              onClick={() => setActiveTab(val)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className={styles.resultCount}>
          {filtered.length === 0 ? "لا توجد نتائج — جرّب تغيير الفلتر" : `${filtered.length} مركز / جمعية`}
        </p>
      </section>

      {/* بطاقات المراكز */}
      <section className={styles.cardsSection}>
        {filtered.length === 0 ? (
          <div className={styles.empty}>
            <span>🔍</span>
            <p>لا توجد نتائج. جرّب البحث بكلمة مختلفة أو غيّر الفلتر.</p>
          </div>
        ) : (
          <div className={styles.cardsGrid}>
            {filtered.map(center => (
              <CenterCard key={center.id} center={center} onReport={setReportTarget} />
            ))}
          </div>
        )}
      </section>

      {/* كيف تختار المركز */}
      <section className={styles.adviceSection}>
        <h2 className={styles.sectionTitle}>🎯 كيف تختار المركز المناسب لطفلك؟</h2>
        <div className={styles.adviceGrid}>
          {[
            ["👶", "اسأل عن التدخل المبكر", "خاصة إذا كان طفلك دون 5 سنوات — هو الأهم."],
            ["🗣️", "اسأل عن تقويم النطق", "هل يتوفر أخصائي نطق متخصص في التثلث الصبغي؟"],
            ["🏃", "اسأل عن الترويض الحركي", "العلاج الوظيفي والفيزيائي ضروري لتحسين الحركة."],
            ["🏫", "اسأل عن الدمج المدرسي", "هل سبق للمركز إدماج أطفال في مدارس عادية؟"],
            ["👥", "اسأل عن حجم المجموعات", "مجموعات صغيرة (3-6 أطفال) تعني اهتماماً أفضل."],
            ["💰", "اسأل عن المساهمة الشهرية", "هل الخدمات مجانية أم بمساهمة؟ هل يوجد دعم للأسر المعوزة؟"],
            ["⏳", "اسأل عن لائحة الانتظار", "بعض المراكز بها طابور انتظار — تقدّم بطلبك مبكراً."],
            ["🤝", "اطلب زيارة أولية", "قبل أي تسجيل، قم بزيارة المركز وتحدّث مع المشرفين."],
          ].map(([icon, title, body]) => (
            <div key={title} className={styles.adviceCard}>
              <span className={styles.adviceIcon}>{icon}</span>
              <h4>{title}</h4>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* أسئلة عند الاتصال */}
      <section className={styles.questionsSection}>
        <h2 className={styles.sectionTitle}>📞 أسئلة جاهزة — اطرحها عند الاتصال</h2>
        <div className={styles.questionsList}>
          {[
            "هل تستقبلون أطفال ذوي متلازمة داون / التثلث الصبغي 21؟",
            "ما عمر الأطفال الذين تستقبلونهم؟",
            "هل تقدمون التدخل المبكر؟",
            "هل لديكم أخصائي تقويم النطق؟",
            "هل لديكم ترويض نفسي حركي (Psychomotricité)؟",
            "هل تساعدون في الدمج المدرسي؟",
            "ما الوثائق المطلوبة للتسجيل؟",
            "هل الخدمات مجانية أم بمساهمة شهرية؟",
            "هل يمكن أخذ موعد أولي للزيارة والاطلاع على المركز؟",
          ].map((q, i) => (
            <div key={i} className={styles.questionItem}>
              <span className={styles.qNumber}>{i + 1}</span>
              <p>{q}</p>
            </div>
          ))}
        </div>
      </section>

      {/* المصادر */}
      <section className={styles.sourcesSection}>
        <h2 className={styles.sectionTitle}>📚 المصادر والمراجع</h2>
        <div className={styles.sourcesList}>
          {[
            ["Orphanet", "https://www.orpha.net", "قاعدة بيانات دولية للأمراض النادرة وجمعياتها"],
            ["Edulink Maroc", "https://www.edulink.ma", "دليل الجمعيات والمراكز التربوية بالمغرب"],
            ["Annuaire-Gratuit.ma", "https://www.annuaire-gratuit.ma", "دليل الجمعيات المغربية"],
            ["Association Malaïka Marrakech", "https://www.association-malaika-marrakech.com", "الموقع الرسمي"],
            ["handicapamal.ma", "http://handicapamal.ma", "الموقع الرسمي لجمعية أمل"],
            ["التعاون الوطني", "https://www.entraide.ma", "الموقع الرسمي"],
            ["RabatCity.ma", "https://rabatcity.ma", "دليل جمعيات الرباط"],
          ].map(([name, url, desc]) => (
            <div key={name} className={styles.sourceItem}>
              <a href={url} target="_blank" rel="noreferrer">{name}</a>
              <span>{desc}</span>
            </div>
          ))}
        </div>
        <p className={styles.sourcesNote}>
          نحرص على تحديث هذا الدليل باستمرار، ومع ذلك قد تتغير أرقام الهاتف أو العناوين.
          المرجو الاتصال بالمركز قبل الزيارة.
        </p>
      </section>

      {/* إضافة مركز */}
      <section className={styles.addSection}>
        <div className={styles.addBox}>
          <h3>هل تعرف مركزاً غير مدرج في الدليل؟</h3>
          <p>المعلومة الصحيحة تختصر على الأسرة طريقاً طويلاً.</p>
          <button className={styles.heroBtnPrimary} onClick={() => setShowAdd(true)}>
            ➕ أضف مركزاً أو جمعية
          </button>
        </div>
      </section>

      {/* توقيع */}
      <footer className={styles.pageFooter}>
        <p>إعداد وتنسيق: <strong>الأستاذ أحمد بوعمود</strong></p>
        <p>ضمن مشروع <strong>فرحة ريم | متلازمة داون ببساطة</strong></p>
      </footer>

      {/* Modals */}
      {reportTarget && <ReportModal center={reportTarget} onClose={() => setReportTarget(null)} />}
      {showAdd && <AddCenterModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
