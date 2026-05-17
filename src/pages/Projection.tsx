import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { resolveAssetUrl } from '../lib/assetUtils';
import projectionContent from '../content/projection.json';

// An ethereal ambient royalty-free video
const VIDEO_BASE = projectionContent.video;

// The shader to project the video out like volumetric light and ambient glow
const ProjectionShader = {
  uniforms: {
    tDiffuse: { value: null },
    opacity: { value: 0.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float opacity;
    varying vec2 vUv;

    void main() {
      // Box blur logic to scatter the video colors
      vec4 color = vec4(0.0);
      float total = 0.0;
      
      // We sample across a wide area to simulate light bouncing off distant walls
      float spread = 0.15;
      
      for(float x = -2.0; x <= 2.0; x++) {
        for(float y = -2.0; y <= 2.0; y++) {
          color += texture2D(tDiffuse, fract(vUv + vec2(x, y) * spread * 0.2));
          total += 1.0;
        }
      }
      color /= total;
      
      // Boost the saturation and brightness for a glowing effect
      vec3 glowColor = color.rgb * 1.5;
      
      // Add a radial vignette so it fades out at the edges like a cinema room
      float dist = distance(vUv, vec2(0.5));
      float vignette = smoothstep(0.8, 0.2, dist);
      
      gl_FragColor = vec4(glowColor * vignette, opacity);
    }
  `
};

function AmbilightMesh({ video }: { video: HTMLVideoElement | null }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  
  // We use useMemo to only create the texture once when the video is ready
  const videoTexture = useRef<THREE.VideoTexture | null>(null);

  useEffect(() => {
    if (video) {
      videoTexture.current = new THREE.VideoTexture(video);
      videoTexture.current.minFilter = THREE.LinearFilter;
      videoTexture.current.magFilter = THREE.LinearFilter;
      videoTexture.current.format = THREE.RGBAFormat;
      if (materialRef.current) {
        materialRef.current.uniforms.tDiffuse.value = videoTexture.current;
      }
    }
  }, [video]);

  useFrame(() => {
    if (materialRef.current) {
      // Fade in the ambient light once the video plays
      materialRef.current.uniforms.opacity.value += (1.0 - materialRef.current.uniforms.opacity.value) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial 
        ref={materialRef}
        vertexShader={ProjectionShader.vertexShader}
        fragmentShader={ProjectionShader.fragmentShader}
        uniforms={THREE.UniformsUtils.clone(ProjectionShader.uniforms)}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export function Projection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);

  useEffect(() => {
    // Only set ready once the video element is mounted so we can pass it to WebGL
    if (videoRef.current) {
        setIsVideoReady(true);
    }
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
      className="absolute inset-0 z-0 overflow-hidden flex flex-col items-center justify-center p-8 bg-black/90"
    >
      {/* Background WebGL Ambilight */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-80" style={{ transform: 'scale(1.5)' }}>
         <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
             {isVideoReady && videoRef.current && (
                 <AmbilightMesh video={videoRef.current} />
             )}
         </Canvas>
      </div>

      {/* Volumetric Light Shaft (CSS representation coming from top) */}
      <div 
         className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vh] z-0 pointer-events-none opacity-30 mix-blend-screen"
         style={{
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%)',
            filter: 'blur(30px)'
         }}
      />

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center group">
        <motion.div 
            initial={{ y: 20, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
            className="w-full relative cursor-pointer shadow-2xl"
            onClick={togglePlay}
        >
            {/* The floating borderless frame */}
            <video
              ref={videoRef}
              src={resolveAssetUrl(VIDEO_BASE, 'video')}
              className="w-full h-auto object-cover rounded-sm border-0"
              loop
              crossOrigin="anonymous"
            />
            
            {/* Play/Pause Overlay Component */}
            <AnimatePresence>
              {!isPlaying && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-sm"
                >
                   <div className="w-16 h-16 rounded-full border border-white/50 flex items-center justify-center text-white/80">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M8 5v14l11-7z"/>
                      </svg>
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
        </motion.div>
        
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 0.5 }}
           transition={{ delay: 2, duration: 2 }}
           className="mt-8 font-serif italic text-white/50 text-sm"
        >
           {projectionContent.caption}
        </motion.div>
      </div>
    </motion.div>
  );
}
