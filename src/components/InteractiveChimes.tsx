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

      // Calculate spatial positions from -1 to 1 based on click coordinates
      const xPos = (e.clientX / window.innerWidth) * 2 - 1;
      // Invert Y so that top of screen (0) maps to positive Y in audio space
      const yPos = -((e.clientY / window.innerHeight) * 2 - 1);

      playChime(ctx, xPos, yPos);
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

  const playChime = (ctx: AudioContext, xPos: number, yPos: number) => {
    const t = ctx.currentTime;

    // Use a high C Major Pentatonic scale for a pleasant, twinkling sound
    // C6, D6, E6, G6, A6, C7, D7, E7
    const frequencies = [1046.50, 1174.66, 1318.51, 1567.98, 1760.00, 2093.00, 2349.32, 2637.02];
    
    // Choose a random note
    const baseFreq = frequencies[Math.floor(Math.random() * frequencies.length)];

    // Master gain for this individual chime
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.04; // Keep it subtle and low volume
    masterGain.connect(ctx.destination);

    // 3D Panner (Spatial Audio)
    // Use HRTF (Head-Related Transfer Function) for superior 2D/3D positioning
    const panner = ctx.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 10000;
    panner.rolloffFactor = 1;

    // Map screen coordinates to audio space
    // We place the sound slightly in front of the listener (Z = -0.5) to avoid the "inside-head" effect
    panner.positionX.setValueAtTime(xPos, t);
    panner.positionY.setValueAtTime(yPos, t);
    panner.positionZ.setValueAtTime(-0.5, t);
    
    panner.connect(masterGain);
    const finalNode: AudioNode = panner;

    // Main Envelope (Controls output volume over time)
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(1, t + 0.02); // Fast attack
    env.gain.exponentialRampToValueAtTime(0.001, t + 1.5); // Sweet, long decay (1.5s)
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
      osc.stop(t + 1.6); // Stop slightly after decay drops off
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
