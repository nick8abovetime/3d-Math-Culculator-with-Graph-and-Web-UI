import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import './Viewport3D.css';

interface Viewport3DProps {
  expression?: string;
}

function SurfaceMesh({ expression }: { expression?: string }) {
  const geometry = useMemo(() => {
    if (!expression) return null;

    const size = 20;
    const segments = 50;
    const geom = new THREE.PlaneGeometry(size, size, segments, segments);
    const positions = geom.attributes.position.array as Float32Array;

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      try {
        const scope = { x, y };
        const z = (window as any).math?.evaluate?.(expression, scope) ?? Math.sin(x) * Math.cos(y);
        positions[i + 2] = typeof z === 'number' && isFinite(z) ? z : 0;
      } catch {
        positions[i + 2] = 0;
      }
    }

    geom.computeVertexNormals();
    return geom;
  }, [expression]);

  if (!geometry) {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial color="#16213e" wireframe />
      </mesh>
    );
  }

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} geometry={geometry}>
      <meshStandardMaterial
        color="#e94560"
        side={THREE.DoubleSide}
        transparent
        opacity={0.8}
        wireframe={false}
      />
    </mesh>
  );
}

export function Viewport3D({ expression }: Viewport3DProps) {
  return (
    <div className="viewport3d">
      <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <axesHelper args={[5]} />
        <Grid args={[20, 20]} cellColor="#16213e" sectionColor="#e94560" />
        <SurfaceMesh expression={expression} />
        <OrbitControls enableDamping />
      </Canvas>
      {!expression && (
        <div className="viewport-placeholder">
          Enter an expression to visualize
        </div>
      )}
    </div>
  );
}