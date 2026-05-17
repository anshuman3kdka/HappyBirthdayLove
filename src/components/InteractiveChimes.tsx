import { useEffect, useRef } from 'react';

export function InteractiveChimes() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Initialize AudioContext on first interaction if it doesn't exist
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      // Resume context if suspended (browser autoplay policy)
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Calculate pan from -1 (left) to 1 (right) based on click position
      const panValue = (e.clientX / window.innerWidth) * 2 - 1;

      playChime(ctx, panValue);
    };

    window.addEventListener('mousedown', handleGlobalClick);
    
    return () => {
      window.removeEventListener('mousedown', handleGlobalClick);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        // Clean up context on unmount to prevent leaks
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const playChime = (ctx: AudioContext, panValue: number) => {
    const t = ctx.currentTime;

    // Use a high C Major Pentatonic scale for a pleasant, twinkling sound
    const frequencies = [1046.50, 1174.66, 1318.51, 1567.98, 1760.00, 2093.00, 2349.32, 2637.02];
    
    // Choose a random note
    const baseFreq = frequencies[Math.floor(Math.random() * frequencies.length)];

    // Master gain for this individual chime
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.04; // Keep it subtle and low volume
    masterGain.connect(ctx.destination);

    // Stereo Panner
    // Use modern standard createStereoPanner if available, gracefully fallback
    let finalNode: AudioNode = masterGain;
    if (ctx.createStereoPanner) {
      const panner = ctx.createStereoPanner();
      panner.pan.value = panValue;
      panner.connect(masterGain);
      finalNode = panner;
    }

    // Main Envelope (Controls output volume over time)
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(1, t + 0.02); 
    env.gain.exponentialRampToValueAtTime(0.001, t + 1.5); 
    env.connect(finalNode);

    // Oscillator factory for complex bell harmonic structures
    const createOscillator = (freqMulti: number, volume: number, type: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(baseFreq * freqMulti, t);
      
      oscGain.gain.setValueAtTime(volume, t);
      
      osc.connect(oscGain);
      oscGain.connect(env);
      
      osc.start(t);
      osc.stop(t + 1.6); 
    };

    // 1. Fundamental frequency
    createOscillator(1, 1, 'sine');
    // 2. Harmonic / Overtone 1 (slightly detuned, creates the shimmer)
    createOscillator(2.01, 0.4, 'sine');
    // 3. Harmonic / Overtone 2 (gives it a slight metallic bell characteristic)
    createOscillator(3.14, 0.2, 'triangle');
    // 4. Very high sparkle overtone
    createOscillator(4.2, 0.1, 'sine');
  };

  return null;
}
