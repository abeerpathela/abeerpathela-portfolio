import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect } from 'react'

gsap.registerPlugin(ScrollTrigger)

export function useSafetyReset() {
  useLayoutEffect(() => {
    ScrollTrigger.clearScrollMemory()
    window.scrollTo(0, 0)
    history.scrollRestoration = 'manual'

    return () => {
      history.scrollRestoration = 'auto'
    }
  }, [])
}
