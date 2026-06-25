import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { useLoading } from '../../context/LoadingContext'
import { StarField } from './StarField'
import './Universe.css'

export function Universe() {
  const { markReady } = useLoading()

  return (
    <div className="universe-layer" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75, near: 0.1, far: 2000 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#020208')
          markReady('canvas')
        }}
      >
        <color attach="background" args={['#020208']} />
        <Suspense fallback={null}>
          <StarField onReady={() => markReady('scene')} />
        </Suspense>
      </Canvas>
    </div>
  )
}
