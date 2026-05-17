/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';

import { Navigation } from './components/Navigation';
import { GlobalAudio } from './components/GlobalAudio';
import { SkyBackground } from './components/webgl/SkyBackground';
import { EnvelopeEntry } from './components/EnvelopeEntry';

import { Home } from './pages/Home';
import { Journal } from './pages/Journal';
import { Archive } from './pages/Archive';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [hasEntered, setHasEntered] = useState(() => {
    return sessionStorage.getItem('hasEntered') === 'true';
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleEnter = () => {
    setHasEntered(true);
    sessionStorage.setItem('hasEntered', 'true');
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      
      {!hasEntered ? (
        <EnvelopeEntry onEnter={handleEnter} />
      ) : (
        <div className="relative min-h-screen w-full flex flex-col font-sans">
          <SkyBackground />
          <Navigation />
          <GlobalAudio hasEntered={hasEntered} />
          
          <main className="flex-grow z-10 w-full relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="/archive" element={<Archive />} />
            </Routes>
          </main>
        </div>
      )}
    </BrowserRouter>
  );
}
