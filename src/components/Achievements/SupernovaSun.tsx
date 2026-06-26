import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import type { Mesh, Group } from 'three'
import { STATS } from '../../data/portfolio'
import { useJourney } from '../../context/JourneyContext'

/**
 * SupernovaSun — massive glowing sun at the achievements section.
 * Displays CGPA and LeetCode stats in massive bold text that
 * becomes visible as the camera approaches.
 */
export function SupernovaSun() {
  const coreRef = useRef<Mesh>(null)
  const coronaRef = useRef<Mesh>(null)
  const outerGlowRef = useRef<Mesh>(null)
  const statsGroupRef = useRef<Group>(null)
  const { journeyRef } = useJourney()

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
    if (outerGlowRef.current) {
      const glowPulse = 1 + Math.sin(t * 1.5) * 0.06
      outerGlowRef.current.scale.setScalar(glowPulse)
    }

    // Make stats face the camera
    if (statsGroupRef.current) {
      const cam = journeyRef.current.camera
      const dz = cam.z - 650
      const proximity = THREE.MathUtils.clamp(1 - Math.abs(dz) / 80, 0, 1)

      // Scale stats based on proximity
      const scale = THREE.MathUtils.lerp(0.5, 1, proximity)
      statsGroupRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group position={[0, 0, 650]}>
      {/* Multi-layered lighting for volumetric feel */}
      <pointLight intensity={120} color="#ffaa44" distance={150} decay={1.2} />
      <pointLight intensity={60} color="#ff6622" distance={100} decay={1.5} position={[0, 5, 5]} />
      <pointLight intensity={40} color="#ffcc00" distance={80} decay={2} position={[0, -5, -5]} />

      {/* Core sun */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[14, 64, 64]} />
        <meshStandardMaterial
          color="#ffcc66"
          emissive="#ff8800"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* Corona layer 1 */}
      <mesh ref={coronaRef} scale={[1.4, 1.4, 1.4]}>
        <sphereGeometry args={[14, 32, 32]} />
        <meshBasicMaterial
          color="#ff4400"
          transparent
          opacity={0.1}
          toneMapped={false}
        />
      </mesh>

      {/* Corona layer 2 — outer glow */}
      <mesh ref={outerGlowRef} scale={[1.8, 1.8, 1.8]}>
        <sphereGeometry args={[14, 24, 24]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.04}
          toneMapped={false}
        />
      </mesh>

      {/* Stats text group — placed in front of the sun */}
      <group ref={statsGroupRef}>
        {/* CGPA */}
        <Text
          position={[-22, 8, 25]}
          fontSize={5}
          color="#ffcc66"
          anchorX="center"
          anchorY="middle"
        >
          {STATS.cgpa.toFixed(2)}
          <meshBasicMaterial
            color="#ffcc66"
            toneMapped={false}
          />
        </Text>
        <Text
          position={[-22, 4, 25]}
          fontSize={1.2}
          color="#ffaa44"
          anchorX="center"
          anchorY="middle"
        >
          CGPA
          <meshBasicMaterial
            color="#ffaa44"
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </Text>

        {/* LeetCode */}
        <Text
          position={[22, 8, 25]}
          fontSize={5}
          color="#ffcc66"
          anchorX="center"
          anchorY="middle"
        >
          {STATS.leetcode}+
          <meshBasicMaterial
            color="#ffcc66"
            toneMapped={false}
          />
        </Text>
        <Text
          position={[22, 4, 25]}
          fontSize={1.2}
          color="#ffaa44"
          anchorX="center"
          anchorY="middle"
        >
          LEETCODE
          <meshBasicMaterial
            color="#ffaa44"
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </Text>
      </group>
    </group>
  )
}
