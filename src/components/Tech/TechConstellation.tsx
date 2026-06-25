import { Html } from '@react-three/drei'
import './TechConstellation.css'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'
import { TECH_STACK } from '../../data/techStack'

export function TechConstellation() {
  return (
    <group>
      {TECH_STACK.map((node) => (
        <TechOrb key={node.id} label={node.label} color={node.color} position={node.position} />
      ))}
    </group>
  )
}

function TechOrb({
  label,
  color,
  position,
}: {
  label: string
  color: string
  position: [number, number, number]
}) {
  const meshRef = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    meshRef.current.position.y = position[1] + Math.sin(clock.elapsedTime + position[2]) * 0.4
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <octahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.35}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>
      <Html center distanceFactor={22} style={{ pointerEvents: 'none' }}>
        <span className="tech-node-label">{label}</span>
      </Html>
    </group>
  )
}
