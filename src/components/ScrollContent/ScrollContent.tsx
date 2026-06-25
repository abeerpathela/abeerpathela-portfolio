import { useCallback } from 'react'
import { useJourney } from '../../context/JourneyContext'
import { useMasterTimeline } from '../../hooks/useMasterTimeline'
import './ScrollContent.css'

const SECTIONS = [
  { id: 'hero', label: 'Hero', hint: 'Orbital Nexus ahead' },
  { id: 'projects', label: 'Projects', hint: 'Four worlds in orbit' },
  { id: 'tech', label: 'Tech Stack', hint: 'Constellation of skills' },
  { id: 'achievements', label: 'Achievements', hint: 'Approaching supernova' },
  { id: 'contact', label: 'Contact', hint: 'Resume disk detected' },
]

export function ScrollContent() {
  const {
    scrollContainerRef,
    journeyRef,
    setScrollProgress,
    setHudMode,
    setAchievementsActive,
  } = useJourney()

  useMasterTimeline({
    scrollRef: scrollContainerRef,
    journeyRef,
    onProgress: useCallback((p: number) => setScrollProgress(p), [setScrollProgress]),
    onHudMode: useCallback((mode) => setHudMode(mode), [setHudMode]),
    onAchievementsActive: useCallback(
      (active) => setAchievementsActive(active),
      [setAchievementsActive],
    ),
  })

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
