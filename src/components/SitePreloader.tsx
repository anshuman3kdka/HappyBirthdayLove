import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_ASSETS = [
  // Images
  '/assets/home-photo-1.jpg',
  '/assets/home-photo-2.jpg',
  '/assets/home-photo-3.jpg',
  '/assets/home-photo-4.jpg',
  '/assets/journal-bg-1.jpg',
  '/assets/journal-bg-2.jpg',
  '/assets/journal-bg-3.jpg',
  '/assets/archive-photo-1.jpg',
  '/assets/archive-photo-2.jpg',
  '/assets/archive-photo-3.jpg',
  '/assets/archive-photo-4.jpg',
  '/assets/archive-photo-5.jpg',
  '/assets/archive-film-1.jpg',
  '/assets/archive-film-2.jpg',
  '/assets/archive-film-3.jpg',
  '/assets/archive-film-4.jpg',
  '/assets/archive-film-5.jpg',
  '/assets/archive-film-6.jpg',
  // Audio
  '/assets/envelope-open.mp3',
  '/assets/audio-ambient.mp3',
  '/assets/audio-intimate.mp3',
  '/assets/slide-projector.mp3',
  '/assets/archive-voicenote.mp3',
  // Video
  '/assets/archive-video.mp4',
];

export function SitePreloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = ALL_ASSETS.length;
    let hasReturned = false;

    if (totalAssets === 0) {
      setIsFinished(true);
      return;
    }

    const updateProgress = () => {
      loadedCount++;
      const currentProgress = (loadedCount / totalAssets) * 100;
      setProgress(currentProgress);

      if (loadedCount === totalAssets && !hasReturned) {
        hasReturned = true;
        setTimeout(() => {
          setIsFinished(true);
        }, 800); // slight delay for smooth 100% display
      }
    };

    ALL_ASSETS.forEach((src) => {
      if (src.endsWith('.jpg') || src.endsWith('.png') || src.endsWith('.svg')) {
        const img = new Image();
        img.src = src;
        img.onload = updateProgress;
        img.onerror = updateProgress; // still continue even if some placeholder is missing
      } else if (src.endsWith('.mp3') || src.endsWith('.wav')) {
        const audio = new Audio();
        audio.src = src;
        audio.oncanplaythrough = updateProgress;
        audio.onerror = updateProgress;
        audio.load();
      } else if (src.endsWith('.mp4')) {
        const video = document.createElement('video');
        video.src = src;
        video.oncanplaythrough = updateProgress;
        video.onerror = updateProgress;
        video.load();
      } else {
        updateProgress();
      }
    });
  }, []);

  useEffect(() => {
    if (isFinished) {
      const timeout = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isFinished, onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#faf9f6] text-gray-900"
        >
          <div className="flex flex-col items-center max-w-xs w-full px-6">
            <motion.div 
              className="text-xs uppercase tracking-[0.2em] mb-4 font-mono text-gray-500"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Preparing memories
            </motion.div>
            
            <div className="w-full h-[1px] bg-gray-200 relative overflow-hidden">
              <motion.div 
                className="absolute top-0 left-0 bottom-0 bg-gray-600"
                initial={{ width: '0%' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            
            <motion.div 
              className="mt-4 font-mono text-[10px] text-gray-400 self-end"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {Math.round(progress)}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
