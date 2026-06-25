import { Html } from '@react-three/drei'
import './ResumeDisk.css'
import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import type { Group } from 'three'

export function ResumeDisk() {
  const groupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = clock.elapsedTime * 0.6
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.3
  })

  const downloadResume = () => {
    const link = document.createElement('a')
    link.href = '/resume.pdf'
    link.download = 'Abeer_Pathela_Resume.pdf'
    link.click()
  }

  return (
    <group ref={groupRef} position={[0, 0, 500]}>
      <mesh
        onClick={downloadResume}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[5, 5, 0.6, 64]} />
        <meshStandardMaterial
          color={hovered ? '#c4d4ff' : '#8eb4ff'}
          emissive="#6b8cff"
          emissiveIntensity={hovered ? 1.2 : 0.6}
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.35, 0]}>
        <ringGeometry args={[2.5, 4.5, 64]} />
        <meshBasicMaterial color="#020208" />
      </mesh>

      <Html center position={[0, 0, 0.35]} distanceFactor={14}>
        <button
          type="button"
          className="resume-disk-label"
          onClick={downloadResume}
          onPointerDown={(event) => event.stopPropagation()}
        >
          {hovered ? '↓ DOWNLOAD' : 'RESUME'}
        </button>
      </Html>
    </group>
  )
}
