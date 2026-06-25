import { useEffect, useState } from 'react'

const MOBILE_BREAKPOINT = 768
const MOBILE_FOV = 75
const DESKTOP_FOV = 50

export function useResponsiveFov() {
  const [fov, setFov] = useState(() =>
    window.innerWidth < MOBILE_BREAKPOINT ? MOBILE_FOV : DESKTOP_FOV,
  )

  useEffect(() => {
    const onResize = () => {
      setFov(window.innerWidth < MOBILE_BREAKPOINT ? MOBILE_FOV : DESKTOP_FOV)
    }

    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return fov
}
