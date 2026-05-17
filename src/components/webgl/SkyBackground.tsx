import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useWish } from '../../contexts/WishContext';

interface ConstellationProps {
  points: THREE.Vector3[];
  indices: Uint16Array;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  pulseSpeed?: number;
  pulseOffset?: number;
  interactive?: boolean;
  onClick?: () => void;
  glowing?: boolean;
}

function Constellation({ points, indices, position, rotation, scale, pulseSpeed = 2, pulseOffset = 0, interactive = false, onClick, glowing = false }: ConstellationProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const [hovered, setHovered] = useState(false);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    return geo;
  }, [points, indices]);

  useFrame((state) => {
    const t = state.clock.elapsedTime * pulseSpeed + pulseOffset;
    if (pointsRef.current) {
      const baseSize = glowing ? 0.3 : 0.08;
      const glowScale = glowing ? 2.5 : 1.0;
      (pointsRef.current.material as THREE.PointsMaterial).size = (baseSize + Math.sin(t) * 0.03 + (hovered ? 0.05 : 0)) * glowScale;
      (pointsRef.current.material as THREE.PointsMaterial).opacity = glowing ? 1.0 : (0.8 + Math.sin(t * 0.5) * 0.2 + (hovered ? 0.2 : 0));
    }
    if (linesRef.current) {
      (linesRef.current.material as THREE.LineBasicMaterial).opacity = glowing ? 1.0 : (0.25 + Math.sin(t * 0.25) * 0.15 + (hovered ? 0.3 : 0));
    }
    if (pointsRef.current && linesRef.current) {
      // Gentle slow rotation for life
      const drift = Math.sin(state.clock.elapsedTime * 0.1 + pulseOffset) * 0.05;
      pointsRef.current.rotation.z = drift;
      linesRef.current.rotation.z = drift;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {interactive && (
        <mesh
          onClick={(e) => { e.stopPropagation(); onClick?.(); }}
          onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
          onPointerOut={(e) => { e.stopPropagation(); setHovered(false); document.body.style.cursor = 'auto'; }}
        >
          {/* Much tighter and better positioned click target */}
          <sphereGeometry args={[2, 12, 12]} />
          <meshBasicMaterial visible={false} />
        </mesh>
      )}
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial 
          size={0.08} 
          color="#ffffff" 
          transparent 
          opacity={0.8}
          blending={THREE.AdditiveBlending} 
        />
      </points>
      <lineSegments ref={linesRef} geometry={geometry}>
        <lineBasicMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.3}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

// Data for Heart/Arch Shape
const shapeHeartPoints = [
  new THREE.Vector3(-2, 1, -5),
  new THREE.Vector3(-1, 2, -5),
  new THREE.Vector3(0, 1.5, -5),
  new THREE.Vector3(1, 2, -5),
  new THREE.Vector3(2, 1, -5),
  new THREE.Vector3(1.5, -0.5, -5),
  new THREE.Vector3(0, -2, -5),
  new THREE.Vector3(-1.5, -0.5, -5),
  new THREE.Vector3(-0.5, 0.5, -5),
  new THREE.Vector3(0.5, 0.5, -5),
];
const shapeHeartIndices = new Uint16Array([
  0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 0,
  7, 8, 8, 2, 5, 9, 9, 2
]);

// Data for Cat Constellation (Profile of a seated cat)
const shapeCatPoints = [
  new THREE.Vector3(0.5, 1.5, -8),  // R ear tip 0
  new THREE.Vector3(0, 0.8, -8),    // Head top 1
  new THREE.Vector3(-0.6, 1.2, -8), // L ear tip 2
  new THREE.Vector3(-1.0, 0.5, -8), // Face front 3
  new THREE.Vector3(-0.6, -0.1, -8),// Chin 4
  new THREE.Vector3(0.5, 0.2, -8),  // Back of neck 5
  
  new THREE.Vector3(1.0, -1.0, -8), // Back curve 6
  new THREE.Vector3(1.2, -2.5, -8), // Butt 7
  
  new THREE.Vector3(0.5, -3.0, -8), // Tail start 8
  new THREE.Vector3(-0.2, -2.8, -8),// Tail curl 9
  new THREE.Vector3(-0.5, -2.2, -8),// Tail tip 10
  
  new THREE.Vector3(-0.8, -2.5, -8),// Front paws 11
  new THREE.Vector3(-0.5, -1.0, -8),// Chest 12
];
const shapeCatIndices = new Uint16Array([
  0, 1, 1, 2, 2, 3, 3, 4, 4, 12, // Face and front
  0, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, // Back and tail
  12, 11, 11, 7 // Chest down to paws, paws to butt
]);

// Data for Big Dipper-esque
const shapeDipperPoints = [
  new THREE.Vector3(-4, 0, -10),
  new THREE.Vector3(-2.5, -0.5, -10),
  new THREE.Vector3(-1, 0, -10),
  new THREE.Vector3(0, -1, -10),
  new THREE.Vector3(2, -1.5, -10),
  new THREE.Vector3(2.5, 0.5, -10),
  new THREE.Vector3(0.5, 1, -10),
];
const shapeDipperIndices = new Uint16Array([
  0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 3
]);

// Data for Diamond/Kite
const shapeKitePoints = [
  new THREE.Vector3(0, 3, -6),
  new THREE.Vector3(1.5, 0, -6),
  new THREE.Vector3(0, -4, -6),
  new THREE.Vector3(-1.5, 0, -6),
  new THREE.Vector3(0, 0, -6),
];
const shapeKiteIndices = new Uint16Array([
  0, 1, 1, 2, 2, 3, 3, 0, 0, 4, 1, 4, 2, 4, 3, 4
]);

function ShootingStar() {
  const lineRef = useRef<THREE.Line>(null);
  const { viewport } = useThree();

  const points = useMemo(() => [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(1, -1, 0) // The tail of the shooting star
  ], []);

  const geometry = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);

  const material = useMemo(() => new THREE.LineBasicMaterial({ color: "#d6bcfa", transparent: true, opacity: 0, linewidth: 2 }), []);
  const lineObj = useMemo(() => new THREE.Line(geometry, material), [geometry, material]);

  useFrame((state) => {
    // Cycle every 12 seconds
    const t = state.clock.elapsedTime % 12;
    
    if (t < 0.5) {
      // Shooting phase
      const progress = t * 2; // 0 to 1 over 0.5 seconds
      
      const startX = viewport.width / 2 + 2;
      const startY = viewport.height / 2 + 2;
      
      const distanceX = viewport.width + 4;
      const distanceY = viewport.height + 4;

      lineObj.position.set(
        startX - progress * distanceX,
        startY - progress * distanceY,
        -2
      );
      
      (lineObj.material as THREE.LineBasicMaterial).opacity = Math.sin(progress * Math.PI) * 0.8;
    } else {
      (lineObj.material as THREE.LineBasicMaterial).opacity = 0;
    }
  });

  return <primitive object={lineObj} />;
}

function WishStar() {
  const { viewport } = useThree();
  const { isWishing } = useWish();
  
  const [hasWished, setHasWished] = useState(false);
  
  // We want to guarantee the star completes its animation once triggered,
  // even if the user lets go of the spacebar.
  const [activeWishAnimation, setActiveWishAnimation] = useState(false);

  useEffect(() => {
    if (isWishing && !hasWished) {
      setHasWished(true);
      setActiveWishAnimation(true);
    } else if (!isWishing && hasWished) {
      setHasWished(false);
      // We do NOT set activeWishAnimation to false here, we strictly let the useFrame loop expire it
    }
  }, [isWishing, hasWished]);

  const wishStartTime = useRef<number | null>(null);
  const trajectory = useRef({ startX: 0, startY: 0, distanceX: 0, distanceY: 0 });
  const groupRef = useRef<THREE.Group>(null);
  const headMaterialRef = useRef<THREE.MeshBasicMaterial>(null);

  const points = useMemo(() => [
    new THREE.Vector3(0, 0, 0), // Head
    new THREE.Vector3(1, -1, 0) // Tail end
  ], []);
  
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    // Add vertex colors (head is opaque white, tail is transparent)
    const colors = new Float32Array([
      0.9, 0.9, 1.0, // vertex 0 (head): rgb (soft lavender tint)
      0.8, 0.7, 1.0  // vertex 1 (tail): rgb
    ]);
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    return geo;
  }, [points]);
  
  // Custom shader for line fading since LineBasicMaterial's vertexColors doesn't support alpha per-vertex natively in all WebGL implementations as easily
  const material = useMemo(() => new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    uniforms: {
      globalOpacity: { value: 0.0 }
    },
    vertexShader: `
      attribute float alpha;
      varying float vAlpha;
      void main() {
        vAlpha = alpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float globalOpacity;
      varying float vAlpha;
      void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, vAlpha * globalOpacity);
      }
    `
  }), []);
  
  // Re-write geometry to use the custom alpha attribute for the shader
  useMemo(() => {
    const alphas = new Float32Array([1.0, 0.0]); // head is 1.0, tail is 0.0
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
  }, [geometry]);

  const lineObj = useMemo(() => {
    const line = new THREE.Line(geometry, material);
    line.renderOrder = 100;
    return line;
  }, [geometry, material]);

  useFrame((state) => {
    if (activeWishAnimation && wishStartTime.current === null) {
      wishStartTime.current = state.clock.elapsedTime;

      const angle = Math.random() * Math.PI * 2;
      const radius = Math.max(viewport.width, viewport.height) * 1.5; // ensure it starts off-screen
      
      const sX = Math.cos(angle) * radius;
      const sY = Math.sin(angle) * radius;
      
      const targetAngle = angle + Math.PI + (Math.random() - 0.5) * 1.5; 
      const tEndX = Math.cos(targetAngle) * radius;
      const tEndY = Math.sin(targetAngle) * radius;

      const dX = sX - tEndX;
      const dY = sY - tEndY;
      
      trajectory.current = { startX: sX, startY: sY, distanceX: dX, distanceY: dY };

      const distLen = Math.sqrt(dX * dX + dY * dY);
      const tailLength = 2.0; 
      const tX = (dX / distLen) * tailLength;
      const tY = (dY / distLen) * tailLength;
      
      geometry.setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(tX, tY, 0)
      ]);
    }

    if (activeWishAnimation && wishStartTime.current !== null) {
      const elapsed = state.clock.elapsedTime - wishStartTime.current;
      const DURATION = 2.5; // Make the star taking slightly longer to finish its journey
      
      if (elapsed < DURATION) {
        const progress = elapsed / DURATION;
        const { startX, startY, distanceX, distanceY } = trajectory.current;

        if (groupRef.current) {
          groupRef.current.position.set(
            startX - progress * distanceX,
            startY - progress * distanceY,
            -5 
          );
        }
        
        // Smooth sine wave for opacity fading in and out over the duration
        const opacity = Math.sin(progress * Math.PI) * 1.0;
        (lineObj.material as THREE.ShaderMaterial).uniforms.globalOpacity.value = opacity;
        if (headMaterialRef.current) headMaterialRef.current.opacity = opacity;
      } else {
        // Animation finished
        (lineObj.material as THREE.ShaderMaterial).uniforms.globalOpacity.value = 0;
        if (headMaterialRef.current) headMaterialRef.current.opacity = 0;
        wishStartTime.current = null;
        setActiveWishAnimation(false);
      }
    } else {
      (lineObj.material as THREE.ShaderMaterial).uniforms.globalOpacity.value = 0;
      if (headMaterialRef.current) headMaterialRef.current.opacity = 0;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={lineObj} />
      <mesh renderOrder={101}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial ref={headMaterialRef} color="#f3e8ff" transparent opacity={0} depthTest={false} />
      </mesh>
    </group>
  );
}

function WishFadingOverlay() {
  const { isWishing } = useWish();
  const location = useLocation();
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const { scene } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      const isProjection = location.pathname === '/projection';
      const targetOpacity = isWishing ? 1.0 : (isProjection ? 0.95 : 0.0);
      materialRef.current.opacity += (targetOpacity - materialRef.current.opacity) * (isWishing ? 0.05 : 0.02); 

      if (scene.background && (scene.background as THREE.Color).isColor) {
        materialRef.current.color.copy(scene.background as THREE.Color);
      }
    }
    
    if (meshRef.current) {
      meshRef.current.position.copy(state.camera.position);
      meshRef.current.position.add(state.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(1));
      meshRef.current.quaternion.copy(state.camera.quaternion);
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={99}> 
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial ref={materialRef} transparent opacity={0} depthTest={false} depthWrite={false} color="#020202" />
    </mesh>
  );
}

function SceneController() {
  const { camera, scene } = useThree();
  const location = useLocation();

  useEffect(() => {
    // Determine target color and desired rotation for the specific route
    let targetColor = '#1c0d2a'; // Deep dusky lavender
    let targetRotationZ = 0;
    
    if (location.pathname === '/journal') {
      targetColor = '#3a1b40'; // Warm lavender / sunset blend
      targetRotationZ = Math.PI / 4;
    } else if (location.pathname === '/archive') {
      targetColor = '#4a2531'; // Bougainvillea rich twilight
      targetRotationZ = -Math.PI / 4;
    } else if (location.pathname === '/projection') {
      targetColor = '#080512'; // Deep space void
      targetRotationZ = 0;
    }

    const tl = gsap.timeline();

    // Aggressive hyperspace feel on route change
    tl.to(camera, {
      fov: 160,
      duration: 0.8,
      ease: 'power3.in',
      onUpdate: () => camera.updateProjectionMatrix()
    });

    tl.to(camera.position, {
      z: -100,
      duration: 1.2,
      ease: 'power4.inOut'
    }, 0);

    // Swap environment state at peak
    tl.add(() => {
      scene.background = new THREE.Color(targetColor);
      if (scene.fog) scene.fog.color.set(targetColor);
      scene.rotation.z = targetRotationZ;
      camera.position.z = 100; // Warp around
    }, 1.0);

    // Settle
    tl.to(camera.position, {
      z: 5,
      duration: 1.5,
      ease: 'power3.out'
    }, 1.2);

    tl.to(camera, {
      fov: 60,
      duration: 1.5,
      ease: 'power3.out',
      onUpdate: () => camera.updateProjectionMatrix()
    }, 1.2);

  }, [location.pathname, camera, scene]);

  return null;
}

export function SkyBackground() {
  const [showHeartSecret, setShowHeartSecret] = useState(false);
  const [showCatSecret, setShowCatSecret] = useState(false);
  const [catGlowing, setCatGlowing] = useState(false);
  const [projectionGlowing, setProjectionGlowing] = useState(false);
  const navigate = useNavigate();

  const playPurr = () => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Resume context if suspended
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const duration = 6;
    const t = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, t);
    masterGain.gain.linearRampToValueAtTime(0.15, t + 1);
    masterGain.gain.setValueAtTime(0.15, t + duration - 2);
    masterGain.gain.linearRampToValueAtTime(0.01, t + duration);
    masterGain.connect(ctx.destination);

    // Filter to keep it warm and deep
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    filter.connect(masterGain);

    // Carrier (sub bass)
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth'; 
    osc.frequency.value = 35; 
    
    // Amplitude modulation for the "motor" sound (purring)
    const amOsc = ctx.createOscillator();
    amOsc.type = 'sine';
    amOsc.frequency.value = 23; 
    
    const amGain = ctx.createGain();
    // Start with 0 so the carrier is muted initially? No, amGain multiplies
    // To do true AM, we need to add a DC offset or just let it modulate.
    // If amGain goes from -1 to 1, it modulates fully.
    
    osc.connect(amGain);
    amOsc.connect(amGain.gain);
    
    amGain.connect(filter);

    osc.start(t);
    amOsc.start(t);
    osc.stop(t + duration);
    amOsc.stop(t + duration);
    
    setTimeout(() => {
      if (ctx.state !== 'closed') ctx.close().catch(() => {});
    }, (duration + 0.5) * 1000);
  };

  const handleCatClick = () => {
    setShowCatSecret(true);
    setCatGlowing(true);
    playPurr();
  };

  const handleProjectionTransition = () => {
    setProjectionGlowing(true);
    // Glow intensifies for a moment, then transitions
    setTimeout(() => {
       navigate('/projection');
       // Don't reset glow immediately so it stays glowing during exit transition
       setTimeout(() => setProjectionGlowing(false), 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[-1] bg-[#1c0d2a]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, toneMapping: THREE.ACESFilmicToneMapping, powerPreference: "high-performance" }}
      >
        <SceneController />
        <color attach="background" args={['#1c0d2a']} />
        <fog attach="fog" args={['#1c0d2a', 5, 50]} />
        
        {/* Ambient very dim lighting */}
        <ambientLight intensity={0.25} />
        
        {/* Standard Drei Stars map */}
        <Stars 
          radius={50} 
          depth={50} 
          count={4000} 
          factor={5} 
          saturation={0.5} 
          fade 
          speed={0.8} 
        />

        <group>
          {/* Floating Sparkles for depth */}
          <Sparkles 
            count={500} 
            scale={20} 
            size={4} 
            speed={0.4} 
            opacity={0.3} 
            color="#e9d5ff" // Lavender sparkles
          />
          <Sparkles 
            count={200} 
            scale={30} 
            size={10} 
            speed={0.2} 
            opacity={0.2} 
            color="#fecaca" // Warm sunset / Carnation pink
          />

          {/* Custom additions - Clean quadrant layout */}
          <Constellation 
            points={shapeHeartPoints} 
            indices={shapeHeartIndices} 
            position={[-4, -3, -5]} 
            rotation={[0, -0.2, 0.1]} 
            scale={0.6}
            pulseSpeed={2}
            pulseOffset={0}
            interactive={true}
            onClick={() => setShowHeartSecret(true)}
          />
          <Constellation 
            points={shapeCatPoints} 
            indices={shapeCatIndices} 
            position={[-4, 3, -8]} 
            rotation={[0, 0.5, -0.2]} 
            scale={0.5}
            pulseSpeed={1.5}
            pulseOffset={1}
            interactive={true}
            glowing={catGlowing}
            onClick={handleCatClick}
          />
          <Constellation 
            points={shapeDipperPoints} 
            indices={shapeDipperIndices} 
            position={[4, 3, -6]} 
            rotation={[0, -0.4, 0.3]} 
            scale={0.4}
            pulseSpeed={2.5}
            pulseOffset={2}
          />
          <Constellation 
            points={shapeKitePoints} 
            indices={shapeKiteIndices} 
            position={[4, -3, -7]} 
            rotation={[0.1, 0.2, -0.1]} 
            scale={0.6}
            pulseSpeed={1.8}
            pulseOffset={3}
            interactive={true}
            glowing={projectionGlowing}
            onClick={handleProjectionTransition}
          />
        </group>
        <ShootingStar />
        <WishFadingOverlay />
        <WishStar />

        <EffectComposer multisampling={0}>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} intensity={1.5} mipmapBlur />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
        </EffectComposer>
      </Canvas>

      {/* Secret Heart Overlay */}
      <AnimatePresence>
        {showHeartSecret && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900/40 p-4"
            onClick={() => setShowHeartSecret(false)}
          >
             <motion.div
               initial={{ scale: 0.8, rotate: -5 }}
               animate={{ scale: 1, rotate: 0 }}
               className="bg-[#fcfaf8] p-8 max-w-sm rounded shadow-2xl origin-center border border-purple-200"
               onClick={(e) => e.stopPropagation()}
             >
               <div className="font-handwriting text-3xl text-purple-900 text-center mb-4">
                 You found it!
               </div>
               <p className="text-purple-800 text-base leading-relaxed text-center font-serif mb-6">
                 Even hidden among the stars,<br/>my heart always points to you.
               </p>
               <div className="flex justify-center">
                 <button 
                   onClick={() => setShowHeartSecret(false)}
                   className="px-6 py-2 border border-purple-200 text-purple-600 rounded hover:bg-purple-50 transition-colors font-serif text-sm"
                 >
                   Return to the stars
                 </button>
               </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secret Cat Overlay */}
      <AnimatePresence>
        {showCatSecret && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900/40 p-4"
            onClick={() => { setShowCatSecret(false); setCatGlowing(false); }}
          >
             <motion.div
               initial={{ scale: 0.8, rotate: 5 }}
               animate={{ scale: 1, rotate: 0 }}
               className="bg-[#fff0f5] p-8 max-w-sm rounded shadow-2xl origin-center border border-pink-200"
               onClick={(e) => e.stopPropagation()}
             >
               <div className="font-handwriting text-3xl text-pink-900 text-center mb-4">
                 *purrrrr*
               </div>
               <p className="text-pink-800 text-base leading-relaxed text-center font-serif mb-6">
                 Even the stars curl up to sleep when they look at you. <br/><span className="text-sm opacity-80">(P.S. They're dreaming of you too.)</span>
               </p>
               <div className="flex justify-center">
                 <button 
                   onClick={() => { setShowCatSecret(false); setCatGlowing(false); }}
                   className="px-6 py-2 border border-pink-200 text-pink-600 rounded hover:bg-pink-50 transition-colors font-serif text-sm"
                 >
                   Back to stargazing
                 </button>
               </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
