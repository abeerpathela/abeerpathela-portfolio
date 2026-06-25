import { Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { useMouseParallaxRef } from '../../hooks/useMouseParallax'

/**
 * "The Orbital Nexus" — procedural hero station.
 * Swap this group for useGLTF('/models/your-hero.glb') when you have a custom asset.
 */
export function HeroNexus() {
  const groupRef = useRef<Group>(null)
  const mouse = useMouseParallaxRef()

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return

    const targetRotY = mouse.current.x * 0.18
    const targetRotX = mouse.current.y * 0.1
    const targetX = mouse.current.x * 0.6
    const targetY = mouse.current.y * 0.35

    group.rotation.y += (targetRotY - group.rotation.y) * delta * 3
    group.rotation.x += (targetRotX - group.rotation.x) * delta * 3
    group.position.x += (targetX - group.position.x) * delta * 3
    group.position.y += (targetY - group.position.y) * delta * 3
  })

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
      <group ref={groupRef} position={[0, 0, 25]}>
        <mesh castShadow receiveShadow>
          <icosahedronGeometry args={[4, 1]} />
          <meshStandardMaterial
            color="#8eb4ff"
            emissive="#3d5a9e"
            emissiveIntensity={0.6}
            metalness={0.85}
            roughness={0.2}
            wireframe
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[7, 0.12, 16, 64]} />
          <meshStandardMaterial
            color="#c4d4ff"
            emissive="#6b8cff"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.15}
          />
        </mesh>

        <mesh rotation={[Math.PI / 3.5, 0.4, 0]}>
          <torusGeometry args={[9.5, 0.08, 12, 64]} />
          <meshStandardMaterial
            color="#6b8cff"
            emissive="#4a6fd4"
            emissiveIntensity={0.5}
            transparent
            opacity={0.7}
          />
        </mesh>

        <pointLight position={[0, 0, 0]} intensity={12} color="#8eb4ff" distance={30} />
      </group>
    </Float>
  )
}
