import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useLocation } from 'react-router-dom';

interface ConstellationProps {
  points: THREE.Vector3[];
  indices: Uint16Array;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  pulseSpeed?: number;
  pulseOffset?: number;
}

function Constellation({ points, indices, position, rotation, scale, pulseSpeed = 2, pulseOffset = 0 }: ConstellationProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    return geo;
  }, [points, indices]);

  useFrame((state) => {
    const t = state.clock.elapsedTime * pulseSpeed + pulseOffset;
    if (pointsRef.current) {
      (pointsRef.current.material as THREE.PointsMaterial).size = 0.05 + Math.sin(t) * 0.02;
      (pointsRef.current.material as THREE.PointsMaterial).opacity = 0.6 + Math.sin(t * 0.5) * 0.4;
    }
    if (linesRef.current) {
      (linesRef.current.material as THREE.LineBasicMaterial).opacity = 0.15 + Math.sin(t * 0.25) * 0.1;
    }
    if (pointsRef.current && linesRef.current) {
      // Gentle slow rotation for life
      pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1 + pulseOffset) * 0.05;
      linesRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1 + pulseOffset) * 0.05;
    }
  });

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial 
          size={0.05} 
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
          opacity={0.2}
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

// Data for Cassiopeia (W Shape)
const shapeWPoints = [
  new THREE.Vector3(-3, 1, -8),
  new THREE.Vector3(-1.5, -1, -8),
  new THREE.Vector3(0, 0.5, -8),
  new THREE.Vector3(1.5, -1.5, -8),
  new THREE.Vector3(3, 1.5, -8),
];
const shapeWIndices = new Uint16Array([
  0, 1, 1, 2, 2, 3, 3, 4
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

  const material = useMemo(() => new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0, linewidth: 2 }), []);
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

function SceneController() {
  const { camera, scene } = useThree();
  const location = useLocation();

  useEffect(() => {
    // Determine target background color based on route
    let targetColor = '#020202';
    if (location.pathname === '/journal') {
      targetColor = '#1a052e'; // Deep purple/nebula
    } else if (location.pathname === '/archive') {
      targetColor = '#2a1a05'; // Deep sepia/copper
    }

    // Camera Hyperspace Animation
    const tl = gsap.timeline();

    // 1. Initial pullback and FOV increase to prepare for jump
    tl.to(camera, {
      fov: 140,
      duration: 1,
      ease: 'power2.in',
      onUpdate: () => camera.updateProjectionMatrix()
    }, 0);

    // 2. The aggressive jump forward
    tl.to(camera.position, {
      z: -40,
      duration: 1.5,
      ease: 'power4.inOut'
    }, 0);

    // 3. Change the background color & fog at the peak of the jump
    tl.to(scene.background, {
      r: new THREE.Color(targetColor).r,
      g: new THREE.Color(targetColor).g,
      b: new THREE.Color(targetColor).b,
      duration: 0.5,
      ease: 'none'
    }, 1.0);
    
    if (scene.fog) {
      tl.to(scene.fog.color, {
        r: new THREE.Color(targetColor).r,
        g: new THREE.Color(targetColor).g,
        b: new THREE.Color(targetColor).b,
        duration: 0.5,
        ease: 'none'
      }, 1.0);
    }
    
    // Rotate the entire scene slightly during the jump so the stars and constellations are in new positions
    tl.to(scene.rotation, {
      z: scene.rotation.z + Math.PI / 3, // Rotate 60 degrees
      duration: 1.5,
      ease: 'power2.inOut'
    }, 0);

    // 4. Reset position seamlessly (by warping back while fov is high)
    tl.set(camera.position, {
      z: 50 // Place camera far back so it continues floating in or just reset
    }, 1.5);

    // 5. Settle into the new page's layout
    tl.to(camera.position, {
      z: 5,
      duration: 1.5,
      ease: 'power3.out'
    }, 1.5);

    tl.to(camera, {
      fov: 60,
      duration: 1.5,
      ease: 'power3.out',
      onUpdate: () => camera.updateProjectionMatrix()
    }, 1.5);

  }, [location.pathname, camera, scene]);

  return null;
}

export function SkyBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#020202]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={window.devicePixelRatio}
      >
        <SceneController />
        <color attach="background" args={['#020202']} />
        <fog attach="fog" args={['#020202', 5, 50]} />
        
        {/* Ambient very dim lighting */}
        <ambientLight intensity={0.1} />
        
        {/* Standard Drei Stars map */}
        <Stars 
          radius={50} 
          depth={50} 
          count={3000} 
          factor={4} 
          saturation={0} 
          fade 
          speed={0.5} 
        />

        {/* Custom additions */}
        <Constellation 
          points={shapeHeartPoints} 
          indices={shapeHeartIndices} 
          position={[2, 1, -2]} 
          rotation={[0, -0.2, 0.1]} 
          scale={0.8}
          pulseSpeed={2}
          pulseOffset={0}
        />
        <Constellation 
          points={shapeWPoints} 
          indices={shapeWIndices} 
          position={[-3, 2, -4]} 
          rotation={[0, 0.5, -0.2]} 
          scale={0.5}
          pulseSpeed={1.5}
          pulseOffset={1}
        />
        <Constellation 
          points={shapeDipperPoints} 
          indices={shapeDipperIndices} 
          position={[1, -2, -3]} 
          rotation={[0, -0.4, 0.3]} 
          scale={0.4}
          pulseSpeed={2.5}
          pulseOffset={2}
        />
        <Constellation 
          points={shapeKitePoints} 
          indices={shapeKiteIndices} 
          position={[-2, -1.5, -5]} 
          rotation={[0.1, 0.2, -0.1]} 
          scale={0.6}
          pulseSpeed={1.8}
          pulseOffset={3}
        />
        <ShootingStar />

      </Canvas>
    </div>
  );
}
