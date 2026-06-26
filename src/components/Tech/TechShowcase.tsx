import { useEffect, useState, useRef } from 'react'
import { useJourney } from '../../context/JourneyContext'
import './TechShowcase.css'

const TECH_CATEGORIES = [
  {
    label: 'Frontend',
    techs: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'HTML5', 'CSS3'],
    color: '#6b8cff',
  },
  {
    label: 'Backend',
    techs: ['Node.js', 'Express.js', 'Python', 'MongoDB', 'PostgreSQL', 'Firebase'],
    color: '#a0c4ff',
  },
  {
    label: 'Tools & Services',
    techs: ['Git', 'Docker', 'AWS', 'Vercel', 'GitHub', 'VS Code'],
    color: '#7da3ff',
  },
  {
    label: 'AI/ML',
    techs: ['OpenAI', 'TensorFlow', 'LLMs', 'LangChain', 'Hugging Face', 'RAG'],
    color: '#c4d4ff',
  },
]

export function TechShowcase() {
  const { scrollProgress } = useJourney()
  const [currentCategory, setCurrentCategory] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Tech section is roughly 60-75% of scroll progress
  const isTechVisible = scrollProgress >= 0.55 && scrollProgress <= 0.8
  const techOpacity = Math.max(0, Math.min(1, (scrollProgress - 0.55) / 0.08))

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.style.opacity = `${techOpacity}`
    container.style.pointerEvents = techOpacity > 0.1 ? 'auto' : 'none'
  }, [techOpacity])

  if (!isTechVisible) return null

  const category = TECH_CATEGORIES[currentCategory]

  return (
    <div ref={containerRef} className="tech-showcase">
      <div className="tech-showcase__content">
        <div className="tech-showcase__header">
          <h2 className="tech-showcase__title">Tech Galaxy</h2>
          <p className="tech-showcase__subtitle">Constellation of Skills</p>
        </div>

        {/* Category selector */}
        <div className="tech-showcase__categories">
          {TECH_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.label}
              className={`tech-showcase__category-btn ${idx === currentCategory ? 'tech-showcase__category-btn--active' : ''}`}
              onClick={() => setCurrentCategory(idx)}
              style={{
                borderColor: cat.color,
                color: idx === currentCategory ? '#fff' : cat.color,
                backgroundColor: idx === currentCategory ? cat.color : 'transparent',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Tech grid */}
        <div className="tech-showcase__grid">
          {category.techs.map((tech) => (
            <div
              key={tech}
              className="tech-showcase__tech-item"
              style={{ borderColor: category.color }}
            >
              <div className="tech-showcase__tech-icon" style={{ color: category.color }}>
                ⚡
              </div>
              <span className="tech-showcase__tech-label">{tech}</span>
            </div>
          ))}
        </div>

        {/* Bottom accent */}
        <div className="tech-showcase__accent" style={{ background: category.color }} />
      </div>
    </div>
  )
}
