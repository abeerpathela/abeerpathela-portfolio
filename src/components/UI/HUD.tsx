import './HUD.css'
import { getProgressForWaypoint, WAYPOINTS } from '../../config/journey'
import { useJourney } from '../../context/JourneyContext'
import resumePdf from '../../assets/Abeer_Pathela_Resume.pdf'

type HUDProps = {
  scrollProgress: number
  mode: string
}

export function HUD({ scrollProgress, mode }: HUDProps) {
  const { setScrollProgress } = useJourney()
  
  const navItems = [
    { label: 'Hero', waypointId: 'hero' },
    { label: 'Projects', waypointId: 'autotune-sql' },
    { label: 'Tech', waypointId: 'tech-galaxy' },
    { label: 'Participations', waypointId: 'participations' },
    { label: 'Stats', waypointId: 'achievements' },
  ]

  const handleNavClick = (waypointId: string) => {
    const progress = getProgressForWaypoint(waypointId)
    setScrollProgress(progress)
  }

  const handleDownloadResume = () => {
    const link = document.createElement('a')
    link.href = resumePdf
    link.download = 'Abeer_Pathela_Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const distance = Math.round(scrollProgress * 100)

  return (
    <div className="hud" aria-live="polite">
      <div className="hud__left">
        <div className="hud__panel">
          <p className="hud__label">Scanner Mode</p>
          <p className="hud__mode">{mode}</p>
        </div>
        
        <nav className="hud__nav">
          {navItems.map(item => (
            <button
              key={item.label}
              className="hud__nav-btn"
              onClick={() => handleNavClick(item.waypointId)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="hud__right">
        <button className="hud__download-btn" onClick={handleDownloadResume}>
          Download Resume
        </button>
        
        <div className="hud__panel hud__panel--right">
          <p className="hud__label">Distance Traveled</p>
          <p className="hud__value">{distance}%</p>
          <div className="hud__track">
            <div className="hud__fill" style={{ width: `${distance}%` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
