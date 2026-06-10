import { useState } from 'react';
import Navbar        from './components/Navbar';
import Hero          from './components/Hero';
import StatsBanner   from './components/StatsBanner';
import Knowledge     from './components/Knowledge';
import Family        from './components/Family';
import Videos        from './components/Videos';
import Gallery       from './components/Gallery';
import RimCorner     from './components/RimCorner';
import Tips          from './components/Tips';
import Support       from './components/Support';
import CTA           from './components/CTA';
import Footer        from './components/Footer';
import Floaters      from './components/Floaters';
import PWAInstall    from './components/PWAInstall';
import CentersGuide  from './components/CentersGuide';

export default function App() {
  const [page, setPage] = useState(
    window.location.hash === '#/centers' ? 'centers' : 'home'
  );

  const navigate = (p) => {
    setPage(p);
    window.location.hash = p === 'centers' ? '#/centers' : '';
    window.scrollTo(0, 0);
  };

  if (page === 'centers') {
    return (
      <>
        <Navbar onNavigate={navigate} currentPage={page} />
        <CentersGuide />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar onNavigate={navigate} currentPage={page} />
      <Hero/>
      <StatsBanner/>
      <Knowledge/>
      <Family/>
      <Videos/>
      <Gallery/>
      <RimCorner/>
      <Tips/>
      <Support/>
      <CTA onNavigateCenters={() => navigate('centers')} />
      <Footer/>
      <Floaters/>
      <PWAInstall/>
    </>
  );
}
