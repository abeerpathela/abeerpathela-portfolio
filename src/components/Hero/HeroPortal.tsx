import { useEffect, useRef } from 'react'
import { useJourney } from '../../context/JourneyContext'
import resumePdf from '../../assets/Abeer_Pathela_Resume.pdf'
import './HeroPortal.css'

export function HeroPortal() {
  const { scrollProgress, setScrollProgress } = useJourney()
  const containerRef = useRef<HTMLDivElement>(null)

  // Hero section is roughly 0-15% of scroll progress
  const heroOpacity = Math.max(0, Math.min(1, (0.15 - scrollProgress) / 0.08))

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.style.opacity = `${heroOpacity}`
    container.style.pointerEvents = heroOpacity > 0.1 ? 'auto' : 'none'
  }, [heroOpacity])

  const handleExplore = () => {
    setScrollProgress(0.15)
  }

  const handleDownloadResume = () => {
    const link = document.createElement('a')
    link.href = resumePdf
    link.download = 'Abeer_Pathela_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div ref={containerRef} className="hero-portal">
      <div className="hero-portal__content">
        <div className="hero-portal__text">
          <h1 className="hero-portal__title">
            Hi, I&apos;m <span className="hero-portal__name">Abeer Pathela</span>
          </h1>
          <p className="hero-portal__subtitle">Full Stack Developer</p>
          <p className="hero-portal__bio">
            I build scalable web & mobile applications. AI-powered solutions and delightful user experiences.
          </p>
          <div className="hero-portal__ctas">
            <button className="hero-portal__btn hero-portal__btn--primary" onClick={handleExplore}>
              Explore Portfolio
            </button>
            <button className="hero-portal__btn hero-portal__btn--secondary" onClick={handleDownloadResume}>
              Download Resume
            </button>
          </div>
        </div>
        <div className="hero-portal__glow" />
      </div>
    </div>
  )
}
