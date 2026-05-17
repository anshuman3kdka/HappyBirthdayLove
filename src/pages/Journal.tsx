import { useState, useRef, useEffect, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const ENTRIES = [
  {
    id: 1,
    coord: "RA 14h 29m · Dec +18° 11'",
    date: "march 4, 2025",
    text: "i remember you ordered the same thing twice because you were distracted talking and didn't notice. i didn't tell you. i just watched you explain your theory about clouds being proof the sky has moods.",
    image: "/assets/journal-bg-1.jpg"
  },
  {
    id: 2,
    coord: "RA 09h 14m · Dec -43° 22'",
    date: "july 12, 2024",
    text: "you fell asleep during the movie we planned for weeks to watch. i paused it. i ended up just watching the city lights hit your face through the window. it was a better movie anyway.",
    image: "/assets/journal-bg-2.jpg"
  },
  {
    id: 3,
    coord: "RA 19h 50m · Dec +08° 52'",
    date: "november 18, 2024",
    text: "it was raining so hard we stepped into that tiny bookstore. you bought a book you fully admitted you would never read, just because you liked the texture of the cover. i still think about that.",
    image: "/assets/journal-bg-3.jpg"
  }
];

const JournalContent = forwardRef<HTMLDivElement, { isForeground?: boolean; isRevealed?: boolean }>((props, ref) => {
  return (
    <div ref={ref} className="w-full flex flex-col items-center pb-[20vh]">
      <div className={`pt-[25vh] pb-[10vh] px-6 max-w-5xl mx-auto text-center z-10 relative ${props.isForeground ? 'opacity-0' : 'opacity-100'}`}>
         <h1 className="font-serif text-3xl md:text-5xl italic opacity-60 drop-shadow-sm">
           the archive of small moments
         </h1>
         <p className="mt-8 font-serif italic text-sm md:text-base opacity-90 tracking-wide text-white drop-shadow-md">
           let your touch clear the haze, guide your light through our days...
         </p>
      </div>

      <div className={`w-full flex flex-col items-center transition-all duration-1000 ${(!props.isForeground && !props.isRevealed) ? 'opacity-20 blur-[8px]' : ''}`}>
        {ENTRIES.map((entry) => (
          <div key={entry.id} className="relative min-h-[100vh] w-full flex items-center justify-center py-20 px-6">
            <div className="absolute inset-0 w-full h-[120%] -top-[10%] z-0 pointer-events-none">
              <img 
                src={entry.image} 
                alt="" 
                className="w-full h-full object-cover opacity-[0.10] mix-blend-luminosity"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
            </div>

            <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col px-4 md:px-0 border-l border-white/10 pl-6 py-2">
              <div className="mb-12 font-mono text-[10px] uppercase tracking-[0.2em] opacity-50 flex flex-col gap-2">
                <span>{entry.coord} / {entry.date}</span>
              </div>
              
              <p className="font-serif text-2xl md:text-[32px] lg:text-[40px] leading-relaxed md:leading-[1.6] opacity-90 italic font-light max-w-4xl mx-auto drop-shadow-md">
                {entry.text}
              </p>
            </div>
          </div>
        ))}

        {/* The Final Star */}
        <div className="min-h-[80vh] w-full flex items-center justify-center relative">
          <div className="text-center flex flex-col items-center gap-8">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white opacity-80 animate-pulse">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
            </svg>
            <p className="font-serif text-2xl md:text-[32px] italic opacity-80 px-4">
              there's one more thing i should have said sooner...
            </p>
            <p className="font-serif text-xl md:text-3xl opacity-50 mt-4 italic">
              i love you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export function Journal() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [touchPoint, setTouchPoint] = useState<{x: number, y: number} | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateMaxScroll = () => {
      if (contentRef.current) {
        setMaxScroll(Math.max(0, contentRef.current.scrollHeight - window.innerHeight));
      }
    };
    
    updateMaxScroll();
    const timeoutId = setTimeout(updateMaxScroll, 500);

    window.addEventListener('resize', updateMaxScroll);
    return () => {
      window.removeEventListener('resize', updateMaxScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse' && e.buttons === 0) {
      setTouchPoint({ x: e.clientX, y: e.clientY });
      return;
    }
    setTouchPoint({ x: e.clientX, y: e.clientY });
  };
  
  const handlePointerDown = (e: React.PointerEvent) => {
    setTouchPoint({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (e.pointerType === 'touch') {
      setTouchPoint(null);
    }
  };

  const handlePointerLeave = () => setTouchPoint(null);

  const handleWheel = (e: React.WheelEvent) => {
    setScrollY(y => {
      const ny = y + e.deltaY;
      return Math.max(0, Math.min(ny, maxScroll));
    });
  };

  const scrollAmount = typeof window !== 'undefined' ? window.innerHeight * 0.7 : 500;
  
  const scrollDown = () => setScrollY(y => Math.min(maxScroll, y + scrollAmount));
  const scrollUp = () => setScrollY(y => Math.max(0, y - scrollAmount));

  const isAtBottom = scrollY > 0 && maxScroll > 0 && scrollY >= maxScroll - 100;

  return (
    <div 
      className="absolute inset-0 w-full h-[100dvh] bg-transparent text-[#E0D8D0] overflow-hidden select-none z-10"
      style={{ touchAction: 'none' }} 
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      onWheel={handleWheel}
      ref={containerRef}
    >
      {/* Background (Blurred Version) */}
      <motion.div 
        className="absolute w-full top-0 left-0 pointer-events-none"
        animate={{ y: -scrollY }}
        transition={{ type: "spring", stiffness: 60, damping: 20 }}
      >
        <JournalContent ref={contentRef} isForeground={false} isRevealed={isRevealed} />
      </motion.div>

      {/* Foreground (Clear Filtered Version with Flashlight Mask) */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out z-20 ${isRevealed ? 'hidden' : ''}`}
        style={{
          WebkitMaskImage: touchPoint ? `radial-gradient(circle 200px at ${touchPoint.x}px ${touchPoint.y}px, black 25%, transparent 100%)` : 'none',
          maskImage: touchPoint ? `radial-gradient(circle 200px at ${touchPoint.x}px ${touchPoint.y}px, black 25%, transparent 100%)` : 'none',
          opacity: (touchPoint && !isRevealed) ? 1 : 0,
        }}
      >
        <motion.div 
          className="absolute w-full top-0 left-0"
          animate={{ y: -scrollY }}
          transition={{ type: "spring", stiffness: 60, damping: 20 }}
        >
          <JournalContent isForeground={true} />
        </motion.div>
      </div>

      {/* Custom Scroll Actions */}
      <div 
         className="absolute right-4 md:right-8 bottom-[10vh] flex flex-col gap-3 z-50 pointer-events-auto"
         onPointerDown={(e) => e.stopPropagation()} 
      >
        <button 
          onClick={scrollUp}
          className={`p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white transition-all duration-500 outline-none hover:bg-white/10
            ${scrollY > 10 ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          aria-label="Scroll Up"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>

        <button 
          onClick={scrollDown}
          className={`p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-white transition-all duration-500 outline-none hover:bg-white/10
            ${maxScroll > 0 && !isAtBottom ? 'opacity-70 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
          aria-label="Scroll Down"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>

      {/* The Next Section and Reveal Buttons (Appears only at the bottom) */}
      <div className={`absolute bottom-[8vh] w-full flex flex-col items-center gap-6 z-50 transition-all duration-1000 ${isAtBottom ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none translate-y-8'}`}>
         {!isRevealed && (
           <button 
             onClick={() => setIsRevealed(true)}
             onPointerDown={(e) => e.stopPropagation()}
             className="px-6 py-2 border border-white/20 text-white/70 uppercase tracking-[0.2em] font-mono text-[10px] hover:bg-white/10 hover:text-white transition-all backdrop-blur-md rounded-full shadow-[0_0_15px_rgba(255,255,255,0.05)]"
           >
             Illuminate All Pages
           </button>
         )}
         <button 
           onClick={() => navigate('/archive')}
           onPointerDown={(e) => e.stopPropagation()}
           className="px-8 py-4 border border-white/30 text-white uppercase tracking-[0.2em] font-mono text-xs hover:bg-white/10 transition-colors backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)]"
         >
           Step into the Archive
         </button>
      </div>
      
    </div>
  );
}
