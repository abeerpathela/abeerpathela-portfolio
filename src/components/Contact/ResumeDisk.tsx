import { Text, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import type { Group, Mesh } from 'three'
import { STATS } from '../../data/portfolio'
import './ResumeDisk.css'

/**
 * ResumeDisk — "Golden Record" that downloads the resume on click.
 * Inspired by Voyager's golden record, this spinning disk
 * serves as the call-to-action at the journey's end.
 */
export function ResumeDisk() {
  const groupRef = useRef<Group>(null)
  const diskRef = useRef<Mesh>(null)
  const ringRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.4

    if (diskRef.current) {
      diskRef.current.rotation.y = clock.elapsedTime * 0.6
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime * 0.3
    }
  })

  const downloadResume = () => {
    const link = document.createElement('a')
    link.href = STATS.resumePath
    link.download = 'Abeer_Pathela_Resume.pdf'
    link.click()
  }

  return (
    <group ref={groupRef} position={[0, 0, 690]}>
      {/* Golden disk */}
      <mesh
        ref={diskRef}
        onClick={downloadResume}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[6, 6, 0.5, 64]} />
        <meshStandardMaterial
          color={hovered ? '#ffd700' : '#daa520'}
          emissive="#ffaa00"
          emissiveIntensity={hovered ? 1.8 : 0.8}
          metalness={0.95}
          roughness={0.1}
          toneMapped={false}
        />
      </mesh>

      {/* Record grooves (dark ring on top) */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.3, 0]}>
        <ringGeometry args={[2, 5.5, 64]} />
        <meshStandardMaterial
          color="#1a1400"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Center label on disk */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.31, 0]}>
        <ringGeometry args={[0.5, 2, 64]} />
        <meshStandardMaterial
          color="#ffd700"
          emissive="#ffaa00"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Outer orbital ring */}
      <Float speed={0.4} rotationIntensity={0.05} floatIntensity={0}>
        <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[8, 0.06, 16, 64]} />
          <meshStandardMaterial
            color="#ffd700"
            emissive="#ffaa00"
            emissiveIntensity={1}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={0.6}
          />
        </mesh>
      </Float>

      {/* Glow */}
      <pointLight
        intensity={15}
        color="#ffd700"
        distance={35}
        decay={1.5}
      />

      {/* Label text */}
      <Text
        position={[0, -5, 0]}
        fontSize={1}
        color="#ffd700"
        anchorX="center"
        anchorY="middle"
      >
        {hovered ? '[ DOWNLOAD RESUME ]' : 'GOLDEN RECORD'}
        <meshBasicMaterial
          color="#ffd700"
          toneMapped={false}
        />
      </Text>

      <Text
        position={[0, -6.5, 0]}
        fontSize={0.5}
        color="#daa520"
        anchorX="center"
        anchorY="middle"
      >
        Click to download
        <meshBasicMaterial
          color="#daa520"
          transparent
          opacity={0.6}
          toneMapped={false}
        />
      </Text>
    </group>
  )
}
