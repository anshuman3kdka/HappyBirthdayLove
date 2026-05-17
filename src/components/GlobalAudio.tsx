import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

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

  if (!hasEntered) return null;

  return (
    <audio ref={audioRef} loop src={TRACKS.ambient} preload="auto" />
  );
}
