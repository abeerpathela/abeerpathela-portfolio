import { Html, Billboard } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import type { Group } from 'three'
import { PARTICIPATIONS } from '../../data/portfolio'

export function ParticipationPlanet() {
  const groupRef = useRef<Group>(null)

  const participations = useMemo(() => PARTICIPATIONS, [])

  return (
    <group ref={groupRef} position={[0, 0, -560]}>
      <mesh>
        <sphereGeometry args={[4, 64, 64]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#7c3aed"
          emissiveIntensity={0.4}
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      <mesh scale={[1.25, 1.25, 1.25]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial
          color="#8b5cf6"
          transparent
          opacity={0.08}
        />
      </mesh>

      <pointLight
        intensity={12}
        color="#8b5cf6"
        distance={35}
        decay={1.4}
      />

      {participations.map((participation, index) => (
        <ParticipationCard
          key={participation.id}
          participation={participation}
          index={index}
        />
      ))}
    </group>
  )
}

type ParticipationCardProps = {
  participation: typeof PARTICIPATIONS[0]
  index: number
}

function ParticipationCard({ participation, index }: ParticipationCardProps) {
  const htmlGroupRef = useRef<Group>(null)

  useFrame(({ camera, clock }) => {
    if (htmlGroupRef.current) {
      htmlGroupRef.current.quaternion.copy(camera.quaternion)
      const angle = (index / PARTICIPATIONS.length) * Math.PI * 2 + clock.elapsedTime * 0.1
      const radius = 8
      const y = Math.sin(angle * 0.5) * 2
      htmlGroupRef.current.position.set(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      )
    }
  })

  return (
    <Billboard>
      <group ref={htmlGroupRef}>
        <Html
          transform
          occlude
          distanceFactor={14}
          style={{ pointerEvents: 'auto' }}
        >
          <div className="participation-card">
          <h3 className="participation-card__title">{participation.title}</h3>
          <p className="participation-card__role">{participation.role}</p>
          <p className="participation-card__desc">{participation.description}</p>
          <div className="participation-card__tags">
            {participation.tags.map(tag => (
              <span key={tag} className="participation-card__tag">{tag}</span>
            ))}
          </div>
          <a
            href={participation.link}
            target="_blank"
            rel="noopener noreferrer"
            className="participation-card__btn"
          >
            View on LinkedIn
          </a>
        </div>
      </Html>
      </group>
    </Billboard>
  )
}
