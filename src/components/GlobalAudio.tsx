import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

// Cohesive, universe-themed ambient tracks (Creative Commons - Stellardrone)
const TRACKS = {
  '/': 'https://archive.org/download/Stellardrone_-_Light_Years_2013/02_Airglow.mp3', // The Sky - Vast, expansive space
  '/journal': 'https://archive.org/download/Stellardrone_-_Light_Years_2013/09_The_Opus.mp3', // The Journal - Quiet, minimal drone
  '/archive': 'https://archive.org/download/Stellardrone_-_Light_Years_2013/04_Eternity.mp3' // The Archive - Warm, nostalgic
};

const TARGET_VOLUME = 0.45; // Moderately low background volume for ambient tracks
const FADE_STEP = 0.01;
const FADE_INTERVAL = 30; // 30ms

export function GlobalAudio({ hasEntered }: { hasEntered: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const { pathname } = useLocation();
  const currentPathRef = useRef<string>(pathname);

  // Initial play on entry or fallback on interaction
  useEffect(() => {
    const tryPlay = () => {
      if (!hasEntered || isPlaying) return;

      const currentTrack = audioRefs.current[pathname] || audioRefs.current['/'];
      if (currentTrack) {
        currentTrack.volume = TARGET_VOLUME;
        currentTrack.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.warn("Audio autoplay blocked by browser:", err);
        });
      }
    };

    // Try immediately when hasEntered changes or URL changes
    tryPlay();

    // Browser fallback: if blocked, any subsequent click will unlock and play the audio synchronously
    const handleInteraction = () => {
      if (hasEntered && !isPlaying) {
        tryPlay();
      }
    };

    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasEntered, isPlaying, pathname]);

  // Handle route transitions (Crossfading & Pausing/Resuming state)
  useEffect(() => {
    if (!isPlaying) return;

    const previousPath = currentPathRef.current;
    
    // Default to sky track for any unknown paths
    const normalizedCurrentPath = TRACKS[pathname as keyof typeof TRACKS] ? pathname : '/';
    const normalizedPreviousPath = TRACKS[previousPath as keyof typeof TRACKS] ? previousPath : '/';

    if (normalizedPreviousPath === normalizedCurrentPath) return;

    currentPathRef.current = normalizedCurrentPath;

    const fadeOutAudio = audioRefs.current[normalizedPreviousPath];
    const fadeInAudio = audioRefs.current[normalizedCurrentPath];

    let fadeOutTimer: NodeJS.Timeout;
    let fadeInTimer: NodeJS.Timeout;

    if (fadeOutAudio) {
      fadeOutTimer = setInterval(() => {
        if (fadeOutAudio.volume > FADE_STEP) {
          try {
            fadeOutAudio.volume = Math.max(0, fadeOutAudio.volume - FADE_STEP);
          } catch (e) {
            fadeOutAudio.volume = 0;
          }
        } else {
          fadeOutAudio.volume = 0;
          fadeOutAudio.pause(); // Pause to retain the exact position where we left it
          clearInterval(fadeOutTimer);
        }
      }, FADE_INTERVAL);
    }

    if (fadeInAudio) {
      fadeInAudio.play().catch(e => console.warn('Play blocked on fade-in:', e));
      
      fadeInTimer = setInterval(() => {
        if (fadeInAudio.volume < TARGET_VOLUME - FADE_STEP) {
          try {
            fadeInAudio.volume = Math.min(TARGET_VOLUME, fadeInAudio.volume + FADE_STEP);
          } catch (e) {
            fadeInAudio.volume = TARGET_VOLUME;
          }
        } else {
          fadeInAudio.volume = TARGET_VOLUME;
          clearInterval(fadeInTimer);
        }
      }, FADE_INTERVAL);
    }

    return () => {
      clearInterval(fadeOutTimer);
      clearInterval(fadeInTimer);
    };
  }, [pathname, isPlaying]);

  return (
    <>
      {Object.entries(TRACKS).map(([path, src]) => (
        <audio 
          key={path}
          ref={el => audioRefs.current[path] = el}
          src={src}
          loop
          preload="auto"
        />
      ))}
    </>
  );
}
