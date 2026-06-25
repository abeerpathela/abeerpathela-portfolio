import './ScrollContent.css'

const SECTIONS = [
  {
    id: 'hero',
    eyebrow: 'Phase 01',
    title: 'Deep Space Portfolio',
    body: 'A scroll-driven journey through the cosmos. The universe stays fixed behind you while content drifts in the foreground.',
  },
  {
    id: 'mission',
    eyebrow: 'Mission',
    title: 'Built for immersion',
    body: 'Three.js powers the starfield. Lenis keeps scroll buttery smooth. GSAP handles cinematic transitions as phases unfold.',
  },
  {
    id: 'horizon',
    eyebrow: 'Horizon',
    title: 'More worlds ahead',
    body: 'Planets, nebulae, and interactive sections will layer onto this foundation. For now, scroll to feel the depth of space.',
  },
]

export function ScrollContent() {
  return (
    <main className="scroll-layer">
      {SECTIONS.map((section) => (
        <section key={section.id} className="scroll-section" id={section.id}>
          <div className="scroll-section__inner">
            <p className="scroll-section__eyebrow">{section.eyebrow}</p>
            <h1 className="scroll-section__title">{section.title}</h1>
            <p className="scroll-section__body">{section.body}</p>
          </div>
        </section>
      ))}
      <div className="scroll-spacer" aria-hidden="true" />
    </main>
  )
}
