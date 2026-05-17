import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cat, Heart } from 'lucide-react';
import { resolveAssetUrl } from '../lib/assetUtils';
import envelopeContent from '../content/envelope.json';

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
    
    // Dispatch synchronously to immediately unlock global audio contexts while still in user interaction handler
    window.dispatchEvent(new Event('envelopeOpened'));

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
      <audio ref={audioRef} src={resolveAssetUrl("/assets/audio/envelope-open", "audio")} />
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
            <div className="absolute inset-0 bg-[#e3d5c8] rounded shadow-2xl transition-transform duration-500 group-hover:scale-105 overflow-hidden">
               {/* Faint watermark of entwined bougainvillea & carnation flowers */}
               <svg className="absolute -bottom-6 -right-6 w-32 h-32 opacity-[0.04] text-pink-950 pointer-events-none rotate-12" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M 180 180 C 130 100, 70 140, 20 20" />
                 <path d="M 120 70 C 140 30, 160 50, 140 90 Z" />
                 <path d="M 130 80 C 170 80, 160 110, 120 100 Z" />
                 <path d="M 60 110 C 20 90, 30 50, 70 70 C 80 60, 100 80, 80 100 Z" fill="currentColor" fillOpacity="0.2"/>
                 <circle cx="80" cy="40" r="8" />
                 <circle cx="150" cy="130" r="6" />
                 <path d="M 80 40 Q 70 50 65 75" />
                 <path d="M 150 130 Q 140 140 135 125" />
               </svg>
            </div>
            
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
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[10px] w-12 h-12 bg-red-800 rounded-full shadow-inner z-30 flex items-center justify-center transition-all hover:scale-125 ${showSealSecret ? 'shadow-[0_0_15px_rgba(230,230,250,0.6)] bg-purple-900' : 'group-hover:scale-110'}`}
            >
              <span className={`font-serif text-xl select-none transition-colors flex items-center justify-center ${showSealSecret ? 'text-purple-100' : 'text-red-900/50'}`}>
                {showSealSecret ? <Cat className="w-5 h-5 fill-purple-200 text-purple-200" /> : envelopeContent.sealInitial}
              </span>
              
              {/* Confetti Burst (Bougainvillea and Carnation colors) */}
              {showSealSecret && (
                <motion.div className="absolute inset-0 pointer-events-none" initial="hidden" animate="visible">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: i % 2 === 0 ? '#D94689' : '#FFB3BA' }}
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
            <div className="absolute inset-0 bg-[#e3d5c8] rounded z-0 overflow-hidden">
               {/* Faint watermark of entwined bougainvillea & carnation flowers */}
               <svg className="absolute -bottom-6 -right-6 w-32 h-32 opacity-[0.04] text-pink-950 pointer-events-none rotate-12" viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                 <path d="M 180 180 C 130 100, 70 140, 20 20" />
                 <path d="M 120 70 C 140 30, 160 50, 140 90 Z" />
                 <path d="M 130 80 C 170 80, 160 110, 120 100 Z" />
                 <path d="M 60 110 C 20 90, 30 50, 70 70 C 80 60, 100 80, 80 100 Z" fill="currentColor" fillOpacity="0.2"/>
                 <circle cx="80" cy="40" r="8" />
                 <circle cx="150" cy="130" r="6" />
                 <path d="M 80 40 Q 70 50 65 75" />
                 <path d="M 150 130 Q 140 140 135 125" />
               </svg>
            </div>
            
            {/* Letter pulling up */}
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: -160 }}
              transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute bottom-4 left-4 right-4 h-40 bg-[#fffefc] shadow-md z-10 flex items-center justify-center p-6 border border-amber-50/50"
            >
               <div className="w-full text-center font-handwriting text-2xl text-zinc-800 opacity-60">
                 {envelopeContent.message}
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
                <span className="font-serif text-red-900/50 text-xl">{envelopeContent.sealInitial}</span>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
