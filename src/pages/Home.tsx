import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const POLAROIDS = [
  { id: 1, src: 'https://images.unsplash.com/photo-1518104593124-ac1fcbd7cedb?w=800&q=80', caption: 'that one thursday', rotation: -4 },
  { id: 2, src: 'https://images.unsplash.com/photo-1522674515714-383783fd0a2f?w=800&q=80', caption: 'coffee at 2pm', rotation: 3 },
  { id: 3, src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80', caption: 'you wouldn\'t stop laughing', rotation: -6 },
  { id: 4, src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80', caption: 'the best day', rotation: 5 },
];

function Typewriter({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText(text.substring(0, i));
        i++;
        if (i > text.length) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return <span>{displayText}</span>;
}

export function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center pt-24 px-6 md:px-24">
      
      {/* Hero Section */}
      <div className="w-full max-w-5xl z-10">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="text-left mt-16 md:mt-0"
        >
          <h1 className="text-[80px] md:text-[112px] leading-[0.9] font-light tracking-tighter mb-4 italic font-serif">
            nehal.
          </h1>
          <div className="h-[1px] w-24 bg-white/20 mb-6"></div>
          <div className="text-xl md:text-2xl font-light opacity-80 leading-relaxed max-w-sm mb-2 font-serif">
            <Typewriter text="happy birthday. this took longer than it should have." delay={2} />
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2, delay: 6.5 }}
              className="inline-block mt-2"
            >
              it was worth it.
            </motion.p>
          </div>
          <p className="font-mono text-[9px] uppercase tracking-[0.4em] opacity-40 mt-6">
            march 4th, 2025 // 02:42 am
          </p>
        </motion.div>
      </div>

      {/* Polaroid Cluster */}
      <div className="relative mt-32 w-full max-w-4xl h-[60vh] flex items-center justify-center z-20">
        <div className="absolute inset-0 flex items-center justify-center flex-wrap gap-4">
          {POLAROIDS.map((p, i) => (
            <motion.div
              key={p.id}
              drag
              dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
              whileHover={{ scale: 1.05, zIndex: 50, y: -10 }}
              whileDrag={{ scale: 1.1, zIndex: 60, cursor: 'grabbing' }}
              initial={{ opacity: 0, y: 50, rotate: p.rotation }}
              animate={{ opacity: 1, y: 0, rotate: p.rotation }}
              transition={{ 
                opacity: { duration: 1, delay: 7 + i * 0.2 },
                y: { duration: 1, delay: 7 + i * 0.2, type: "spring" },
                rotate: { duration: 0 } // Keep rotation static initially
              }}
              style={{ zIndex: 10 + i }}
              className="absolute bg-white p-3 pb-8 cursor-grab shadow-2xl w-48 sm:w-56 polaroid-shadow"
            >
              <div className="w-full aspect-[4/5] overflow-hidden bg-[#222] mb-3">
                <img 
                  src={p.src} 
                  alt="Memory" 
                  className="w-full h-full object-cover grayscale-[10%] sepia-[10%] contrast-110 opacity-90" 
                  draggable={false} 
                />
              </div>
              <div className="w-full text-center">
                <span className="font-handwriting text-black text-sm leading-none tracking-wide select-none">
                  {p.caption}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
