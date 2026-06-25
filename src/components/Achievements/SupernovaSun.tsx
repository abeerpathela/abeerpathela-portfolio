import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'

export function SupernovaSun() {
  const coreRef = useRef<Mesh>(null)
  const coronaRef = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.08
      const pulse = 1 + Math.sin(t * 2) * 0.04
      coreRef.current.scale.setScalar(pulse)
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.z = t * 0.05
      coronaRef.current.rotation.x = Math.sin(t * 0.3) * 0.1
    }
  })

  return (
    <group position={[0, 0, 425]}>
      <pointLight intensity={80} color="#ffaa44" distance={120} decay={1.2} />
      <pointLight intensity={40} color="#ff6622" distance={80} decay={1.5} position={[0, 0, 5]} />

      <mesh ref={coreRef}>
        <sphereGeometry args={[14, 64, 64]} />
        <meshStandardMaterial
          color="#ffcc66"
          emissive="#ff8800"
          emissiveIntensity={2.5}
          toneMapped={false}
        />
      </mesh>

      <mesh ref={coronaRef} scale={[1.6, 1.6, 1.6]}>
        <sphereGeometry args={[14, 32, 32]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.12} toneMapped={false} />
      </mesh>
    </group>
  )
}
