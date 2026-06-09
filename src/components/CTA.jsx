import { useState } from 'react';
import { supabase } from '../lib/supabase';
import styles from './CTA.module.css';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async () => {
    if (!email || !email.includes('@')) return;
    setLoading(true);
    setErr('');
    const { error } = await supabase.from('subscribers').insert({ email });
    setLoading(false);
    if (error && error.code !== '23505') {
      setErr('حدث خطأ، حاول مجدداً');
    } else {
      setDone(true);
    }
  };

  return (
    <div className={styles.cta}>
      <div className={styles.bg}/>
      <h2 className={styles.h}>ابقَ على تواصل مع مجتمع الفرح 💛</h2>
      <p className={styles.p}>سجّل بريدك لتصلك أحدث المقالات وقصص النجاح وجلسات الدعم مجاناً</p>
      {done
        ? <div className={styles.success}>✅ أهلاً بك في عائلة فرحة ريم 🌟</div>
        : <>
            <div className={styles.row}>
              <input className={styles.input} placeholder="بريدك الإلكتروني..." type="email"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && submit()}/>
              <button className={styles.btn} onClick={submit} disabled={loading}>
                {loading ? '...' : 'انضم مجاناً'}
              </button>
            </div>
            {err && <p style={{color:'#f87171',marginTop:'8px',fontSize:'13px'}}>{err}</p>}
          </>
      }
    </div>
  );
}
