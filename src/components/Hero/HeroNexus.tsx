import { Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { useMouseParallaxRef } from '../../hooks/useMouseParallax'

/**
 * "The Orbital Nexus" — Hero landing experience
 * Premium central nexus that introduces the portfolio
 */
export function HeroNexus() {
  const groupRef = useRef<Group>(null)
  const mouse = useMouseParallaxRef()

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return

    const targetRotY = mouse.current.x * 0.15
    const targetRotX = mouse.current.y * 0.08
    const targetX = mouse.current.x * 0.4
    const targetY = mouse.current.y * 0.25

    group.rotation.y += (targetRotY - group.rotation.y) * delta * 2.5
    group.rotation.x += (targetRotX - group.rotation.x) * delta * 2.5
    group.position.x += (targetX - group.position.x) * delta * 2.5
    group.position.y += (targetY - group.position.y) * delta * 2.5
  })

  return (
    <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.3}>
      <group ref={groupRef} position={[15, 5, 25]}>
        {/* Central core sphere */}
        <mesh castShadow>
          <icosahedronGeometry args={[3.5, 2]} />
          <meshStandardMaterial
            color="#6b8cff"
            emissive="#5d7cff"
            emissiveIntensity={0.5}
            metalness={0.7}
            roughness={0.3}
            toneMapped={false}
          />
        </mesh>

        {/* Inner glow sphere */}
        <mesh>
          <sphereGeometry args={[3.8, 32, 32]} />
          <meshBasicMaterial
            color="#6b8cff"
            transparent
            opacity={0.1}
            toneMapped={false}
          />
        </mesh>

        {/* Primary ring - fast rotation */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[6.5, 0.1, 14, 64]} />
          <meshStandardMaterial
            color="#a0c4ff"
            emissive="#6b8cff"
            emissiveIntensity={1}
            metalness={0.85}
            roughness={0.1}
            toneMapped={false}
          />
        </mesh>

        {/* Secondary ring - tilted */}
        <mesh rotation={[Math.PI / 3, 0.5, Math.PI / 6]}>
          <torusGeometry args={[8.5, 0.08, 12, 48]} />
          <meshStandardMaterial
            color="#7da3ff"
            emissive="#5d7cff"
            emissiveIntensity={0.7}
            metalness={0.8}
            roughness={0.15}
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </mesh>

        {/* Tertiary ring - larger, subtle */}
        <mesh rotation={[-Math.PI / 4, 0.2, 0]}>
          <torusGeometry args={[10.5, 0.06, 10, 40]} />
          <meshStandardMaterial
            color="#6b8cff"
            emissive="#4a6fd4"
            emissiveIntensity={0.4}
            transparent
            opacity={0.5}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>

        {/* Enhanced point light */}
        <pointLight position={[0, 0, 0]} intensity={20} color="#6b8cff" distance={40} decay={1.2} />
      </group>
    </Float>
  )
}
