import { useState, useRef, useEffect } from 'react';

interface AutoplayVideoProps {
  src: string;
  poster?: string;
  className?: string;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
}

export function AutoplayVideo({
  src,
  poster,
  className,
  loop = true,
  muted = true,
  volume = 1,
}: AutoplayVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [needsUserInteraction, setNeedsUserInteraction] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const scrollTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 150); // Small threshold for "stopped"
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold: 0.6 } // High threshold to ensure it's "on" them
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    videoRef.current.muted = muted;
    videoRef.current.volume = Math.min(1, Math.max(0, volume));
  }, [muted, volume]);

  useEffect(() => {
    if (!videoRef.current) return;

    // Pause immediately if scrolling or out of view
    if (!isIntersecting || isScrolling) {
      videoRef.current.pause();
      setIsPlaying(false);
      return;
    }

    const playVideo = () => {
      if (!videoRef.current) return;

      videoRef.current.muted = muted;
      videoRef.current.volume = Math.min(1, Math.max(0, volume));

      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setNeedsUserInteraction(false);
          setIsPlaying(true);
        }).catch(e => {
          if (!muted) {
            console.warn("Video with sound needs a direct user interaction before playback:", e);
            setNeedsUserInteraction(true);
            setIsPlaying(false);
            return;
          }

          // Silent hologram videos can still fall back to muted autoplay.
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().then(() => setIsPlaying(true)).catch(error => console.error("Video play failed:", error));
          }
        });
      }
    };

    // Play if intersecting and completely stopped scrolling
    if (isIntersecting && !isScrolling) {
      playVideo();
    }
  }, [isIntersecting, isScrolling, muted, volume]);

  useEffect(() => {
    if (!needsUserInteraction || muted || !isIntersecting || isScrolling) return;

    const retryWithSound = () => {
      if (!videoRef.current) return;

      videoRef.current.muted = false;
      videoRef.current.volume = Math.min(1, Math.max(0, volume));
      videoRef.current.play().then(() => {
        setNeedsUserInteraction(false);
        setIsPlaying(true);
      }).catch(e => console.warn("Video play failed after interaction:", e));
    };

    window.addEventListener('click', retryWithSound, { once: true });
    window.addEventListener('touchstart', retryWithSound, { once: true });

    return () => {
      window.removeEventListener('click', retryWithSound);
      window.removeEventListener('touchstart', retryWithSound);
    };
  }, [isIntersecting, isScrolling, muted, needsUserInteraction, volume]);

  return (
    <div className={`relative ${className} [perspective:1000px]`}>
      <div 
        className={`w-full h-full relative transition-all duration-1000 preserve-3d
        animate-float-tilt ${isPlaying ? 'animate-glow-pulse' : 'opacity-70'}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-cover mix-blend-screen opacity-80"
          style={{
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
          }}
          loop={loop}
          playsInline
          muted={muted}
        />
        
        {/* Film grain / Static Scanlines */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay z-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
          }}
        />

        {/* Slow-moving scanline artifact */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
           <div className="w-full h-[5%] bg-gradient-to-b from-transparent via-cyan-200/20 to-transparent animate-scanline mix-blend-screen" />
        </div>
      </div>
    </div>
  );
}
