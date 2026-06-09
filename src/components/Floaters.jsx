import { useState, useEffect } from 'react';
import styles from './Floaters.module.css';
export default function Floaters() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const h = () => setShow(window.scrollY > 400);
    window.addEventListener('scroll', h, { passive:true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return (
    <>
      <a href="https://wa.me/212662087421?text=مرحباً%20👋%20أنا%20مهتم%20بمنصة%20فرحة%20ريم%20لدعم%20أطفال%20متلازمة%20داون"
         className={styles.wa} target="_blank" rel="noopener" aria-label="واتساب">💬</a>
      <button className={`${styles.btt} ${show ? styles.visible : ''}`}
        onClick={() => window.scrollTo({top:0,behavior:'smooth'})}
        aria-label="للأعلى">↑</button>
    </>
  );
}
