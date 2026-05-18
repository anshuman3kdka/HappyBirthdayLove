import siteContent from '../../content/site.json';
import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';
import type { SceneId } from '../../App';
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
  intensity?: number;
}

function Constellation({ points, indices, position, rotation, scale, pulseSpeed = 2, pulseOffset = 0, interactive = false, onClick, glowing = false, intensity = 1.0 }: ConstellationProps) {
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
      const baseSize = glowing ? 0.4 : 0.12;
      const glowScale = glowing ? 2.5 : 1.0;
      (pointsRef.current.material as THREE.PointsMaterial).size = (baseSize + Math.sin(t) * 0.05 + (hovered ? 0.08 : 0)) * glowScale;
      (pointsRef.current.material as THREE.PointsMaterial).opacity = glowing ? 1.0 : ((0.8 * intensity) + Math.sin(t * 0.5) * 0.2 * intensity + (hovered ? 0.2 : 0));
    }
    if (linesRef.current) {
      (linesRef.current.material as THREE.LineBasicMaterial).opacity = glowing ? 1.0 : ((0.4 * intensity) + Math.sin(t * 0.25) * 0.15 * intensity + (hovered ? 0.3 : 0));
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
          size={0.15}
          color="#ffffff"
          transparent
          opacity={0.8 * intensity}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments ref={linesRef} geometry={geometry}>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.5 * intensity}
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

// Data for Flower
const shapeFlowerPoints = [
  new THREE.Vector3(0, 0, -10),
  new THREE.Vector3(0, 2, -10),
  new THREE.Vector3(1.5, 1.5, -10),
  new THREE.Vector3(2, 0, -10),
  new THREE.Vector3(1.5, -1.5, -10),
  new THREE.Vector3(0, -2, -10),
  new THREE.Vector3(-1.5, -1.5, -10),
  new THREE.Vector3(-2, 0, -10),
  new THREE.Vector3(-1.5, 1.5, -10),
  new THREE.Vector3(0, -3.5, -10),
  new THREE.Vector3(-1, -2.5, -10),
  new THREE.Vector3(1, -2.5, -10),
];
const shapeFlowerIndices = new Uint16Array([
  0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8,
  1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 1,
  5, 9,
  9, 10, 5, 10,
  9, 11, 5, 11
]);

// Data for Stretching Cat
const shapePlayfulCatPoints = [
  new THREE.Vector3(-2, -1, -8),
  new THREE.Vector3(0, 0, -8),
  new THREE.Vector3(0.5, 1.5, -8),
  new THREE.Vector3(1.5, 1.2, -8),
  new THREE.Vector3(2, 2, -8),
  new THREE.Vector3(2.5, 0.5, -8),
  new THREE.Vector3(1.5, -0.5, -8),
  new THREE.Vector3(2.5, -2, -8),
  new THREE.Vector3(4, -1, -8),
  new THREE.Vector3(6, 1, -8),
  new THREE.Vector3(5, -2.5, -8),
];
const shapePlayfulCatIndices = new Uint16Array([
  0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 1,
  1, 7, 7, 8, 8, 10,
  8, 9
]);

// Data for Ambiguous Shape 1 (Creature?)
const shapeAmbiguous1Points = [
  new THREE.Vector3(0, 3, -12),
  new THREE.Vector3(2, 1, -12),
  new THREE.Vector3(3, -1, -12),
  new THREE.Vector3(1, -3, -12),
  new THREE.Vector3(-2, -2, -12),
  new THREE.Vector3(-3, 0, -12),
  new THREE.Vector3(-1, 2, -12),
  new THREE.Vector3(0, 0, -12),
];
const shapeAmbiguous1Indices = new Uint16Array([
  0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 0,
  0, 7, 2, 7, 4, 7, 6, 7
]);

// Data for Ambiguous Shape 2 (Swirl)
const shapeAmbiguous2Points = [
  new THREE.Vector3(3, 3, -10),
  new THREE.Vector3(2, 4, -10),
  new THREE.Vector3(0, 3, -10),
  new THREE.Vector3(-1, 1, -10),
  new THREE.Vector3(0, -1, -10),
  new THREE.Vector3(2, -2, -10),
  new THREE.Vector3(1, -4, -10),
  new THREE.Vector3(-1, -4, -10),
  new THREE.Vector3(-3, -2, -10),
];
const shapeAmbiguous2Indices = new Uint16Array([
  0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8
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
      const DURATION = 2.0;

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

function WishFadingOverlay({ activeScene }: { activeScene: SceneId }) {
  const { isWishing } = useWish();
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const { scene } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      const isProjection = activeScene === 'projection';
      const targetOpacity = isWishing ? 1.0 : (isProjection ? 0.95 : 0.0);
      materialRef.current.opacity += (targetOpacity - materialRef.current.opacity) * (isWishing ? 0.05 : 0.02);

      if (scene.background && (scene.background as THREE.Color).isColor) {
        materialRef.current.color.copy(scene.background as THREE.Color);
      }
    }

    if (meshRef.current) {
      meshRef.current.position.set(0, 0, 0); // Static relative to camera
    }
  });

  return (
    <mesh ref={meshRef} renderOrder={99}>
      <planeGeometry args={[100, 100]} />
      <meshBasicMaterial ref={materialRef} transparent opacity={0} depthTest={false} depthWrite={false} color="#020202" />
    </mesh>
  );
}

function SceneController({ activeScene }: { activeScene: SceneId }) {
  const { camera, scene } = useThree();

  useEffect(() => {
    // Determine target color and desired rotation for the active scene
    let targetColor = '#1c0d2a'; // Deep dusky lavender
    let targetRotationZ = 0;

    if (activeScene === 'journal') {
      targetColor = '#3a1b40'; // Warm lavender / sunset blend
      targetRotationZ = Math.PI / 4;
    } else if (activeScene === 'archive') {
      targetColor = '#4a2531'; // Bougainvillea rich twilight
      targetRotationZ = -Math.PI / 4;
    } else if (activeScene === 'projection') {
      targetColor = '#080512'; // Deep space void
      targetRotationZ = 0;
    }

    const tl = gsap.timeline();

    // Aggressive hyperspace feel on scene change
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

  }, [activeScene, camera, scene]);

  return null;
}

export function SkyBackground({ activeScene, onOpenProjection }: { activeScene: SceneId; onOpenProjection: () => void }) {
  const [showHeartSecret, setShowHeartSecret] = useState(false);
  const [showCatSecret, setShowCatSecret] = useState(false);
  const [catGlowing, setCatGlowing] = useState(false);
  const [projectionGlowing, setProjectionGlowing] = useState(false);

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
       onOpenProjection();
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
        <SceneController activeScene={activeScene} />
        <color attach="background" args={['#1c0d2a']} />
        <fog attach="fog" args={['#1c0d2a', 5, 50]} />

        {/* Ambient very dim lighting */}
        <ambientLight intensity={0.25} />

        {/* Massive 360 Stars map */}
        <Stars
          radius={200}
          depth={150}
          count={10000}
          factor={12}
          saturation={0.8}
          fade
          speed={0.4}
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

          {/* Constellations scaled up for huge 360 universe */}
          <Constellation
            points={shapeHeartPoints}
            indices={shapeHeartIndices}
            position={[0, 0, -50]}
            rotation={[0, 0, 0]}
            scale={6.0}
            pulseSpeed={2}
            pulseOffset={0}
            interactive={true}
            onClick={() => setShowHeartSecret(true)}
          />
          <Constellation
            points={shapeCatPoints}
            indices={shapeCatIndices}
            position={[40, 20, -30]}
            rotation={[0, -0.8, -0.2]}
            scale={5.0}
            pulseSpeed={1.5}
            pulseOffset={1}
            interactive={true}
            glowing={catGlowing}
            onClick={handleCatClick}
          />
          <Constellation
            points={shapeDipperPoints}
            indices={shapeDipperIndices}
            position={[-40, 30, 30]}
            rotation={[0, 2.5, 0.3]}
            scale={7.0}
            pulseSpeed={2.5}
            pulseOffset={2}
          />
          <Constellation
            points={shapeKitePoints}
            indices={shapeKiteIndices}
            position={[20, -30, 40]}
            rotation={[0.1, 3.5, -0.1]}
            scale={6.5}
            pulseSpeed={1.8}
            pulseOffset={3}
            interactive={true}
            glowing={projectionGlowing}
            onClick={handleProjectionTransition}
          />

          {/* New fainter constellations */}
          <Constellation
            points={shapeFlowerPoints}
            indices={shapeFlowerIndices}
            position={[15, 35, -25]}
            rotation={[-0.2, 0.4, 0.1]}
            scale={4.0}
            pulseSpeed={1.5}
            pulseOffset={4}
            intensity={1.0}
          />
          <Constellation
            points={shapePlayfulCatPoints}
            indices={shapePlayfulCatIndices}
            position={[-25, -15, -45]}
            rotation={[0.2, -0.3, -0.1]}
            scale={4.5}
            pulseSpeed={1.7}
            pulseOffset={5}
            intensity={1.1}
          />
          <Constellation
            points={shapeAmbiguous1Points}
            indices={shapeAmbiguous1Indices}
            position={[-35, -25, 10]}
            rotation={[0.4, 1.2, 0.3]}
            scale={5.0}
            pulseSpeed={1.2}
            pulseOffset={1.5}
            intensity={0.9}
          />
          <Constellation
            points={shapeAmbiguous2Points}
            indices={shapeAmbiguous2Indices}
            position={[30, 5, 45]}
            rotation={[-0.5, 2.8, -0.2]}
            scale={6.0}
            pulseSpeed={1.9}
            pulseOffset={2.5}
            intensity={0.95}
          />
        </group>
        <ShootingStar />
        <WishFadingOverlay activeScene={activeScene} />
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
                 {siteContent.secretOverlays.heartTitle}
               </div>
               <p className="text-purple-800 text-base leading-relaxed text-center font-serif mb-6">
                 {siteContent.secretOverlays.heartMessage.split('\n').map((line, index) => (
                   <span key={line}>
                     {index > 0 && <br />}
                     {line}
                   </span>
                 ))}
               </p>
               <div className="flex justify-center">
                 <button
                   onClick={() => setShowHeartSecret(false)}
                   className="px-6 py-2 border border-purple-200 text-purple-600 rounded hover:bg-purple-50 transition-colors font-serif text-sm"
                 >
                   {siteContent.secretOverlays.heartButton}
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
                 {siteContent.secretOverlays.catTitle}
               </div>
               <p className="text-pink-800 text-base leading-relaxed text-center font-serif mb-6">
                 {siteContent.secretOverlays.catMessage} <br/><span className="text-sm opacity-80">{siteContent.secretOverlays.catPostscript}</span>
               </p>
               <div className="flex justify-center">
                 <button
                   onClick={() => { setShowCatSecret(false); setCatGlowing(false); }}
                   className="px-6 py-2 border border-pink-200 text-pink-600 rounded hover:bg-pink-50 transition-colors font-serif text-sm"
                 >
                   {siteContent.secretOverlays.catButton}
                 </button>
               </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
