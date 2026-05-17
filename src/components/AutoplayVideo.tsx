import { useState, useRef, useEffect } from 'react';

interface AutoplayVideoProps {
  src: string;
  poster?: string;
  className?: string;
  loop?: boolean;
}

export function AutoplayVideo({ src, poster, className, loop = true }: AutoplayVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
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

    // Pause immediately if scrolling or out of view
    if (!isIntersecting || isScrolling) {
      videoRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // Play if intersecting and completely stopped scrolling
    if (isIntersecting && !isScrolling) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => {
          // Auto-play might be blocked by browser if not muted
          // Ensure muted for autoplay
          if (videoRef.current) {
            videoRef.current.muted = true;
            videoRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error("Video play failed:", e));
          }
        });
      }
    }
  }, [isIntersecting, isScrolling]);

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
          muted // Autoplay usually requires muted
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
