import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { useLoading } from '../../context/LoadingContext'
import './Preloader.css'

export function Preloader() {
  const { isReady, progress } = useLoading()
  const overlayRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    if (!progressRef.current) return
    gsap.to(progressRef.current, {
      scaleX: progress,
      duration: 0.4,
      ease: 'power2.out',
    })
  }, [progress])

  useEffect(() => {
    if (!isReady || !overlayRef.current) return

    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => setMounted(false),
    })
  }, [isReady])

  if (!mounted) return null

  return (
    <div ref={overlayRef} className="preloader" aria-live="polite" aria-busy={!isReady}>
      <div className="preloader__content">
        <p className="preloader__label">Deep Space</p>
        <div className="preloader__track">
          <div ref={progressRef} className="preloader__bar" />
        </div>
        <p className="preloader__status">
          {isReady ? 'Entering orbit…' : 'Calibrating systems…'}
        </p>
      </div>
    </div>
  )
}
