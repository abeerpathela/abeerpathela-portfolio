import { PerspectiveCamera } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { PerspectiveCamera as PerspectiveCameraImpl } from 'three'
import { useJourney } from '../../context/JourneyContext'
import { useResponsiveFov } from '../../hooks/useResponsiveFov'
import { WAYPOINTS } from '../../config/journey'

export function CameraRig() {
  const cameraRef = useRef<PerspectiveCameraImpl>(null)
  const { journeyRef, scrollProgress } = useJourney()
  const fov = useResponsiveFov()
  const { size } = useThree()

  const smoothProgress = useRef(0)
  const smoothPosition = useMemo(() => new THREE.Vector3(), [])
  const smoothLookAt = useMemo(() => new THREE.Vector3(), [])
  const currentLookAt = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    const camera = cameraRef.current
    if (!camera) return
    camera.aspect = size.width / size.height
    camera.fov = fov
    camera.updateProjectionMatrix()
  }, [size.width, size.height, fov])

  useFrame((_, delta) => {
    const camera = cameraRef.current
    if (!camera) return

    const lerpFactor = 1 - Math.pow(0.001, delta)
    smoothProgress.current = THREE.MathUtils.lerp(
      smoothProgress.current,
      scrollProgress,
      lerpFactor
    )

    const t = THREE.MathUtils.clamp(smoothProgress.current, 0, 1)
    const waypointIndex = Math.floor(t * (WAYPOINTS.length - 1))
    const nextWaypointIndex = Math.min(waypointIndex + 1, WAYPOINTS.length - 1)
    
    const currentWaypoint = WAYPOINTS[waypointIndex]
    const nextWaypoint = WAYPOINTS[nextWaypointIndex]
    
    const localT = (t * (WAYPOINTS.length - 1)) - waypointIndex
    const clampedLocalT = THREE.MathUtils.clamp(localT, 0, 1)

    const targetPos = new THREE.Vector3().lerpVectors(
      new THREE.Vector3(...currentWaypoint.position),
      new THREE.Vector3(...nextWaypoint.position),
      clampedLocalT
    )

    const targetLookAt = new THREE.Vector3().lerpVectors(
      new THREE.Vector3(...currentWaypoint.lookAt),
      new THREE.Vector3(...nextWaypoint.lookAt),
      clampedLocalT
    )

    smoothPosition.lerp(targetPos, lerpFactor)
    smoothLookAt.lerp(targetLookAt, lerpFactor)

    camera.position.copy(smoothPosition)
    currentLookAt.copy(smoothLookAt)
    camera.lookAt(currentLookAt)

    journeyRef.current.camera.x = smoothPosition.x
    journeyRef.current.camera.y = smoothPosition.y
    journeyRef.current.camera.z = smoothPosition.z
    journeyRef.current.lookAt.x = smoothLookAt.x
    journeyRef.current.lookAt.y = smoothLookAt.y
    journeyRef.current.lookAt.z = smoothLookAt.z
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      near={0.1}
      far={2000}
      fov={fov}
      position={[0, 3, 10]}
    />
  )
}
