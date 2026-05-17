import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

const POLAROIDS = [
  { id: 1, src: '/assets/home-photo-1.jpg', caption: 'Paris, 2024', rotation: -4 },
  { id: 2, src: '/assets/home-photo-2.jpg', caption: 'coffee at 2pm', rotation: 3 },
  { id: 3, src: '/assets/home-photo-3.jpg', caption: 'you wouldn\'t stop laughing', rotation: -6 },
  { id: 4, src: '/assets/home-photo-4.jpg', caption: 'That night on the roof', rotation: 5 },
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
  const constraintsRef = useRef(null);

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
          <h1 className="text-[80px] md:text-[112px] leading-[0.9] font-light tracking-tighter mb-4 italic font-serif relative">
            nehal.
            {/* Soft decorative glow behind text */}
            <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-full z-[-1] pointer-events-none"></div>
          </h1>
          <div className="h-[1px] w-24 bg-gradient-to-r from-white/40 to-transparent mb-6"></div>
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
      <div className="relative mt-32 w-full max-w-4xl h-[60vh] flex items-center justify-center z-20 pointer-events-none">
        <div ref={constraintsRef} className="absolute inset-[-100px] md:inset-[-200px]" />
        <div className="absolute inset-0 flex items-center justify-center flex-wrap gap-4 pointer-events-auto">
          {POLAROIDS.map((p, i) => (
            <motion.div
              key={p.id}
              drag
              dragConstraints={constraintsRef}
              dragElastic={0.2}
              dragTransition={{ bounceStiffness: 200, bounceDamping: 20 }}
              whileHover={{ scale: 1.05, zIndex: 50, y: -10 }}
              whileDrag={{ scale: 1.1, zIndex: 60, cursor: 'grabbing' }}
              initial={{ opacity: 0, y: 50, rotate: p.rotation }}
              animate={{ opacity: 1, y: 0, rotate: p.rotation }}
              transition={{ 
                opacity: { duration: 1, delay: 7 + i * 0.2 },
                y: { duration: 1, delay: 7 + i * 0.2, type: "spring" },
                rotate: { duration: 0 } // Keep rotation static initially
              }}
              style={{ zIndex: 10 + i, willChange: 'transform' }}
              className="absolute cursor-grab"
            >
              <Tilt 
                tiltMaxAngleX={15} 
                tiltMaxAngleY={15} 
                glareEnable={true} 
                glareMaxOpacity={0.3} 
                glarePosition="all" 
                scale={1}
                className="bg-[#f2f0eb] p-3 pb-8 cursor-grab shadow-2xl w-48 sm:w-56 polaroid-shadow border border-zinc-200/20"
              >
                <div className="w-full aspect-[4/5] overflow-hidden bg-[#222] mb-3 relative">
                  {/* Subtle inner shadow for depth */}
                  <div className="absolute inset-0 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] z-10 pointer-events-none"></div>
                  <img 
                    src={p.src} 
                    alt="Memory" 
                    className="w-full h-full object-cover grayscale-[10%] sepia-[10%] contrast-110 opacity-90 transition-transform duration-700 hover:scale-105" 
                    draggable={false} 
                  />
                </div>
                <div className="w-full text-center">
                  <span className="font-handwriting text-zinc-800 text-lg sm:text-xl leading-none tracking-wide select-none drop-shadow-sm">
                    {p.caption}
                  </span>
                </div>
              </Tilt>
            </motion.div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
