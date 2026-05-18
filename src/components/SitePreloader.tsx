import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { preloadAsset } from '../lib/assetUtils';
import { ALL_ASSETS } from 'virtual:assets';
import siteContent from '../content/site.json';

export function SitePreloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    const totalAssets = ALL_ASSETS.length;
    let hasReturned = false;

    if (totalAssets === 0) {
      setProgress(100);
      setTimeout(() => {
        setIsFinished(true);
      }, 500);
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

    ALL_ASSETS.forEach(({ basePath, type, fullPath }) => {
      preloadAsset(basePath, type, updateProgress, fullPath);
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
              {siteContent.preloader.label}
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
