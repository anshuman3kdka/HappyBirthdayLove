import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnvelopeEntryProps {
  onEnter: () => void;
}

export function EnvelopeEntry({ onEnter }: EnvelopeEntryProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    setIsOpen(true);
    // After animation sequence, trigger enter
    setTimeout(() => {
      onEnter();
    }, 3500); // 3.5s total duration for the sequence
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[10px] w-12 h-12 bg-red-800 rounded-full shadow-inner z-30 flex items-center justify-center transition-all group-hover:scale-110">
              <span className="font-serif text-red-900/50 text-xl select-none">N</span>
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
