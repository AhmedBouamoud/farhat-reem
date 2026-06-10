import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

const LINKS = [
  { label: 'الرئيسية',   href: '#hero'    },
  { label: 'المعرفة',    href: '#edu'     },
  { label: 'العائلة',    href: '#family'  },
  { label: 'مكتبة الفرح', href: '#gallery' },
  { label: 'ركن ريم ✨',  href: '#rim'    },
  { label: 'نصائح',      href: '#tips'    },
];

export default function Navbar({ onNavigate, currentPage }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const close = () => { setOpen(false); document.body.style.overflow = ''; };
  const toggle = () => {
    setOpen(v => {
      document.body.style.overflow = v ? '' : 'hidden';
      return !v;
    });
  };

  const goHome = (e) => { e.preventDefault(); close(); onNavigate && onNavigate('home'); };
  const goCenters = (e) => { e.preventDefault(); close(); onNavigate && onNavigate('centers'); };

  return (
    <>
      <nav className={`${styles.nb} ${scrolled ? styles.scrolled : ''}`}>
        <a href="#hero" className={styles.brand} onClick={goHome}>
          <div className={styles.mark}>🌟</div>
          <span className={styles.name}>فرحة <em>ريم</em></span>
        </a>
        <ul className={styles.links}>
          {currentPage !== 'centers' && LINKS.map(l => (
            <li key={l.href}><a href={l.href}>{l.label}</a></li>
          ))}
          <li>
            <a href="#centers" onClick={goCenters}
              className={currentPage === 'centers' ? styles.cta : ''}>
              🗺️ دليل المراكز
            </a>
          </li>
          {currentPage !== 'centers' && (
            <li><a href="#support" className={styles.cta}>احصل على الدعم</a></li>
          )}
        </ul>
        <button className={`${styles.ham} ${open ? styles.open : ''}`} onClick={toggle} aria-label="القائمة">
          <span/><span/><span/>
        </button>
      </nav>

      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        <a href="#hero" onClick={goHome}>🏠 الرئيسية</a>
        {currentPage !== 'centers' && LINKS.slice(1).map(l => (
          <a key={l.href} href={l.href} onClick={close}>{l.label}</a>
        ))}
        <a href="#centers" onClick={goCenters} className={styles.drawerCta}>🗺️ دليل المراكز</a>
        {currentPage !== 'centers' && (
          <a href="#support" onClick={close} className={styles.drawerCta}>❤️ احصل على الدعم</a>
        )}
      </div>
    </>
  );
}
