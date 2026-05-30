import { useState, useRef, useEffect } from 'react';
import type { SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Play, Pause, X } from 'lucide-react';
import { AutoplayVideo } from '../components/AutoplayVideo';
import { resolveAssetUrl } from '../lib/assetUtils';
import archiveContent from '../content/archive.json';
import siteContent from '../content/site.json';

type ArchivePhoto = {
  id: string;
  image?: string;
  caption: string;
  x: number;
  y: number;
};

type FilmstripPhoto = {
  id: string;
  image?: string;
  frameCode: string;
  frameLabel: string;
};

type FilmstripOrientation = 'landscape' | 'portrait';

const ARCHIVE_PHOTOS = archiveContent.constellationPhotos.map((photo, index) => ({
  ...photo,
  id: `constellation-${index + 1}`,
})) as ArchivePhoto[];
const FILMSTRIP_PHOTOS = archiveContent.filmstripPhotos.map((photo, index) => ({
  ...photo,
  id: `filmstrip-${index + 1}`,
})) as FilmstripPhoto[];

function ArchiveImageFrame({
  image,
  alt,
  className,
  placeholderLabel,
  onImageLoad,
}: {
  image?: string;
  alt: string;
  className: string;
  placeholderLabel: string;
  onImageLoad?: (event: SyntheticEvent<HTMLImageElement>) => void;
}) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [image]);
  const canShowImage = Boolean(image) && !imageFailed;

  if (!canShowImage) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`${className} flex items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.24),rgba(120,113,108,0.13)_38%,rgba(12,10,9,0.94)_78%)]`}
      >
        <div className="text-center px-3">
          <div className="mx-auto mb-2 h-1.5 w-1.5 rounded-full bg-white/70 shadow-[0_0_14px_rgba(255,255,255,0.9)]" />
          <div className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/45">
            {placeholderLabel}
          </div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={resolveAssetUrl(image!, 'image')}
      alt={alt}
      className={className}
      onLoad={onImageLoad}
      onError={() => setImageFailed(true)}
    />
  );
}

function ConstellationMap() {
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof ARCHIVE_PHOTOS)[number] | null>(null);

  useEffect(() => {
    if (!selectedPhoto) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedPhoto]);

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
            key={`${line.from.id}-${line.to.id}`}
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
          onClick={() => setSelectedPhoto(photo)}
        >
          <div className="w-16 h-16 md:w-24 md:h-24 rounded-full overflow-hidden border border-zinc-500/30 group-hover:border-zinc-300 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_25px_rgba(255,255,255,0.3)]">
            <ArchiveImageFrame
              image={photo.image}
              alt={siteContent.accessibility.constellationPhotoAlt}
              placeholderLabel={`Memory ${i + 1}`}
              className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover:opacity-100 group-hover:mix-blend-normal transition-all"
            />
          </div>
        </motion.div>
      ))}

      {/* Lightbox */}
      {createPortal(
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/90 px-4 pb-6 pt-[max(1rem,env(safe-area-inset-top))] md:items-center md:p-12 cursor-zoom-out"
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div
                layoutId={selectedPhoto.image || selectedPhoto.id}
                className="relative flex w-full max-w-5xl flex-col bg-white p-3 pb-5 shadow-2xl md:p-6 md:pb-8"
                onClick={e => e.stopPropagation()}
              >
                <button onClick={() => setSelectedPhoto(null)} aria-label={siteContent.accessibility.closeLightboxLabel} className="absolute top-4 right-4 z-10 text-zinc-800 mix-blend-difference hover:scale-110 transition-transform">
                  <X size={24} />
                </button>
                <ArchiveImageFrame
                  image={selectedPhoto.image}
                  alt={siteContent.accessibility.lightboxPhotoAlt}
                  placeholderLabel={selectedPhoto.caption || siteContent.archiveLabels.lightboxCaption}
                  className="mx-auto block max-h-[calc(100dvh-9.5rem)] w-auto max-w-full object-contain md:max-h-[calc(100vh-12rem)]"
                />
                <div className="pt-4 text-center font-handwriting text-2xl text-zinc-800">
                  {selectedPhoto.caption || siteContent.archiveLabels.lightboxCaption}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}

function FilmStrip() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [orientationByPhotoId, setOrientationByPhotoId] = useState<Record<string, FilmstripOrientation>>({});
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  const slideLeft = () => {
    if (currentIndex > 0) {
      setSlideDirection(-1);
      setCurrentIndex(prev => prev - 1);
      playClickSound();
    }
  };

  const slideRight = () => {
    if (currentIndex < FILMSTRIP_PHOTOS.length - 1) {
      setSlideDirection(1);
      setCurrentIndex(prev => prev + 1);
      playClickSound();
    }
  };

  const updatePhotoOrientation = (photoId: string, event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    const nextOrientation = image.naturalHeight > image.naturalWidth ? 'portrait' : 'landscape';

    setOrientationByPhotoId(prev => {
      if (prev[photoId] === nextOrientation) return prev;
      return { ...prev, [photoId]: nextOrientation };
    });
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
            aria-label={siteContent.accessibility.previousFilmLabel}
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
               {FILMSTRIP_PHOTOS.map((photo, i) => {
                 const orientation = orientationByPhotoId[photo.id] ?? 'landscape';
                 const isPortrait = orientation === 'portrait';
                 const isActive = i === currentIndex;
                 const frameLabel = photo.frameLabel || `${siteContent.archiveLabels.filmFramePrefix} ${i + 1}`;

                 return (
                   <div key={photo.id} className="flex-shrink-0 w-full min-h-[min(78vh,95vw)] md:min-h-[min(78vh,44vw)] flex items-center justify-center py-4 [perspective:1200px]">
                     <motion.div
                       layout
                       animate={{
                         width: isPortrait ? 'min(62vw,430px)' : '100%',
                         aspectRatio: isPortrait ? 2 / 3 : 3 / 2,
                         rotateZ: isPortrait ? (i % 2 === 0 ? -1.8 : 1.8) : 0,
                         rotateY: isActive ? [slideDirection * 14, 0] : 0,
                         scale: isActive ? 1 : 0.94,
                       }}
                       transition={{ type: 'spring', stiffness: 170, damping: 22 }}
                       className="relative overflow-hidden border-[12px] border-[#111] bg-[#050505] shadow-[0_0_40px_rgba(0,0,0,0.55)] transition-colors md:border-[24px]"
                     >
                       <div className="absolute top-2 left-2 md:top-4 md:left-4 z-10 font-mono text-[10px] md:text-sm text-white/30 tracking-widest pointer-events-none">{photo.frameCode}</div>
                       <div className="absolute top-2 right-2 md:top-4 md:right-4 z-10 font-mono text-[10px] md:text-sm text-white/30 tracking-widest pointer-events-none">{siteContent.archiveLabels.filmStockLabel}</div>
                       <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 z-10 font-mono text-[10px] text-white/20 tracking-wider pointer-events-none">{frameLabel}</div>
                       <motion.div style={{ y }} className="w-full h-full mx-auto pointer-events-none">
                         <ArchiveImageFrame
                           image={photo.image}
                           alt={`${siteContent.accessibility.constellationPhotoAlt} ${i + 1}`}
                           placeholderLabel={frameLabel}
                           className="w-full h-full object-contain sepia-[20%] contrast-110 opacity-90"
                           onImageLoad={event => updatePhotoOrientation(photo.id, event)}
                         />
                       </motion.div>
                     </motion.div>
                   </div>
                 );
               })}
            </motion.div>
          </div>

          <button
            onClick={slideRight}
            disabled={currentIndex === FILMSTRIP_PHOTOS.length - 1}
            aria-label={siteContent.accessibility.nextFilmLabel}
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

function VideoMoment({
  isPausedByVoiceNote,
  onVideoPlayRequest,
}: {
  isPausedByVoiceNote: boolean;
  onVideoPlayRequest: () => void;
}) {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 mb-32 z-10 relative">
      <div className="relative aspect-video bg-[#0a0a0a] shadow-[0_0_40px_rgba(255,255,255,0.05)] overflow-hidden rounded-sm group">
         <AutoplayVideo
          src={resolveAssetUrl(archiveContent.videoMoment.video, "video")}
          className="w-full h-full"
          muted={false}
          volume={0.7}
          pausable={true}
          externallyPaused={isPausedByVoiceNote}
          onPlayRequest={onVideoPlayRequest}
         />
      </div>
      <p className="font-serif text-center opacity-50 mt-6 italic text-lg tracking-wide">
        {archiveContent.videoMoment.caption}
      </p>
    </div>
  );
}

function LittleThings({
  onVoiceNoteStart,
  onVoiceNoteStop,
  stopVoiceNoteRequest,
}: {
  onVoiceNoteStart: () => void;
  onVoiceNoteStop: () => void;
  stopVoiceNoteRequest: number;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) return;

    audioRef.current.pause();
    setIsPlaying(false);
    onVoiceNoteStop();
  }, [stopVoiceNoteRequest]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      onVoiceNoteStop();
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        onVoiceNoteStart();
      }).catch(() => {
        setIsPlaying(false);
      });
      return;
    }
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
          src={resolveAssetUrl(archiveContent.littleThings.audioVoiceNote, "audio")}
          onEnded={() => {
            setIsPlaying(false);
            onVoiceNoteStop();
          }}
        />
        <div className="flex justify-between items-start">
          <div className="font-mono text-[10px] text-white/50 uppercase tracking-widest">{siteContent.archiveLabels.voiceNoteTimestamp}</div>
          <button
            onClick={togglePlay}
            aria-label={siteContent.accessibility.voiceNotePlayPauseLabel}
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
          {archiveContent.littleThings.voiceNoteLabel}
        </div>
      </motion.div>

      {/* A generic artifact like a ticket stub */}
      <motion.div
        whileHover={{ scale: 1.05, rotate: -2 }}
        className="w-48 h-24 bg-[#E0D8D0] shadow-2xl relative border-l-8 border-r-8 border-dashed border-black/10 flex items-center justify-center transform rotate-3"
      >
        <div className="text-center">
          <div className="font-mono font-bold text-black/80 uppercase tracking-widest text-[10px] mb-1">{archiveContent.littleThings.ticketSeat}</div>
          <div className="font-mono text-black/40 text-[9px] uppercase tracking-widest">{archiveContent.littleThings.ticketTitle}</div>
        </div>
      </motion.div>

    </div>
  );
}

export function Archive() {
  const [isVoiceNotePlaying, setIsVoiceNotePlaying] = useState(false);
  const [isVideoPausedByVoiceNote, setIsVideoPausedByVoiceNote] = useState(false);
  const [stopVoiceNoteRequest, setStopVoiceNoteRequest] = useState(0);

  const handleVoiceNoteStart = () => {
    setIsVoiceNotePlaying(true);
    setIsVideoPausedByVoiceNote(true);
  };

  const handleVoiceNoteStop = () => {
    setIsVoiceNotePlaying(false);
    setIsVideoPausedByVoiceNote(false);
  };

  const handleVideoPlayRequest = () => {
    if (isVoiceNotePlaying) {
     setStopVoiceNoteRequest(prev => prev + 1);
    }
    setIsVoiceNotePlaying(false);
    setIsVideoPausedByVoiceNote(false);
  };

  return (
    <div className="w-full min-h-screen relative flex flex-col pt-16">
      <ConstellationMap />
      <FilmStrip />
      <VideoMoment isPausedByVoiceNote={isVideoPausedByVoiceNote} onVideoPlayRequest={handleVideoPlayRequest} />
      <LittleThings
        onVoiceNoteStart={handleVoiceNoteStart}
        onVoiceNoteStop={handleVoiceNoteStop}
        stopVoiceNoteRequest={stopVoiceNoteRequest}
      />
    </div>
  );
}
