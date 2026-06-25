import { Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

type StarFieldProps = {
  onReady: () => void
}

export function StarField({ onReady }: StarFieldProps) {
  const hasSignaled = useRef(false)

  useFrame(() => {
    if (hasSignaled.current) return
    hasSignaled.current = true
    onReady()
  })

  return (
    <Stars
      radius={300}
      depth={150}
      count={12000}
      factor={6}
      saturation={0}
      fade
      speed={0.6}
    />
  )
}
