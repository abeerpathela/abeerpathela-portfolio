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
      radius={500}
      depth={250}
      count={20000}
      factor={7}
      saturation={0.15}
      fade
      speed={0.4}
    />
  )
}
