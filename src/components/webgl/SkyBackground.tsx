import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

function Constellation() {
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Example: a rough heart/arch shape using 10 points
  const points = useMemo(() => [
    new THREE.Vector3(-2, 1, -5),
    new THREE.Vector3(-1, 2, -5),
    new THREE.Vector3(0, 1.5, -5),
    new THREE.Vector3(1, 2, -5),
    new THREE.Vector3(2, 1, -5),
    new THREE.Vector3(1.5, -0.5, -5),
    new THREE.Vector3(0, -2, -5),
    new THREE.Vector3(-1.5, -0.5, -5),
    // inner points for connection
    new THREE.Vector3(-0.5, 0.5, -5),
    new THREE.Vector3(0.5, 0.5, -5),
  ], []);

  // Indices to connect the stars with lines
  const indices = useMemo(() => new Uint16Array([
    0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 0,
    7, 8, 8, 2, 5, 9, 9, 2
  ]), []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    geo.setIndex(new THREE.BufferAttribute(indices, 1));
    return geo;
  }, [points, indices]);

  useFrame((state) => {
    if (pointsRef.current) {
      // Gentle pulsing effect
      (pointsRef.current.material as THREE.PointsMaterial).size = 0.05 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
      (pointsRef.current.material as THREE.PointsMaterial).opacity = 0.6 + Math.sin(state.clock.elapsedTime) * 0.4;
    }
    if (linesRef.current) {
      (linesRef.current.material as THREE.LineBasicMaterial).opacity = 0.15 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={[2, 1, -2]} rotation={[0, -0.2, 0.1]} scale={0.8}>
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

export function SkyBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#020202]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={window.devicePixelRatio}
      >
        <color attach="background" args={['#020202']} />
        
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
        <Constellation />
        <ShootingStar />

      </Canvas>
    </div>
  );
}
