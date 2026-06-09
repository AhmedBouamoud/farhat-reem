import { useState, useEffect } from 'react';
import { FadeIn } from './Section';
import { supabase } from '../lib/supabase';
import styles from './RimCorner.module.css';

function AddMemoryForm({ onDone }) {
  const [title, setTitle] = useState('');
  const [age, setAge] = useState('');
  const [icon, setIcon] = useState('🌸');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!title.trim() || !age.trim()) return;
    setLoading(true);
    await supabase.from('rim_memories').insert({ title, age, icon, approved: false });
    setLoading(false);
    setSent(true);
    setTimeout(onDone, 2000);
  };

  if (sent) return <p style={{color:'#16a34a',textAlign:'center',padding:'16px'}}>✅ تم إرسال الذكرى — ستظهر بعد المراجعة 🌸</p>;

  return (
    <div style={{background:'rgba(255,255,255,.08)',borderRadius:'16px',padding:'20px',marginTop:'16px'}}>
      <div style={{display:'flex',gap:'8px',marginBottom:'10px'}}>
        {['🌸','⭐','🎨','🦋','🌊','🎭','📚','🏆'].map(e => (
          <button key={e} onClick={() => setIcon(e)}
            style={{fontSize:'20px',background:icon===e?'rgba(245,200,66,.3)':'transparent',border:'none',borderRadius:'8px',padding:'4px',cursor:'pointer'}}>
            {e}
          </button>
        ))}
      </div>
      <input placeholder="عنوان الذكرى" value={title} onChange={e => setTitle(e.target.value)}
        style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid rgba(255,255,255,.2)',background:'rgba(255,255,255,.1)',color:'white',fontFamily:'inherit',marginBottom:'8px',direction:'rtl'}}/>
      <input placeholder="العمر أو الوقت (مثال: عمر 3 سنوات)" value={age} onChange={e => setAge(e.target.value)}
        style={{width:'100%',padding:'10px',borderRadius:'10px',border:'1px solid rgba(255,255,255,.2)',background:'rgba(255,255,255,.1)',color:'white',fontFamily:'inherit',marginBottom:'12px',direction:'rtl'}}/>
      <button onClick={submit} disabled={loading}
        style={{background:'var(--y)',color:'var(--n)',padding:'10px 24px',borderRadius:'10px',border:'none',fontFamily:'inherit',fontWeight:'700',cursor:'pointer',width:'100%'}}>
        {loading ? 'جاري الإرسال...' : '📸 أضف الذكرى'}
      </button>
    </div>
  );
}

export default function RimCorner() {
  const [milestones, setMilestones] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    supabase.from('rim_memories').select('*').eq('approved', true).order('created_at')
      .then(({ data }) => data && setMilestones(data));
  }, []);

  return (
    <section className={styles.rim} id="rim">
      <div className={styles.orb1}/><div className={styles.orb2}/>
      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.badge}>✦ ركن خاص جداً</div>
          <h2 className={styles.h}>ريم<br/><em>بوعمود</em></h2>
          <p className={styles.sub}>نجمتنا الصغيرة من أكادير 🌟</p>
          <div className={styles.line}/>
          <p className={styles.p}>ريم ليست مجرد اسم في هذه المنصة — هي الروح التي أشعلت فكرتها. طفلة من أكادير المغرب تحمل قلباً كبيراً وروحاً تنير كل مكان تدخله.</p>
          <div className={styles.quote}>
            <p className={styles.qTxt}>"قبل ريم، كنتُ أعرف الحياة. بعدها، صرتُ أفهمها. علّمتني أن أجمل ما في الوجود لا يُقاس ولا يُوصف — يُعاش فقط في حضورها."</p>
            <div className={styles.qSig}>— أ. أحمد بوعمود، والد ريم ومعلم · أكادير 🇲🇦</div>
          </div>
          <div className={styles.ms}>
            {milestones.map((m) => (
              <div key={m.id} className={styles.msItem}>
                <div className={styles.msIco}>{m.icon}</div>
                <div>
                  <div className={styles.msTxt}>{m.title}</div>
                  <div className={styles.msAge}>⏰ {m.age}</div>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.btns}>
            <button className={styles.btnY} onClick={() => setShowForm(v => !v)}>
              {showForm ? '✕ إغلاق' : '📸 أضف ذكرى'}
            </button>
            <button className={styles.btnO}>📖 قصة ريم كاملة</button>
          </div>
          {showForm && <AddMemoryForm onDone={() => setShowForm(false)} />}
        </div>
        <div className={styles.right}>
          <div className={styles.mainWrap}>
            <img src="/rim-stage.jpg" alt="ريم على المسرح" className={styles.mainImg}/>
          </div>
          <div className={styles.smGrid}>
            {['/rim-dad.jpg','/rim-pool.jpg','/rim-kaftan.jpg','/rim-paint.jpg','/rim-chinese.jpg','/rim-art.jpg'].map((s,i)=>(
              <div key={i} className={styles.smItem}>
                <img src={s} alt={`ريم ${i+1}`} loading="lazy"/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
