import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import './StatCounters.css'

type StatCountersProps = {
  active: boolean
}

export function StatCounters({ active }: StatCountersProps) {
  const [visible, setVisible] = useState(false)
  const [cgpa, setCgpa] = useState('0.0')
  const [leetcode, setLeetcode] = useState(0)
  const hasAnimated = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active || hasAnimated.current) return
    hasAnimated.current = true
    setVisible(true)

    const cgpaProxy = { value: 0 }
    const lcProxy = { value: 0 }

    const tl = gsap.timeline({
      onComplete: () => {
        setCgpa('9.5')
        setLeetcode(500)
      },
    })

    tl.to(cgpaProxy, {
      value: 9.5,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => setCgpa(cgpaProxy.value.toFixed(1)),
    })

    tl.to(
      lcProxy,
      {
        value: 500,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate: () => setLeetcode(Math.round(lcProxy.value)),
      },
      0.3,
    )

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      )
    }

    return () => {
      tl.kill()
    }
  }, [active])

  if (!visible) return null

  return (
    <div ref={containerRef} className="stat-counters">
      <div className="stat-counters__item">
        <span className="stat-counters__value">{cgpa}</span>
        <span className="stat-counters__label">CGPA</span>
      </div>
      <div className="stat-counters__divider" />
      <div className="stat-counters__item">
        <span className="stat-counters__value">{leetcode}+</span>
        <span className="stat-counters__label">LeetCode</span>
      </div>
    </div>
  )
}
