import { useState, useEffect } from 'react';
import { Section, SectionHeader, FadeIn } from './Section';
import { supabase } from '../lib/supabase';
import styles from './Family.module.css';

function ForumPost({ post }) {
  const [hearts, setHearts] = useState(post.hearts || 0);
  const [liked, setLiked] = useState(false);

  const toggleHeart = async () => {
    const newVal = liked ? hearts - 1 : hearts + 1;
    setLiked(v => !v);
    setHearts(newVal);
    await supabase.from('forum_posts').update({ hearts: newVal }).eq('id', post.id);
  };

  return (
    <div className={styles.post}>
      <div className={styles.postHd}>
        <img src={post.avatar_url} alt={post.author} className={styles.avatar}/>
        <div>
          <div className={styles.author}>{post.author} <span className={styles.loc}>· {post.location}</span></div>
          <div className={styles.time}>تجربة شخصية حقيقية</div>
        </div>
      </div>
      <p className={styles.text}>{post.content}</p>
      <div className={styles.actions}>
        <button className={`${styles.action} ${liked ? styles.liked : ''}`} onClick={toggleHeart}>
          ❤️ {hearts}
        </button>
        <button className={styles.action}>👍 {post.likes || 0}</button>
      </div>
    </div>
  );
}

function ShareForm({ onDone }) {
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async () => {
    if (!author.trim() || !content.trim()) return;
    setLoading(true);
    await supabase.from('forum_posts').insert({
      author,
      location: 'زائر جديد 🌍',
      content,
      avatar_url: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(author) + '&background=F5C842&color=162337',
      likes: 0,
      hearts: 0,
    });
    setLoading(false);
    setSent(true);
    setTimeout(onDone, 2000);
  };

  if (sent) return <div style={{textAlign:'center',padding:'20px',color:'#16a34a'}}>✅ شكراً! ستظهر تجربتك قريباً 💛</div>;

  return (
    <div className={styles.firstShare}>
      <div className={styles.firstIco}>✍️</div>
      <h3 className={styles.firstH}>شارك تجربتك مع العائلة</h3>
      <input
        placeholder="اسمك"
        value={author}
        onChange={e => setAuthor(e.target.value)}
        style={{width:'100%',padding:'10px 14px',borderRadius:'10px',border:'1.5px solid #e5e7eb',marginBottom:'10px',fontFamily:'inherit',fontSize:'14px',direction:'rtl'}}
      />
      <textarea
        placeholder="اكتب تجربتك هنا..."
        value={content}
        onChange={e => setContent(e.target.value)}
        rows={4}
        style={{width:'100%',padding:'10px 14px',borderRadius:'10px',border:'1.5px solid #e5e7eb',marginBottom:'12px',fontFamily:'inherit',fontSize:'14px',resize:'vertical',direction:'rtl'}}
      />
      <button className={styles.firstBtn} onClick={submit} disabled={loading}>
        {loading ? 'جاري الإرسال...' : 'شارك الآن 💛'}
      </button>
    </div>
  );
}

export default function Family() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    supabase.from('forum_posts').select('*').order('created_at', { ascending: false })
      .then(({ data }) => data && setPosts(data));
  }, []);

  return (
    <Section id="family">
      <SectionHeader
        eyebrow="✦ قلب العائلة"
        title="أنتم لستم وحدكم"
        desc="فضاء آمن لمشاركة التجارب الحقيقية — الأفراح والإرهاق والانتصارات الصغيرة"
      />
      <div className={styles.cards}>
        <FadeIn>
          <div className={styles.card}>
            <div className={styles.cardIco} style={{background:'var(--bp)'}}>💆‍♀️</div>
            <h3 className={styles.cardH}>الدعم النفسي للوالدين</h3>
            <p className={styles.cardP}>الإرهاق العاطفي حقيقي ومشروع. مساحة للحديث عن المشاعر الصعبة وإيجاد توازن حقيقي بين رعاية طفلك والاهتمام بنفسك.</p>
            <span className={styles.tagB}>مقالات + جلسات دعم</span>
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div className={styles.card}>
            <div className={styles.cardIco} style={{background:'var(--yp)'}}>👨‍👩‍👦</div>
            <h3 className={styles.cardH}>دليل الأسرة المتكاملة</h3>
            <p className={styles.cardP}>كيف تحافظ على التوازن الزوجي؟ كيف تشرح الأمر لأشقاء الطفل؟ أسئلة حقيقية وإجابات عملية مباشرة.</p>
            <span className={styles.tagY}>أدلة عملية شاملة</span>
          </div>
        </FadeIn>
        <FadeIn delay={200}>
          <div className={styles.card}>
            <div className={styles.cardIco} style={{background:'rgba(122,158,135,.15)'}}>🏫</div>
            <h3 className={styles.cardH}>التواصل مع المدرسة</h3>
            <p className={styles.cardP}>كيف تبني علاقة فعّالة مع معلمة طفلك؟ ما الحقوق التعليمية المكفولة لطفلك؟ دليل الدمج المدرسي الناجح.</p>
            <span className={styles.tagG}>حقوق تعليمية</span>
          </div>
        </FadeIn>
      </div>

      <div className={styles.forumSection}>
        <div className={styles.forumHd}>
          <h3 className={styles.forumTitle}>💬 منتدى التجارب المشتركة</h3>
          <button className={styles.shareBtn} onClick={() => setShowForm(v => !v)}>
            {showForm ? '✕ إغلاق' : '+ شارك تجربتك'}
          </button>
        </div>

        {showForm && <ShareForm onDone={() => setShowForm(false)} />}

        {posts.map(p => <ForumPost key={p.id} post={p} />)}
      </div>
    </Section>
  );
}
