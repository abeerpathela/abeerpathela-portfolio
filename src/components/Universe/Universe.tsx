import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { useLoading } from '../../context/LoadingContext'
import { SceneContent } from './SceneContent'
import './Universe.css'

export function Universe() {
  const { markReady } = useLoading()

  return (
    <div className="universe-layer">
      <Canvas
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
        raycaster={{ params: { Points: { threshold: 0.1 } } }}
        onCreated={({ gl }) => {
          gl.setClearColor('#020208')
          markReady('canvas')
        }}
        style={{ pointerEvents: 'auto' }}
      >
        <color attach="background" args={['#020208']} />
        <Suspense fallback={null}>
          <SceneContent onReady={() => markReady('scene')} />
        </Suspense>
      </Canvas>
    </div>
  )
}
