import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface EnvelopeEntryProps {
  onEnter: () => void;
}

export function EnvelopeEntry({ onEnter }: EnvelopeEntryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [sealClicks, setSealClicks] = useState(0);
  const [showSealSecret, setShowSealSecret] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleClick = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('Audio error:', e));
    }
    // After animation sequence, trigger enter
    setTimeout(() => {
      onEnter();
    }, 3500); // 3.5s total duration for the sequence
  };

  const handleSealClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent opening envelope
    if (isOpen) return;
    
    const newClicks = sealClicks + 1;
    setSealClicks(newClicks);
    if (newClicks === 3) {
      setShowSealSecret(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex items-center justify-center">
      <audio ref={audioRef} src="/assets/envelope-open.mp3" />
      <AnimatePresence>
        {!isOpen ? (
          <motion.div
            key="envelope-closed"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: 50, transition: { duration: 0.8, ease: "easeIn" } }}
            className="cursor-pointer group relative w-64 h-48"
            onClick={handleClick}
          >
            {/* Base Envelope */}
            <div className="absolute inset-0 bg-[#e3d5c8] rounded shadow-2xl transition-transform duration-500 group-hover:scale-105" />
            
            {/* Flap (Closed) */}
            <div 
              className="absolute top-0 left-0 w-0 h-0
                         border-l-[128px] border-l-transparent
                         border-r-[128px] border-r-transparent
                         border-t-[96px] border-t-[#d4c5b6]
                         drop-shadow-md z-20"
            />
            
            {/* Front cutouts for geometry */}
            <div className="absolute bottom-0 left-0 w-0 h-0
                         border-l-[128px] border-l-transparent
                         border-r-[128px] border-r-transparent
                         border-b-[96px] border-b-[#fdfbf7] z-10" />
            <div className="absolute bottom-0 left-0 w-0 h-0
                         border-l-[128px] border-l-[#f0eadc]
                         border-t-[96px] border-t-transparent
                         border-b-[96px] border-b-transparent z-10" />
            <div className="absolute bottom-0 right-0 w-0 h-0
                         border-r-[128px] border-r-[#f0eadc]
                         border-t-[96px] border-t-transparent
                         border-b-[96px] border-b-transparent z-10" />

            {/* Wax Seal */}
            <div 
              onClick={handleSealClick}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[10px] w-12 h-12 bg-red-800 rounded-full shadow-inner z-30 flex items-center justify-center transition-all hover:scale-125 ${showSealSecret ? 'shadow-[0_0_15px_rgba(220,38,38,0.8)] bg-red-700' : 'group-hover:scale-110'}`}
            >
              <span className={`font-serif text-xl select-none transition-colors flex items-center justify-center ${showSealSecret ? 'text-red-100' : 'text-red-900/50'}`}>
                {showSealSecret ? <Heart className="w-5 h-5 fill-red-100 text-red-100" /> : 'N'}
              </span>
              
              {/* Confetti Burst */}
              {showSealSecret && (
                <motion.div className="absolute inset-0 pointer-events-none" initial="hidden" animate="visible">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: i % 2 === 0 ? '#fbbf24' : '#f87171' }}
                      variants={{
                        hidden: { x: '-50%', y: '-50%', scale: 0, opacity: 1, top: '50%', left: '50%' },
                        visible: {
                          x: `calc(-50% + ${Math.cos(i * (Math.PI / 4)) * 50}px)`,
                          y: `calc(-50% + ${Math.sin(i * (Math.PI / 4)) * 50}px)`,
                          scale: [0, 1.5, 0],
                          opacity: [1, 1, 0],
                          transition: { duration: 0.8, ease: "easeOut" }
                        }
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="envelope-opening"
            className="relative w-64 h-48"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, transition: { delay: 2.8, duration: 0.8 } }}
          >
            {/* Base Envelope */}
            <div className="absolute inset-0 bg-[#e3d5c8] rounded z-0" />
            
            {/* Letter pulling up */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: -160 }}
              transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-4 left-4 right-4 h-40 bg-[#fffefc] shadow-md z-10 flex items-center justify-center p-6 border border-amber-50/50"
            >
               <div className="w-full text-center font-handwriting text-2xl text-zinc-800 opacity-60">
                 for you.
               </div>
            </motion.div>

            {/* Flap (Opening) */}
            <motion.div 
              initial={{ rotateX: 0 }}
              animate={{ rotateX: 180 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ transformOrigin: 'top' }}
              className="absolute top-0 left-0 w-0 h-0
                         border-l-[128px] border-l-transparent
                         border-r-[128px] border-r-transparent
                         border-t-[96px] border-t-[#d4c5b6]
                         z-20 backface-hidden"
            />
            {/* Backside of Flap so it doesn't look weird when flipped */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0 }}
              className="absolute top-[-96px] left-0 w-0 h-0
                         border-l-[128px] border-l-transparent
                         border-r-[128px] border-r-transparent
                         border-b-[96px] border-b-[#c4b5a6]
                         z-0"
            />

            {/* Front cutouts */}
            <div className="absolute bottom-0 left-0 w-0 h-0
                         border-l-[128px] border-l-transparent
                         border-r-[128px] border-r-transparent
                         border-b-[96px] border-b-[#fdfbf7] z-30" />
            <div className="absolute bottom-0 left-0 w-0 h-0
                         border-l-[128px] border-l-[#f0eadc]
                         border-t-[96px] border-t-transparent
                         border-b-[96px] border-b-transparent z-30" />
            <div className="absolute bottom-0 right-0 w-0 h-0
                         border-r-[128px] border-r-[#f0eadc]
                         border-t-[96px] border-t-transparent
                         border-b-[96px] border-b-transparent z-30" />
            
             {/* Wax seal breaking (disappears) */}
             <motion.div
               animate={{ opacity: 0, scale: 0.5 }}
               transition={{ duration: 0.3, ease: "easeOut" }}
               className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[10px] w-12 h-12 bg-red-800 rounded-full shadow-inner z-40 flex items-center justify-center"
             >
                <span className="font-serif text-red-900/50 text-xl">N</span>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
