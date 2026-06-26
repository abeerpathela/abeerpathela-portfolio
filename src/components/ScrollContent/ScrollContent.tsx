import { useCallback, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useJourney } from '../../context/JourneyContext'
import { resolveHudMode } from '../../config/journey'
import './ScrollContent.css'

gsap.registerPlugin(ScrollTrigger)

const SECTIONS = [
  { id: 'hero', label: 'Origin', hint: 'Begin your journey' },
  { id: 'projects-1', label: 'AutoTune-SQL', hint: 'AI database optimizer' },
  { id: 'projects-2', label: 'SimAPI', hint: 'SMS Gateway' },
  { id: 'projects-3', label: 'Genetic Guardrail', hint: 'Drug safety system' },
  { id: 'projects-4', label: 'NullPrompt', hint: 'Zero-trust privacy' },
  { id: 'projects-5', label: 'Razorpay Clone', hint: 'Pixel-perfect recreation' },
  { id: 'projects-6', label: 'Jal Sahayak AI', hint: 'Water complaint AI' },
  { id: 'projects-7', label: 'CodeFixo', hint: 'AI code review' },
  { id: 'projects-8', label: 'AiTextra', hint: 'Offline AI SMS' },
  { id: 'projects-9', label: 'BrainBuster', hint: 'Dynamic quiz platform' },
  { id: 'tech', label: 'Tech Nebulae', hint: 'Constellation of skills' },
  { id: 'achievements', label: 'Supernova', hint: 'Achievements ahead' },
  { id: 'contact', label: 'Golden Record', hint: 'Resume & Contact' },
]

export function ScrollContent() {
  const {
    scrollContainerRef,
    setScrollProgress,
    setHudMode,
    setAchievementsActive,
  } = useJourney()

  const callbacksRef = useRef({
    setScrollProgress,
    setHudMode,
    setAchievementsActive,
  })
  callbacksRef.current = { setScrollProgress, setHudMode, setAchievementsActive }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const trigger = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.5,
      onUpdate: (self) => {
        const progress = self.progress
        callbacksRef.current.setScrollProgress(progress)
        callbacksRef.current.setHudMode(resolveHudMode(progress * 100))
        callbacksRef.current.setAchievementsActive(
          progress >= 0.78 && progress <= 0.9
        )
      },
    })

    ScrollTrigger.refresh()

    return () => {
      trigger.kill()
    }
  }, [scrollContainerRef])

  return (
    <main ref={scrollContainerRef} className="scroll-layer" id="journey-scroll">
      {SECTIONS.map((section) => (
        <section key={section.id} className="scroll-section" id={section.id}>
          <div className="scroll-section__marker">
            <span className="scroll-section__tag">{section.label}</span>
            <span className="scroll-section__hint">{section.hint}</span>
          </div>
        </section>
      ))}
    </main>
  )
}
