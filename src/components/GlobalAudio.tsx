import { useEffect, useRef, useState } from 'react';
import type { SceneId } from '../App';
import { useWish } from '../contexts/WishContext';
import { resolveAssetUrl } from '../lib/assetUtils';

// Cohesive, universe-themed ambient tracks (Creative Commons - Stellardrone)
const TRACKS_BASES: Partial<Record<SceneId, string>> = {
  home: '/assets/audio/audio-ambient', // The Sky - Vast, expansive space
  journal: '/assets/audio/audio-intimate', // The Journal - Quiet, minimal drone
  archive: '/assets/audio/audio-nostalgic' // The Archive - Warm, nostalgic
};

const WISH_SWELL_BASE = '/assets/audio/wish-swell'; // Grand track, jumps directly to peak

const TARGET_VOLUME = 0.45; // Moderately low background volume for ambient tracks
const WISH_DIM_VOLUME = 0.05; // Drop background track volume heavily during wish
const FADE_STEP = 0.01;
const FADE_INTERVAL = 30; // 30ms
const SOUNDTRACK_CROSSFADE_DURATION_MS = 2000; // 2 seconds between global scene soundtracks
const SOUNDTRACK_FADE_INTERVAL = 30; // Keep soundtrack blends smooth without overworking the browser

function fadeAudioVolume(
  audio: HTMLAudioElement,
  targetVolume: number,
  durationMs: number,
  onComplete?: () => void
) {
  const startVolume = audio.volume;
  const startTime = performance.now();

  const timer = setInterval(() => {
    const progress = Math.min((performance.now() - startTime) / durationMs, 1);
    const nextVolume = startVolume + (targetVolume - startVolume) * progress;

    try {
      audio.volume = Math.min(1, Math.max(0, nextVolume));
    } catch (e) {
      audio.volume = targetVolume;
    }

    if (progress >= 1) {
      audio.volume = targetVolume;
      clearInterval(timer);
      onComplete?.();
    }
  }, SOUNDTRACK_FADE_INTERVAL);

  return timer;
}

export function GlobalAudio({ hasEntered, activeScene }: { hasEntered: boolean; activeScene: SceneId }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const wishAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentSceneRef = useRef<SceneId>(activeScene);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { isWishing } = useWish();

  // Initial play on entry or fallback on interaction
  useEffect(() => {
    const tryPlay = () => {
      if (!hasEntered || isPlaying) return;

      const currentTrack = audioRefs.current[activeScene] || audioRefs.current.home;
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
      const currentTrack = audioRefs.current[activeScene] || audioRefs.current.home;
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
  }, [activeScene, hasEntered, isPlaying]);

  // Handle scene transitions (Crossfading & Pausing/Resuming state)
  useEffect(() => {
    if (!isPlaying) return;

    const previousScene = currentSceneRef.current;
    
    const normalizedCurrentScene = TRACKS_BASES[activeScene] ? activeScene : null;
    const normalizedPreviousScene = TRACKS_BASES[previousScene] ? previousScene : null;

    if (normalizedPreviousScene === normalizedCurrentScene) return;

    currentSceneRef.current = activeScene;

    const fadeOutAudio = normalizedPreviousScene ? audioRefs.current[normalizedPreviousScene] : null;
    const fadeInAudio = normalizedCurrentScene ? audioRefs.current[normalizedCurrentScene] : null;

    let fadeOutTimer: ReturnType<typeof setInterval> | null = null;
    let fadeInTimer: ReturnType<typeof setInterval> | null = null;
    const targetAmbientVolume = TARGET_VOLUME;

    if (fadeOutAudio) {
      fadeOutTimer = fadeAudioVolume(
        fadeOutAudio,
        0,
        SOUNDTRACK_CROSSFADE_DURATION_MS,
        () => {
          fadeOutAudio.pause(); // Pause to retain the exact position where we left it
        }
      );
    }

    if (fadeInAudio) {
      fadeInAudio.volume = 0;
      fadeInAudio.play().catch(e => console.warn('Play blocked on fade-in:', e));
      fadeInTimer = fadeAudioVolume(fadeInAudio, targetAmbientVolume, SOUNDTRACK_CROSSFADE_DURATION_MS);
    }

    return () => {
      if (fadeOutTimer) clearInterval(fadeOutTimer);
      if (fadeInTimer) clearInterval(fadeInTimer);
    };
  }, [activeScene, isPlaying]);

  // Handle Wish State (Swell logic)
  useEffect(() => {
    if (!isPlaying) return;

    const normalizedCurrentScene = TRACKS_BASES[activeScene] ? activeScene : null;
    const activeTrack = normalizedCurrentScene ? audioRefs.current[normalizedCurrentScene] : null;

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
  }, [activeScene, isPlaying, isWishing]);

  return (
    <>
      <audio 
        ref={wishAudioRef}
        src={resolveAssetUrl(WISH_SWELL_BASE, 'audio')}
        preload="auto"
      />
      {Object.entries(TRACKS_BASES).map(([scene, basePath]) => (
        <audio 
          key={scene}
          ref={el => {
            if (el) audioRefs.current[scene] = el;
          }}
          src={resolveAssetUrl(basePath, 'audio')}
          loop
          preload="auto"
        />
      ))}
    </>
  );
}
