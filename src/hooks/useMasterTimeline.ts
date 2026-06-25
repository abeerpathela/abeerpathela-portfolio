import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect, useRef, type RefObject } from 'react'
import { resolveHudMode, type JourneyRefs } from '../config/journey'

gsap.registerPlugin(ScrollTrigger)

type MasterTimelineCallbacks = {
  onProgress: (progress: number) => void
  onHudMode: (mode: ReturnType<typeof resolveHudMode>) => void
  onAchievementsActive: (active: boolean) => void
}

type MasterTimelineOptions = {
  scrollRef: RefObject<HTMLElement | null>
  journeyRef: RefObject<JourneyRefs>
} & MasterTimelineCallbacks

export function useMasterTimeline({
  scrollRef,
  journeyRef,
  onProgress,
  onHudMode,
  onAchievementsActive,
}: MasterTimelineOptions) {
  const callbacksRef = useRef<MasterTimelineCallbacks>({
    onProgress,
    onHudMode,
    onAchievementsActive,
  })
  callbacksRef.current = { onProgress, onHudMode, onAchievementsActive }

  useLayoutEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const journey = journeyRef.current
    Object.assign(journey.camera, { x: 0, y: 3, z: -8 })
    Object.assign(journey.lookAt, { x: 0, y: 0, z: 25 })

    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = self.progress
          callbacksRef.current.onProgress(progress)
          callbacksRef.current.onHudMode(resolveHudMode(progress * 100))
          callbacksRef.current.onAchievementsActive(progress >= 0.71 && progress <= 0.88)
        },
      },
    })

    timeline.to(journey.camera, { z: 45, y: 2, x: 0, duration: 2 }, 0)
    timeline.to(journey.lookAt, { z: 55, y: 0, x: 0, duration: 2 }, 0)

    timeline.to(journey.camera, { z: 105, y: 1.5, duration: 1.2 }, 2)
    timeline.to(journey.lookAt, { z: 150, duration: 1.2 }, 2)
    timeline.to(journey.camera, { z: 200, y: 1, duration: 2 }, 3.2)
    timeline.to(journey.lookAt, { z: 205, duration: 2 }, 3.2)

    timeline.to(journey.camera, { z: 260, y: 2, duration: 1.2 }, 5.2)
    timeline.to(journey.lookAt, { z: 300, duration: 1.2 }, 5.2)
    timeline.to(journey.camera, { z: 350, y: 1, duration: 2 }, 6.4)
    timeline.to(journey.lookAt, { z: 355, duration: 2 }, 6.4)

    timeline.to(journey.camera, { z: 410, y: 0.5, duration: 1.5 }, 8.4)
    timeline.to(journey.lookAt, { z: 425, y: 0, duration: 1.5 }, 8.4)
    timeline.to(journey.camera, { z: 450, duration: 1 }, 9.9)
    timeline.to(journey.lookAt, { z: 430, duration: 1 }, 9.9)

    timeline.to(journey.camera, { z: 488, y: 1, duration: 1.5 }, 10.9)
    timeline.to(journey.lookAt, { z: 500, y: 0, duration: 1.5 }, 10.9)

    ScrollTrigger.refresh()

    return () => {
      timeline.scrollTrigger?.kill()
      timeline.kill()
    }
  }, [scrollRef, journeyRef])
}
