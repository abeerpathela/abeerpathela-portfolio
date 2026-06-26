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
  const { journeyRef, scrollProgress, isDocking, setIsDocking, currentDockingZone, setCurrentDockingZone } = useJourney()
  const fov = useResponsiveFov()
  const { size } = useThree()

  const smoothProgress = useRef(0)
  const smoothPosition = useMemo(() => new THREE.Vector3(), [])
  const smoothLookAt = useMemo(() => new THREE.Vector3(), [])
  const currentLookAt = useMemo(() => new THREE.Vector3(), [])
  const dockingStartProgress = useRef(0)
  const lastDockingZoneRef = useRef<string | null>(null)
  const lastDockingStateRef = useRef(false)

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

    // Detect docking zones (±5% around project waypoints)
    const t = THREE.MathUtils.clamp(smoothProgress.current, 0, 1)
    const waypointIndex = Math.floor(t * (WAYPOINTS.length - 1))
    const waypointProgress = t * (WAYPOINTS.length - 1)
    const localT = waypointProgress - waypointIndex
    
    // Check if we're within docking zone (5% = 0.05)
    const DOCKING_ZONE_WIDTH = 0.05
    const isInDockingZone = localT >= (0.5 - DOCKING_ZONE_WIDTH) && localT <= (0.5 + DOCKING_ZONE_WIDTH)
    const currentWaypoint = WAYPOINTS[waypointIndex]
    const nextWaypoint = WAYPOINTS[Math.min(waypointIndex + 1, WAYPOINTS.length - 1)]
    
    if (isInDockingZone && currentWaypoint.section !== 'hero') {
      // We're in a docking zone
      if (!lastDockingStateRef.current || lastDockingZoneRef.current !== currentWaypoint.id) {
        setIsDocking(true)
        setCurrentDockingZone(currentWaypoint.id)
        lastDockingStateRef.current = true
        lastDockingZoneRef.current = currentWaypoint.id
        dockingStartProgress.current = smoothProgress.current
      }
    } else {
      // Not in a docking zone
      if (lastDockingStateRef.current) {
        setIsDocking(false)
        setCurrentDockingZone(null)
        lastDockingStateRef.current = false
        lastDockingZoneRef.current = null
      }
    }

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
