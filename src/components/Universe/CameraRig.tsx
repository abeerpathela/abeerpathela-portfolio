import { PerspectiveCamera } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import type { PerspectiveCamera as PerspectiveCameraImpl } from 'three'
import { Vector3 } from 'three'
import { useJourney } from '../../context/JourneyContext'
import { useResponsiveFov } from '../../hooks/useResponsiveFov'

export function CameraRig() {
  const cameraRef = useRef<PerspectiveCameraImpl>(null)
  const { journeyRef } = useJourney()
  const fov = useResponsiveFov()
  const lookAtTarget = useMemo(() => new Vector3(), [])
  const { size } = useThree()

  useEffect(() => {
    const camera = cameraRef.current
    if (!camera) return
    camera.aspect = size.width / size.height
    camera.fov = fov
    camera.updateProjectionMatrix()
  }, [size.width, size.height, fov])

  useFrame(() => {
    const camera = cameraRef.current
    if (!camera) return

    const { camera: cam, lookAt } = journeyRef.current
    camera.position.set(cam.x, cam.y, cam.z)
    lookAtTarget.set(lookAt.x, lookAt.y, lookAt.z)
    camera.lookAt(lookAtTarget)
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      near={0.1}
      far={2000}
      fov={fov}
      position={[0, 3, -8]}
    />
  )
}
