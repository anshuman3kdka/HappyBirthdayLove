import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

// Using public domain/royalty free placeholders
const TRACKS = {
  ambient: '/assets/audio-ambient.mp3', // Lo-fi piano
  intimate: '/assets/audio-intimate.mp3' // Quiet piano
};

export function GlobalAudio({ hasEntered }: { hasEntered: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.2);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (hasEntered && audioRef.current && !isPlaying) {
      // Auto-play attempt after interaction
      audioRef.current.volume = volume;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Audio autoplay blocked by browser", err);
      });
    }
  }, [hasEntered]);

  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    const targetSrc = pathname === '/journal' ? TRACKS.intimate : TRACKS.ambient;
    
    if (audio.src !== targetSrc) {
      // Crossfade logic
      let fadeOutInterval: NodeJS.Timeout;
      let fadeInInterval: NodeJS.Timeout;
      
      const fadeOut = () => {
        if (audio.volume > 0.05) {
          audio.volume -= 0.05;
        } else {
          clearInterval(fadeOutInterval);
          audio.src = targetSrc;
          audio.play().catch(() => {});
          
          fadeInInterval = setInterval(() => {
            if (audio.volume < 0.2) {
              audio.volume += 0.05;
            } else {
              clearInterval(fadeInInterval);
              audio.volume = 0.2;
            }
          }, 200);
        }
      };

      if (isPlaying) {
        fadeOutInterval = setInterval(fadeOut, 100);
      } else {
        audio.src = targetSrc;
      }
    }
  }, [pathname, isPlaying]);

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!hasEntered) return null;

  return (
    <>
      <audio ref={audioRef} loop src={TRACKS.ambient} preload="auto" />
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={toggleMute}
        className="fixed bottom-8 right-8 z-50 flex items-center space-x-3 hover:opacity-100 opacity-60 transition-opacity"
        aria-label={isPlaying ? 'Mute audio' : 'Play audio'}
      >
        <div className="flex space-x-0.5 items-end h-3">
          <div className="w-[1px] bg-white/40 h-2"></div>
          <div className={`w-[1px] bg-white ${isPlaying ? 'h-full animate-pulse' : 'h-1'}`}></div>
          <div className={`w-[1px] bg-white/60 ${isPlaying ? 'h-3' : 'h-1'}`}></div>
          <div className="w-[1px] bg-white h-1"></div>
          <div className={`w-[1px] bg-white/80 ${isPlaying ? 'h-4' : 'h-2'}`}></div>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-widest text-white">
          {isPlaying ? 'Audio Playing • 0.2V' : 'Audio Muted'}
        </span>
      </motion.button>
    </>
  );
}
