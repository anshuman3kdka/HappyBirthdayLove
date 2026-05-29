/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from 'react';
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

export type SceneId = 'home' | 'journal' | 'archive' | 'projection';

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

function ActiveScene({ activeScene, onSceneChange }: { activeScene: SceneId; onSceneChange: (scene: SceneId) => void }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeScene]);

  return (
    <AnimatePresence mode="wait">
      {activeScene === 'home' && <Home key="home" />}
      {activeScene === 'journal' && <Journal key="journal" onOpenArchive={() => onSceneChange('archive')} />}
      {activeScene === 'archive' && <Archive key="archive" />}
      {activeScene === 'projection' && <Projection key="projection" />}
    </AnimatePresence>
  );
}

export default function App() {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const [activeScene, setActiveScene] = useState<SceneId>('home');

  useEffect(() => {
    sessionStorage.removeItem('hasEntered');
  }, []);

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
  };

  const handleSceneChange = useCallback((scene: SceneId) => {
    setActiveScene(scene);
  }, []);

  return (
    <WishProvider>
      <AnimatePresence mode="wait">
        {!isPreloaded && (
          <SitePreloader key="preloader" onComplete={() => setIsPreloaded(true)} />
        )}
      </AnimatePresence>

      {isPreloaded && <GlobalAudio hasEntered={hasEntered} activeScene={activeScene} />}

      {isPreloaded && !hasEntered ? (
        <EnvelopeEntry onEnter={handleEnter} />
      ) : isPreloaded && hasEntered ? (
        <div className="relative min-h-screen w-full flex flex-col font-sans">
          <SkyBackground activeScene={activeScene} />
          <GlobalDust />
          <InteractiveChimes />

          <WishUIWrapper>
            <Navigation activeScene={activeScene} onSceneChange={handleSceneChange} />
            <main className="flex-grow z-10 w-full min-h-[100dvh] relative">
              <ActiveScene activeScene={activeScene} onSceneChange={handleSceneChange} />
            </main>
          </WishUIWrapper>
        </div>
      ) : null}
    </WishProvider>
  );
}
