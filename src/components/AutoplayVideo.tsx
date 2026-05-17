import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

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
    } else if (!isIntersecting) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isIntersecting, isScrolling]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true));
    }
  };

  return (
    <div className={`relative ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        loop={loop}
        playsInline
        muted // Autoplay usually requires muted
      />
      
      <div className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-500 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
        <button
          onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hover:scale-105"
        >
          {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
        </button>
      </div>
    </div>
  );
}
