import { useFrame } from '@react-three/fiber'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import type { Points, ShaderMaterial } from 'three'

// Custom shader for circular, soft-edged particles
const vertexShader = `
  attribute float size;
  varying vec3 vColor;
  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
    gl_FragColor = vec4(vColor, alpha * 0.12);
  }
`

/**
 * NebulaFog — procedural particle clouds spread through space
 * to give depth and atmosphere to the journey. These are very dim,
 * large particles that create a sense of volumetric nebula.
 */
export function NebulaFog() {
  const pointsRef = useRef<Points>(null)

  const { positions, colors, sizes } = useMemo(() => {
    const count = 1200
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const siz = new Float32Array(count)

    const nebulaColors = [
      new THREE.Color('#1a2a6b'),
      new THREE.Color('#2a1a4b'),
      new THREE.Color('#0a2a3b'),
      new THREE.Color('#3b1a2a'),
      new THREE.Color('#1a3b2a'),
    ]

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * 80
      pos[i3 + 1] = (Math.random() - 0.5) * 40
      pos[i3 + 2] = Math.random() * 730  // spread along entire journey

      const color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)]
      col[i3] = color.r
      col[i3 + 1] = color.g
      col[i3 + 2] = color.b

      siz[i] = 3 + Math.random() * 8
    }

    return { positions: pos, colors: col, sizes: siz }
  }, [])

  useFrame(({ clock }) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = clock.elapsedTime * 0.002
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors
      />
    </points>
  )
}
