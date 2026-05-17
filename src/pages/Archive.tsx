import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Play, Pause, X } from 'lucide-react';

const ARCHIVE_PHOTOS = [
  { id: 1, src: 'https://images.unsplash.com/photo-1522674515714-383783fd0a2f?w=600&q=80', x: 20, y: 30 },
  { id: 2, src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80', x: 60, y: 15 },
  { id: 3, src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80', x: 80, y: 50 },
  { id: 4, src: 'https://images.unsplash.com/photo-1518104593124-ac1fcbd7cedb?w=600&q=80', x: 40, y: 70 },
  { id: 5, src: 'https://images.unsplash.com/photo-1495344517868-8ebaf0a2044e?w=600&q=80', x: 10, y: 80 },
];

const FILMSTRIP_PHOTOS = [
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&q=80',
  'https://images.unsplash.com/photo-1507721999472-8ed4421bca96?w=800&q=80',
  'https://images.unsplash.com/photo-1518104593124-ac1fcbd7cedb?w=800&q=80',
  'https://images.unsplash.com/photo-1522674515714-383783fd0a2f?w=800&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
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
          onClick={() => setSelectedImage(photo.src)}
        >
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border border-zinc-500/30 group-hover:border-zinc-300 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]">
            <img src={photo.src} className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:mix-blend-normal transition-all" />
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
               <img src={selectedImage} className="w-full h-full object-contain max-h-[75vh]" />
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
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <div className="w-full relative py-16 mb-32 z-10 bg-[#050505] overflow-hidden group">
      {/* Top sprockets */}
      <div className="w-full h-8 film-strip-pattern opacity-30" />
      
      {/* Strip */}
      <div className="relative w-full overflow-hidden bg-black py-4">
        <motion.div 
          className="flex gap-4 w-max px-4"
          initial={{ x: "0%" }}
          animate={{ x: "-50%" }}
          transition={{ duration: 60, ease: "linear", repeat: Infinity }}
        >
           {/* Duplicate list to ensure seamless endless scrolling */}
           {[...FILMSTRIP_PHOTOS, ...FILMSTRIP_PHOTOS].map((src, i) => (
             <div key={i} className="flex-shrink-0 w-[60vw] md:w-[30vw] aspect-[3/2] border border-white/5 bg-[#111] group-hover:border-white/10 transition-colors">
               <img src={src} className="w-full h-full object-cover sepia-[30%] contrast-110 opacity-90" />
             </div>
           ))}
        </motion.div>
      </div>

      {/* Bottom sprockets */}
      <div className="w-full h-8 film-strip-pattern opacity-30" />
    </div>
  );
}

function VideoMoment() {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 mb-32 z-10 relative">
      <div className="relative aspect-video bg-[#0a0a0a] shadow-[0_0_40px_rgba(255,255,255,0.05)] overflow-hidden rounded-sm group">
         {/* Placeholder video using public domain source */}
         <video 
           ref={videoRef}
           src="https://cdn.pixabay.com/video/2019/04/17/22886-331583095_tiny.mp4" 
           className="w-full h-full object-cover"
           loop
           playsInline
         />
         
         <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-500 ${isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'}`}>
           <button 
             onClick={togglePlay}
             className="w-16 h-16 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-105"
           >
             {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
           </button>
         </div>
      </div>
      <p className="font-serif text-center opacity-50 mt-6 italic text-lg tracking-wide">
        that one perfect afternoon.
      </p>
    </div>
  );
}

function LittleThings() {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="w-full max-w-5xl mx-auto px-6 mb-32 z-10 relative flex flex-wrap justify-center gap-12 items-center">
      
      {/* A stylized cassette player */}
      <motion.div 
        whileHover={{ scale: 1.05, rotate: 2 }}
        className="w-72 h-44 bg-[#111] rounded-md shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 relative overflow-hidden flex flex-col justify-between p-4"
      >
        <div className="flex justify-between items-start">
          <div className="font-mono text-[10px] text-white/50 uppercase tracking-widest">Voice Note: 03-12</div>
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
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
