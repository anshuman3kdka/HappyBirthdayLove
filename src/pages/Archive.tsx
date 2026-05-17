import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Play, Pause, X } from 'lucide-react';
import { AutoplayVideo } from '../components/AutoplayVideo';
import { resolveAssetUrl } from '../lib/assetUtils';

const ARCHIVE_PHOTOS = [
  { id: 1, basePath: '/assets/image/archive-photo-1', x: 20, y: 30 },
  { id: 2, basePath: '/assets/image/archive-photo-2', x: 60, y: 15 },
  { id: 3, basePath: '/assets/image/archive-photo-3', x: 80, y: 50 },
  { id: 4, basePath: '/assets/image/archive-photo-4', x: 40, y: 70 },
  { id: 5, basePath: '/assets/image/archive-photo-5', x: 10, y: 80 },
];

const FILMSTRIP_PHOTOS = [
  '/assets/image/archive-film-1',
  '/assets/image/archive-film-2',
  '/assets/image/archive-film-3',
  '/assets/image/archive-film-4',
  '/assets/image/archive-film-5',
  '/assets/image/archive-film-6',
];

function ConstellationMap() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Simple SVG lines connecting the centers of the images
  const lines = [
    { from: ARCHIVE_PHOTOS[0], to: ARCHIVE_PHOTOS[1] },
    { from: ARCHIVE_PHOTOS[1], to: ARCHIVE_PHOTOS[2] },
    { from: ARCHIVE_PHOTOS[2], to: ARCHIVE_PHOTOS[3] },
    { from: ARCHIVE_PHOTOS[3], to: ARCHIVE_PHOTOS[4] },
    { from: ARCHIVE_PHOTOS[4], to: ARCHIVE_PHOTOS[0] },
    { from: ARCHIVE_PHOTOS[0], to: ARCHIVE_PHOTOS[3] },
  ];

  return (
    <div className="relative w-full h-screen bg-transparent mb-32 z-10 pt-20">
      {/* connecting lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.3))' }}>
        {lines.map((line, i) => (
          <motion.line
            key={i}
            x1={`${line.from.x}%`}
            y1={`${line.from.y}%`}
            x2={`${line.to.x}%`}
            y2={`${line.to.y}%`}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1 + i * 0.2 }}
          />
        ))}
      </svg>

      {/* Nodes */}
      {ARCHIVE_PHOTOS.map((photo, i) => (
        <motion.div
          key={photo.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 + i * 0.1 }}
          whileHover={{ scale: 1.1, zIndex: 20 }}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
          style={{ left: `${photo.x}%`, top: `${photo.y}%` }}
          onClick={() => setSelectedImage(photo.basePath)}
        >
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border border-zinc-500/30 group-hover:border-zinc-300 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]">
            <img src={resolveAssetUrl(photo.basePath, 'image')} className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:mix-blend-normal transition-all" />
          </div>
        </motion.div>
      ))}

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-6 md:p-12 cursor-zoom-out"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              layoutId={selectedImage}
              className="relative max-w-5xl max-h-[90vh] bg-white p-4 md:p-6 pb-16 md:pb-20 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
               <button onClick={() => setSelectedImage(null)} className="absolute top-4 right-4 z-10 text-zinc-800 mix-blend-difference hover:scale-110 transition-transform">
                 <X size={24} />
               </button>
               <img src={resolveAssetUrl(selectedImage, 'image')} className="w-full h-full object-contain max-h-[75vh]" />
               <div className="absolute bottom-4 left-0 w-full text-center font-handwriting text-2xl text-zinc-800">
                  memorabilia.
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilmStrip() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  const slideLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      playClickSound();
    }
  };

  const slideRight = () => {
    if (currentIndex < FILMSTRIP_PHOTOS.length - 1) {
      setCurrentIndex(prev => prev + 1);
      playClickSound();
    }
  };

  const playClickSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Audio play failed', e));
    }
  };
  
  return (
    <div ref={containerRef} className="w-full relative py-16 mb-32 z-10 bg-[#050505] overflow-hidden group">
      {/* Top sprockets */}
      <div className="w-full h-8 film-strip-pattern opacity-30" />
      
      {/* Strip */}
      <div className="relative w-full overflow-hidden bg-[#0A0A0A] py-8 border-y border-white/5">
        <audio ref={audioRef} src={resolveAssetUrl("/assets/audio/slide-projector", "audio")} />
        
        <div className="flex items-center justify-center gap-4 relative">
          <button 
            onClick={slideLeft}
            disabled={currentIndex === 0}
            className="absolute left-4 md:left-12 z-20 w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white disabled:opacity-20 transition-all backdrop-blur"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          
          <div className="w-[85vw] md:w-[60vw] overflow-hidden rounded-sm mx-auto shadow-[0_0_50px_rgba(255,255,255,0.02)]">
            <motion.div 
              className="flex"
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
               {FILMSTRIP_PHOTOS.map((src, i) => (
                 <div key={i} className="flex-shrink-0 w-full aspect-[3/2] border-[12px] md:border-[24px] border-[#111] transition-colors relative bg-[#050505] overflow-hidden">
                   <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 font-mono text-[10px] md:text-sm text-white/30 tracking-widest pointer-events-none">{String(i + 1).padStart(2, '0')}A</div>
                   <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10 font-mono text-[10px] md:text-sm text-white/30 tracking-widest pointer-events-none">KODAK 400TX</div>
                   <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 z-10 font-mono text-[10px] text-white/20 tracking-wider pointer-events-none">FRAME {i + 1}</div>
                   <motion.img 
                     src={resolveAssetUrl(src, 'image')} 
                     style={{ y }}
                     className="w-full h-full object-cover sepia-[20%] contrast-110 opacity-90 mx-auto pointer-events-none scale-[1.3] origin-center" 
                   />
                 </div>
               ))}
            </motion.div>
          </div>

          <button 
            onClick={slideRight}
            disabled={currentIndex === FILMSTRIP_PHOTOS.length - 1}
            className="absolute right-4 md:right-12 z-20 w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 flex items-center justify-center text-white disabled:opacity-20 transition-all backdrop-blur"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      {/* Bottom sprockets */}
      <div className="w-full h-8 film-strip-pattern opacity-30" />
    </div>
  );
}

function VideoMoment() {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 mb-32 z-10 relative">
      <div className="relative aspect-video bg-[#0a0a0a] shadow-[0_0_40px_rgba(255,255,255,0.05)] overflow-hidden rounded-sm group">
         <AutoplayVideo 
           src={resolveAssetUrl("/assets/video/archive-video", "video")} 
           className="w-full h-full"
         />
      </div>
      <p className="font-serif text-center opacity-50 mt-6 italic text-lg tracking-wide">
        that one perfect afternoon.
      </p>
    </div>
  );
}

function LittleThings() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto px-6 mb-32 z-10 relative flex flex-wrap justify-center gap-12 items-center">
      
      {/* A stylized cassette player */}
      <motion.div 
        whileHover={{ scale: 1.05, rotate: 2 }}
        className="w-72 h-44 bg-[#111] rounded-md shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 relative overflow-hidden flex flex-col justify-between p-4"
      >
        <audio 
          ref={audioRef} 
          src={resolveAssetUrl("/assets/audio/archive-voicenote", "audio")} 
          onEnded={() => setIsPlaying(false)}
        />
        <div className="flex justify-between items-start">
          <div className="font-mono text-[10px] text-white/50 uppercase tracking-widest">Voice Note: 03-12</div>
          <button 
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 text-white transition-colors"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
          </button>
        </div>
        
        {/* Cassette spools */}
        <div className="w-full h-16 bg-[#050505] rounded-sm relative flex items-center justify-between px-8 border border-white/5">
           <motion.div 
             animate={{ rotate: isPlaying ? 360 : 0 }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             className="w-10 h-10 rounded-full bg-[#111] border border-white/20 flex items-center justify-center shadow-inner"
           >
             <div className="w-1 h-3 bg-white/30" />
           </motion.div>
           <motion.div 
             animate={{ rotate: isPlaying ? 360 : 0 }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             className="w-10 h-10 rounded-full bg-[#111] border border-white/20 flex items-center justify-center shadow-inner"
           >
             <div className="w-1 h-3 bg-white/30" />
           </motion.div>
        </div>
        
        <div className="font-handwriting text-black/80 text-center w-full bg-[#E0D8D0] py-1 rounded-sm mt-2 text-sm">
          your laugh
        </div>
      </motion.div>
      
      {/* A generic artifact like a ticket stub */}
      <motion.div 
        whileHover={{ scale: 1.05, rotate: -2 }}
        className="w-48 h-24 bg-[#E0D8D0] shadow-2xl relative border-l-8 border-r-8 border-dashed border-black/10 flex items-center justify-center transform rotate-3"
      >
        <div className="text-center">
          <div className="font-mono font-bold text-black/80 uppercase tracking-widest text-[10px] mb-1">Row F • Seat 12</div>
          <div className="font-mono text-black/40 text-[9px] uppercase tracking-widest">ADMIT ONE</div>
        </div>
      </motion.div>
      
    </div>
  );
}

export function Archive() {
  return (
    <div className="w-full min-h-screen relative flex flex-col pt-16">
       <ConstellationMap />
       <FilmStrip />
       <VideoMoment />
       <LittleThings />
    </div>
  );
}
