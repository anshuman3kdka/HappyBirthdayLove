import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useWish } from '../contexts/WishContext';
import { resolveAssetUrl } from '../lib/assetUtils';

// Cohesive, universe-themed ambient tracks (Creative Commons - Stellardrone)
const TRACKS_BASES = {
  '/': '/assets/audio/audio-ambient', // The Sky - Vast, expansive space
  '/journal': '/assets/audio/audio-intimate', // The Journal - Quiet, minimal drone
  '/archive': '/assets/audio/audio-nostalgic' // The Archive - Warm, nostalgic
};

const WISH_SWELL_BASE = '/assets/audio/wish-swell'; // Grand track, jumps directly to peak

const TARGET_VOLUME = 0.45; // Moderately low background volume for ambient tracks
const WISH_DIM_VOLUME = 0.05; // Drop background track volume heavily during wish
const FADE_STEP = 0.01;
const FADE_INTERVAL = 30; // 30ms

export function GlobalAudio({ hasEntered }: { hasEntered: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const wishAudioRef = useRef<HTMLAudioElement | null>(null);
  const { pathname } = useLocation();
  const currentPathRef = useRef<string>(pathname);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { isWishing } = useWish();

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

    // Try starting if hasEntered is already true (e.g. from session storage)
    tryPlay();

    // Triggered precisely when the user clicks the envelope, ensuring we are within a trusted interaction event.
    const handleEnvelopeOpen = () => {
      if (isPlaying) return;
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

    // Browser fallback: if blocked, any subsequent click will unlock and play the audio synchronously
    const handleInteraction = () => {
      if (hasEntered && !isPlaying) {
        tryPlay();
      }
    };

    window.addEventListener('envelopeOpened', handleEnvelopeOpen);
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);

    return () => {
      window.removeEventListener('envelopeOpened', handleEnvelopeOpen);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasEntered, isPlaying, pathname]);

  // Handle route transitions (Crossfading & Pausing/Resuming state)
  useEffect(() => {
    if (!isPlaying) return;

    const previousPath = currentPathRef.current;
    
    let normalizedCurrentPath: string | null = pathname;
    if (!TRACKS_BASES[normalizedCurrentPath as keyof typeof TRACKS_BASES]) {
      normalizedCurrentPath = null;
    }
    
    let normalizedPreviousPath: string | null = previousPath;
    if (!TRACKS_BASES[normalizedPreviousPath as keyof typeof TRACKS_BASES]) {
      normalizedPreviousPath = null;
    }

    if (normalizedPreviousPath === normalizedCurrentPath) return;

    currentPathRef.current = pathname;

    const fadeOutAudio = normalizedPreviousPath ? audioRefs.current[normalizedPreviousPath] : null;
    const fadeInAudio = normalizedCurrentPath ? audioRefs.current[normalizedCurrentPath] : null;

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

  // Handle Wish State (Swell logic)
  useEffect(() => {
    if (!isPlaying) return;

    const normalizedCurrentPath = TRACKS_BASES[pathname as keyof typeof TRACKS_BASES] ? pathname : null;
    const activeTrack = normalizedCurrentPath ? audioRefs.current[normalizedCurrentPath] : null;

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    fadeIntervalRef.current = setInterval(() => {
      let settled = true;
      const targetBgVol = isWishing ? WISH_DIM_VOLUME : TARGET_VOLUME;
      
      if (activeTrack) {
        if (Math.abs(activeTrack.volume - targetBgVol) > FADE_STEP) {
          activeTrack.volume += (activeTrack.volume < targetBgVol ? FADE_STEP : -FADE_STEP);
          settled = false;
        } else {
          activeTrack.volume = targetBgVol;
        }
      }

      if (wishAudioRef.current) {
        if (isWishing) {
          if (wishAudioRef.current.paused) {
            wishAudioRef.current.currentTime = 0; // Start at the beginning for a natural rise
            wishAudioRef.current.volume = 0;
            const playPromise = wishAudioRef.current.play();
            if (playPromise !== undefined) {
              playPromise.catch(e => console.warn('Wish play blocked:', e));
            }
          }
          if (wishAudioRef.current.volume < 0.8) {
            wishAudioRef.current.volume = Math.min(0.8, wishAudioRef.current.volume + FADE_STEP * 2.5);
            settled = false;
          }
        } else {
          if (wishAudioRef.current.volume > FADE_STEP * 3) {
            wishAudioRef.current.volume = Math.max(0, wishAudioRef.current.volume - FADE_STEP * 3);
            settled = false;
          } else {
            wishAudioRef.current.volume = 0;
            if (!wishAudioRef.current.paused) wishAudioRef.current.pause();
          }
        }
      }

      if (settled && fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
      }
    }, FADE_INTERVAL);

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, [isWishing, isPlaying, pathname]);

  return (
    <>
      <audio 
        ref={wishAudioRef}
        src={resolveAssetUrl(WISH_SWELL_BASE, 'audio')}
        preload="auto"
      />
      {Object.entries(TRACKS_BASES).map(([path, basePath]) => (
        <audio 
          key={path}
          ref={el => {
            if (el) audioRefs.current[path] = el;
          }}
          src={resolveAssetUrl(basePath, 'audio')}
          loop
          preload="auto"
        />
      ))}
    </>
  );
}
