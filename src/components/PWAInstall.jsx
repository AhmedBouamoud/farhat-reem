import { useState, useEffect } from 'react';
import styles from './PWAInstall.module.css';

export default function PWAInstall() {
  const [prompt, setPrompt] = useState(null);
  const [showAndroid, setShowAndroid] = useState(false);
  const [showIOS, setShowIOS] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Android / Chrome
    const handler = (e) => {
      e.preventDefault();
      setPrompt(e);
      setTimeout(() => setShowAndroid(true), 5000);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // iOS detection
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isInStandalone = window.navigator.standalone === true;
    const isDismissed = localStorage.getItem('pwa_ios_dismissed');
    if (isIOS && !isInStandalone && !isDismissed) {
      setTimeout(() => setShowIOS(true), 6000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installAndroid = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    setPrompt(null);
    setShowAndroid(false);
  };

  const dismissIOS = () => {
    localStorage.setItem('pwa_ios_dismissed', '1');
    setShowIOS(false);
    setDismissed(true);
  };

  if (dismissed) return null;

  // Android banner
  if (showAndroid && prompt) return (
    <div className={`${styles.banner} ${styles.show}`}>
      <div className={styles.ico}>📱</div>
      <div className={styles.txt}>
        <div className={styles.bh}>ثبّت التطبيق مجاناً</div>
        <div className={styles.bp}>احفظ فرحة ريم على شاشتك للوصول السريع</div>
      </div>
      <button className={styles.install} onClick={installAndroid}>ثبّت</button>
      <button className={styles.dismiss} onClick={() => setShowAndroid(false)}>✕</button>
    </div>
  );

  // iOS instructions
  if (showIOS) return (
    <div className={`${styles.iosBanner} ${styles.show}`}>
      <div className={styles.iosHd}>
        <div className={styles.iosTitle}>📱 ثبّت التطبيق على iPhone</div>
        <button className={styles.dismiss} onClick={dismissIOS}>✕</button>
      </div>
      <div className={styles.iosSteps}>
        <div className={styles.step}><span>1</span> اضغط على زر المشاركة <strong>⎙</strong></div>
        <div className={styles.step}><span>2</span> اختر <strong>"إضافة إلى الشاشة الرئيسية"</strong></div>
        <div className={styles.step}><span>3</span> اضغط <strong>إضافة</strong> — وانتهى! 🎉</div>
      </div>
    </div>
  );

  return null;
}
