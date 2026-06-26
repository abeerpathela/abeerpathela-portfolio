import { Text, Float, Billboard } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import type { Mesh, Group, PointLight } from 'three'
import { NEBULA_REGIONS } from '../../data/portfolio'
import { useJourney } from '../../context/JourneyContext'

export function TechNebula() {
  return (
    <group>
      {NEBULA_REGIONS.map((region) => (
        <NebulaRegion key={region.id} region={region} />
      ))}
    </group>
  )
}

type NebulaRegionData = {
  id: string
  label: string
  color: string
  emissive: string
  position: [number, number, number]
  techs: string[]
}

function NebulaRegion({ region }: { region: NebulaRegionData }) {
  const coreRef = useRef<Mesh>(null)
  const lightRef = useRef<PointLight>(null)
  const groupRef = useRef<Group>(null)
  const { journeyRef } = useJourney()

  const orbits = useMemo(() => {
    return region.techs.map((_, i) => {
      const angle = (i / region.techs.length) * Math.PI * 2
      const radius = 5 + (i % 3) * 2
      const yOffset = (Math.random() - 0.5) * 3
      const speed = 0.1 + Math.random() * 0.2
      return { angle, radius, yOffset, speed }
    })
  }, [region.techs.length])

  useFrame(({ clock }) => {
    if (!coreRef.current) return

    const cam = journeyRef.current.camera
    const dz = cam.z - region.position[2]
    const distance = Math.abs(dz)
    const proximity = THREE.MathUtils.clamp(1 - distance / 60, 0, 1)

    const basePulse = 1 + Math.sin(clock.elapsedTime * 2) * 0.08
    const scale = basePulse * (1 + proximity * 0.5)
    coreRef.current.scale.setScalar(scale)

    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(4, 25, proximity)
    }
  })

  return (
    <group ref={groupRef} position={region.position}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[2.5, 2]} />
        <meshStandardMaterial
          color={region.color}
          emissive={region.emissive}
          emissiveIntensity={1.5}
          metalness={0.7}
          roughness={0.2}
          wireframe
          toneMapped={false}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[3.5, 32, 32]} />
        <meshBasicMaterial
          color={region.emissive}
          transparent
          opacity={0.06}
        />
      </mesh>

      <Billboard>
        <Text
          position={[0, 5, 0]}
          fontSize={1.2}
          color={region.color}
          anchorX="center"
          anchorY="middle"
        >
          {region.label}
          <meshBasicMaterial
            color={region.color}
            transparent
            opacity={0.9}
            toneMapped={false}
          />
        </Text>
      </Billboard>

      <pointLight
        ref={lightRef}
        intensity={4}
        color={region.emissive}
        distance={40}
        decay={1.5}
      />

      {region.techs.map((tech, i) => (
        <OrbitingTechLabel
          key={tech}
          label={tech}
          color={region.color}
          emissive={region.emissive}
          orbit={orbits[i]}
          regionPosition={region.position}
        />
      ))}
    </group>
  )
}

type OrbitData = {
  angle: number
  radius: number
  yOffset: number
  speed: number
}

function OrbitingTechLabel({
  label,
  color,
  emissive,
  orbit,
  regionPosition,
}: {
  label: string
  color: string
  emissive: string
  orbit: OrbitData
  regionPosition: [number, number, number]
}) {
  const groupRef = useRef<Group>(null)
  const meshRef = useRef<Mesh>(null)
  const { journeyRef } = useJourney()

  useFrame(({ camera, clock }) => {
    if (!groupRef.current || !meshRef.current) return

    const t = clock.elapsedTime * orbit.speed + orbit.angle
    groupRef.current.position.x = Math.cos(t) * orbit.radius
    groupRef.current.position.z = Math.sin(t) * orbit.radius
    groupRef.current.position.y = orbit.yOffset + Math.sin(t * 1.5) * 0.5

    groupRef.current.quaternion.copy(camera.quaternion)

    const cam = journeyRef.current.camera
    const dz = cam.z - regionPosition[2]
    const distance = Math.abs(dz)
    const proximity = THREE.MathUtils.clamp(1 - distance / 50, 0, 1)
    const material = meshRef.current.material as THREE.MeshStandardMaterial
    if (material.emissiveIntensity !== undefined) {
      material.emissiveIntensity = THREE.MathUtils.lerp(0.2, 1.5, proximity)
    }
  })

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group ref={groupRef}>
        <mesh ref={meshRef}>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={0.3}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>

        <Billboard>
          <Text
            position={[0, 0.9, 0]}
            fontSize={0.4}
            color={color}
            anchorX="center"
            anchorY="middle"
          >
            {label}
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.85}
              toneMapped={false}
            />
          </Text>
        </Billboard>
      </group>
    </Float>
  )
}
