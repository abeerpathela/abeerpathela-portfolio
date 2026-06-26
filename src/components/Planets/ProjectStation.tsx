import { Float, Html, useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState, Suspense } from 'react'
import * as THREE from 'three'
import type { Mesh, Group } from 'three'
import type { ProjectData } from '../../data/portfolio'
import { useJourney } from '../../context/JourneyContext'
import './ProjectStation.css'

const imageModules = import.meta.glob(
  '/src/assets/ProjectsImages/*.png',
  { eager: true, query: '?url', import: 'default' }
) as Record<string, string>

function resolveImageUrl(filename: string): string {
  const key = `/src/assets/ProjectsImages/${filename}`
  return imageModules[key] || ''
}

type ProjectStationProps = {
  project: ProjectData
  index: number
}

function ProjectImage({ imageUrl, size, isHighlighted }: { imageUrl: string; size: number; isHighlighted: boolean }) {
  const texture = useTexture(imageUrl)

  texture.minFilter = THREE.LinearMipmapLinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.anisotropy = 8
  texture.colorSpace = THREE.SRGBColorSpace

  const aspect = texture.image ? texture.image.width / texture.image.height : 16 / 9
  const planeWidth = size * 2.4
  const planeHeight = planeWidth / aspect

  return (
    <>
      {/* Outer glow layers for maximum prominence */}
      {isHighlighted && (
        <>
          {/* Outer glow - largest */}
          <mesh position={[0, size + 2.5, size * 0.8]}>
            <planeGeometry args={[planeWidth + 0.8, planeHeight + 0.8]} />
            <meshBasicMaterial
              color="#6b8cff"
              transparent
              opacity={0.15}
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
          {/* Mid glow */}
          <mesh position={[0, size + 2.5, size * 0.85]}>
            <planeGeometry args={[planeWidth + 0.5, planeHeight + 0.5]} />
            <meshBasicMaterial
              color="#6b8cff"
              transparent
              opacity={0.25}
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
          {/* Inner glow - closest */}
          <mesh position={[0, size + 2.5, size * 0.87]}>
            <planeGeometry args={[planeWidth + 0.2, planeHeight + 0.2]} />
            <meshBasicMaterial
              color="#7da3ff"
              transparent
              opacity={0.4}
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
        </>
      )}
      {/* Main image */}
      <mesh position={[0, size + 2.5, size * 0.9]}>
        <planeGeometry args={[planeWidth, planeHeight]} />
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={isHighlighted ? 1 : 0.7}
          side={THREE.DoubleSide}
          toneMapped={false}
          emissive={isHighlighted ? '#5d7cff' : '#1a1a2e'}
          emissiveIntensity={isHighlighted ? 0.3 : 0.05}
          metalness={0}
          roughness={isHighlighted ? 0.2 : 0.5}
        />
      </mesh>
    </>
  )
}

export function ProjectStation({ project, index }: ProjectStationProps) {
  const meshRef = useRef<Mesh>(null)
  const groupRef = useRef<Group>(null)
  const ringRef = useRef<Mesh>(null)
  const htmlGroupRef = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const { currentDockingZone, isDocking } = useJourney()

  const isCurrentlyDocking = isDocking && currentDockingZone === project.id
  const imageUrl = resolveImageUrl(project.imagePath)

  useFrame(({ camera, clock }, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.25
    }
    if (groupRef.current) {
      groupRef.current.position.y =
        project.position[1] + Math.sin(clock.elapsedTime * 0.4 + index) * 0.4
    }
    if (htmlGroupRef.current) {
      htmlGroupRef.current.quaternion.copy(camera.quaternion)
    }
  })

  return (
    <group ref={groupRef} position={project.position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[project.size, 48, 48]} />
        <meshStandardMaterial
          color={project.color}
          emissive={project.emissive}
          emissiveIntensity={isCurrentlyDocking ? 0.9 : hovered ? 0.7 : 0.3}
          roughness={0.5}
          metalness={0.3}
          toneMapped={false}
        />
      </mesh>

      <mesh scale={[1.3, 1.3, 1.3]}>
        <sphereGeometry args={[project.size, 24, 24]} />
        <meshBasicMaterial
          color={project.color}
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>

      <Float speed={0.6} rotationIntensity={0.15} floatIntensity={0}>
        <mesh ref={ringRef} rotation={[Math.PI / 2.5, 0.3, 0]}>
          <torusGeometry args={[project.size * 1.9, 0.06, 12, 48]} />
          <meshStandardMaterial
            color={project.color}
            emissive={project.emissive}
            emissiveIntensity={isCurrentlyDocking ? 1.2 : 0.8}
            metalness={0.8}
            roughness={0.1}
            transparent
            opacity={isCurrentlyDocking ? 1 : 0.6}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      </Float>

      <pointLight
        intensity={isCurrentlyDocking ? 15 : 8}
        color={project.color}
        distance={isCurrentlyDocking ? 40 : 25}
        decay={1.2}
        castShadow={false}
      />

      {imageUrl && (
        <Suspense fallback={null}>
          <ProjectImage imageUrl={imageUrl} size={project.size} isHighlighted={isCurrentlyDocking || hovered} />
        </Suspense>
      )}

      <group ref={htmlGroupRef} position={[0, 0, project.size + 5]}>
        <Html
          transform
          occlude
          distanceFactor={16}
          style={{ pointerEvents: 'auto' }}
        >
          <div className={`station-card ${hovered ? 'station-card--active' : ''} ${isCurrentlyDocking ? 'station-card--docking' : ''}`}>
            {isCurrentlyDocking && (
              <div className="station-card__header">
                <h3 className="station-card__title">{project.title}</h3>
                <span className="station-card__badge">Featured</span>
              </div>
            )}
            {!isCurrentlyDocking && (
              <h3 className="station-card__title">{project.title}</h3>
            )}
            <p className="station-card__desc">{project.description}</p>
            <div className="station-card__tech">
              {project.tech.map((t) => (
                <span key={t} className="station-card__tag">{t}</span>
              ))}
            </div>
            <div className="station-card__links">
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="station-card__btn"
              >
                <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                GitHub
              </a>
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="station-card__btn station-card__btn--live"
                >
                  <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                    <path d="M4.715 6.542L3.343 7.914a3 3 0 104.243 4.243l1.828-1.829A3 3 0 008.586 5.5L8 6.086a1.001 1.001 0 00-.154.199 2 2 0 01.861 3.337L6.88 11.45a2 2 0 11-2.83-2.83l.793-.792a4.018 4.018 0 01-.128-1.287z" />
                    <path d="M6.586 4.672A3 3 0 007.414 9.5l.775-.776a2 2 0 01-.896-3.346L9.12 3.55a2 2 0 012.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 00-4.243-4.243L6.586 4.672z" />
                  </svg>
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </Html>
      </group>
    </group>
  )
}
