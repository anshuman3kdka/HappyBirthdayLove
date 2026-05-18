/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { motion, AnimatePresence } from 'framer-motion';

import { Navigation } from './components/Navigation';
import { GlobalAudio } from './components/GlobalAudio';
import { InteractiveChimes } from './components/InteractiveChimes';
import { SkyBackground } from './components/webgl/SkyBackground';
import { EnvelopeEntry } from './components/EnvelopeEntry';
import { SitePreloader } from './components/SitePreloader';
import { GlobalDust } from './components/GlobalDust';
import siteContent from './content/site.json';

import { Home } from './pages/Home';
import { Journal } from './pages/Journal';
import { Archive } from './pages/Archive';
import { Projection } from './pages/Projection';
import { WishProvider, useWish } from './contexts/WishContext';

function WishUIWrapper({ children }: { children: React.ReactNode }) {
  const { isHolding, isWishing } = useWish();
  
  return (
    <>
      <div className={`h-full w-full flex-grow flex flex-col relative z-20 ${isHolding ? 'animate-gentle-shake' : ''}`}>
        <motion.div 
          initial={false}
          animate={{ opacity: isWishing ? 0.05 : 1, filter: isWishing ? 'blur(8px)' : 'blur(0px)' }}
          transition={{ duration: 3, ease: 'easeInOut' }}
          className="flex-grow flex flex-col w-full relative z-10"
          style={{ pointerEvents: isWishing ? 'none' : 'auto' }}
        >
          {children}
        </motion.div>
      </div>

      <AnimatePresence>
        {isWishing && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            className="fixed top-1/4 left-0 right-0 z-50 flex justify-center items-center pointer-events-none"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif italic tracking-wider font-light" style={{ textShadow: '0 0 20px rgba(255,255,255,0.4)' }}>
              {siteContent.wishOverlay.message}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/projection" element={<Projection />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

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
      <WishProvider>
        <ScrollToTop />
        
        <AnimatePresence mode="wait">
          {!isPreloaded && (
            <SitePreloader key="preloader" onComplete={() => setIsPreloaded(true)} />
          )}
        </AnimatePresence>

        {isPreloaded && <GlobalAudio hasEntered={hasEntered} />}

        {isPreloaded && !hasEntered ? (
          <EnvelopeEntry onEnter={handleEnter} />
        ) : isPreloaded && hasEntered ? (
          <div className="relative min-h-screen w-full flex flex-col font-sans">
            <SkyBackground />
            <GlobalDust />
            <InteractiveChimes />
            
            <WishUIWrapper>
              <Navigation />
              <main className="flex-grow z-10 w-full relative">
                <AppRoutes />
              </main>
            </WishUIWrapper>
          </div>
        ) : null}
      </WishProvider>
    </BrowserRouter>
  );
}
