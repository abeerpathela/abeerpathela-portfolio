import { Html } from '@react-three/drei'
import './Planet.css'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'

type PlanetProps = {
  title: string
  description: string
  color: string
  size: number
  position: [number, number, number]
}

export function Planet({ title, description, color, size, position }: PlanetProps) {
  const meshRef = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.25
    }
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[size, 48, 48]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          roughness={0.65}
          metalness={0.25}
        />
      </mesh>

      <mesh scale={[1.35, 1.35, 1.35]}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.06} />
      </mesh>

      <Html
        center
        distanceFactor={18}
        position={[0, size + 2.5, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div className="planet-label">
          <p className="planet-label__title">{title}</p>
          <p className="planet-label__desc">{description}</p>
        </div>
      </Html>
    </group>
  )
}
