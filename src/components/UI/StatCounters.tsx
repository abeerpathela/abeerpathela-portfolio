import gsap from 'gsap'
import { useEffect, useRef, useState } from 'react'
import { STATS } from '../../data/portfolio'
import './StatCounters.css'

type StatCountersProps = {
  active: boolean
}

export function StatCounters({ active }: StatCountersProps) {
  const [visible, setVisible] = useState(false)
  const [cgpa, setCgpa] = useState('0.00')
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
        setCgpa(STATS.cgpa.toFixed(2))
        setLeetcode(STATS.leetcode)
      },
    })

    tl.to(cgpaProxy, {
      value: STATS.cgpa,
      duration: 2.5,
      ease: 'power2.out',
      onUpdate: () => setCgpa(cgpaProxy.value.toFixed(2)),
    })

    tl.to(
      lcProxy,
      {
        value: STATS.leetcode,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => setLeetcode(Math.round(lcProxy.value)),
      },
      0.3,
    )

    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'back.out(1.4)' },
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
