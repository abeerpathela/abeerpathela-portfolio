import { useEffect, useRef } from 'react'

export type MouseParallax = {
  x: number
  y: number
}

export function useMouseParallaxRef() {
  const mouse = useRef<MouseParallax>({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return mouse
}
