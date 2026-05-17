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

function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1, delay: 1.2 } }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5 } }}
          >
            <Home />
          </motion.div>
        } />
        <Route path="/journal" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1, delay: 1.2 } }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5 } }}
          >
            <Journal />
          </motion.div>
        } />
        <Route path="/archive" element={
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 1, delay: 1.2 } }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.5 } }}
          >
            <Archive />
          </motion.div>
        } />
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
      <ScrollToTop />
      
      <AnimatePresence>
        {!isPreloaded && (
          <SitePreloader onComplete={() => setIsPreloaded(true)} />
        )}
      </AnimatePresence>

      {isPreloaded && !hasEntered ? (
        <EnvelopeEntry onEnter={handleEnter} />
      ) : isPreloaded && hasEntered ? (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative min-h-screen w-full flex flex-col font-sans"
        >
          <SkyBackground />
          <GlobalDust />
          <Navigation />
          <GlobalAudio hasEntered={hasEntered} />
          <InteractiveChimes />
          
          <main className="flex-grow z-10 w-full relative">
            <AppRoutes />
          </main>
        </motion.div>
      ) : null}
    </BrowserRouter>
  );
}
