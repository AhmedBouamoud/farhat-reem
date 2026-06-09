import Navbar      from './components/Navbar';
import Hero        from './components/Hero';
import StatsBanner from './components/StatsBanner';
import Knowledge   from './components/Knowledge';
import Family      from './components/Family';
import Videos      from './components/Videos';
import Gallery     from './components/Gallery';
import RimCorner   from './components/RimCorner';
import Tips        from './components/Tips';
import Support     from './components/Support';
import CTA         from './components/CTA';
import Footer      from './components/Footer';
import Floaters    from './components/Floaters';
import PWAInstall  from './components/PWAInstall';

export default function App() {
  return (
    <>
      <Navbar/>
      <Hero/>
      <StatsBanner/>
      <Knowledge/>
      <Family/>
      <Videos/>
      <Gallery/>
      <RimCorner/>
      <Tips/>
      <Support/>
      <CTA/>
      <Footer/>
      <Floaters/>
      <PWAInstall/>
    </>
  );
}
