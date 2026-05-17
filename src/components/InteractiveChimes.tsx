import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function InteractiveChimes() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleCounter = useRef(0);

  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Add ripple effect
      const newRipple = {
        id: rippleCounter.current++,
        x: e.clientX,
        y: e.clientY
      };
      setRipples(prev => [...prev, newRipple]);
      
      // Auto-remove ripple after animation
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 1500);

      // Initialize AudioContext on first interaction if it doesn't exist
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }
      
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      // Resume context if suspended
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Calculate pan from -1 to 1
      const panValue = (e.clientX / window.innerWidth) * 2 - 1;

      playChime(ctx, panValue);
    };

    window.addEventListener('mousedown', handleGlobalClick);
    
    return () => {
      window.removeEventListener('mousedown', handleGlobalClick);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const playChime = (ctx: AudioContext, panValue: number) => {
    const t = ctx.currentTime;

    // Use a warmer C-Lydian scale (featuring the #4) for a dreamier, golden-hour vibe
    // C6, D6, E6, F#6, G6, A6, B6, C7, D7, E7, F#7, G7
    const frequencies = [
      1046.50, 1174.66, 1318.51, 1479.98, 1567.98, 1760.00, 1975.53, 
      2093.00, 2349.32, 2637.02, 2959.96, 3135.96
    ];
    
    const baseFreq = frequencies[Math.floor(Math.random() * frequencies.length)];

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0.05; // Slightly warmer/fuller volume
    masterGain.connect(ctx.destination);

    let finalNode: AudioNode = masterGain;
    if (ctx.createStereoPanner) {
      const panner = ctx.createStereoPanner();
      panner.pan.value = panValue;
      panner.connect(masterGain);
      finalNode = panner;
    }

    // Softer, lingering envelope for "golden hour" vibe
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t);
    env.gain.linearRampToValueAtTime(1, t + 0.04); // Slower attack
    env.gain.exponentialRampToValueAtTime(0.001, t + 2.5); // Longer decay ("lingering")
    env.connect(finalNode);

    const createOscillator = (freqMulti: number, volume: number, type: OscillatorType = 'sine') => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(baseFreq * freqMulti, t);
      
      // Add slight detuning to harmonics for "richer" sound
      if (freqMulti > 1) {
        osc.detune.setValueAtTime(Math.random() * 10 - 5, t);
      }
      
      oscGain.gain.setValueAtTime(volume, t);
      
      osc.connect(oscGain);
      oscGain.connect(env);
      
      osc.start(t);
      osc.stop(t + 2.6); 
    };

    // 1. Fundamental
    createOscillator(1, 1, 'sine');
    // 2. Warm Overtone 1
    createOscillator(2.0, 0.4, 'sine');
    // 3. Richer metallic bell (Triangle with slightly different harmonic)
    createOscillator(1.5, 0.25, 'triangle'); // Fifth
    // 4. Sparkle
    createOscillator(4.0, 0.1, 'sine');
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute rounded-full border border-purple-300/40 bg-purple-400/5 blur-[2px]"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 100,
              height: 100,
              marginLeft: -50,
              marginTop: -50,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
