import Lenis from 'lenis'
import { useEffect } from 'react'
import 'lenis/dist/lenis.css'

export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
      autoRaf: true,
    })

    return () => {
      lenis.destroy()
    }
  }, [])
}
