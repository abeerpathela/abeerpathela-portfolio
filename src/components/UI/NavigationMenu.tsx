import { useCallback } from 'react'
import { useJourney } from '../../context/JourneyContext'
import './NavigationMenu.css'

const NAV_ITEMS = [
  { id: 'hero', label: 'Origin', progress: 0 },
  { id: 'projects', label: 'Projects', progress: 20 },
  { id: 'tech', label: 'Tech', progress: 60 },
  { id: 'achievements', label: 'Achievements', progress: 75 },
  { id: 'contact', label: 'Contact', progress: 90 },
]

export function NavigationMenu() {
  const { setScrollProgress, scrollProgress } = useJourney()

  const handleNavClick = useCallback(
    (progress: number) => {
      setScrollProgress(progress / 100)
      // Smooth scroll using Lenis if available
      const scrollContainer = document.querySelector('[data-lenis-prevent]')
      if (scrollContainer && 'scrollTo' in scrollContainer) {
        const targetScroll = progress
        ;(scrollContainer as any).scrollTo(targetScroll)
      }
    },
    [setScrollProgress],
  )

  return (
    <nav className="nav-menu">
      <div className="nav-menu__items">
        {NAV_ITEMS.map((item) => {
          const isActive = Math.abs(scrollProgress * 100 - item.progress) < 15
          return (
            <button
              key={item.id}
              className={`nav-menu__item ${isActive ? 'nav-menu__item--active' : ''}`}
              onClick={() => handleNavClick(item.progress)}
              aria-label={`Navigate to ${item.label}`}
              title={item.label}
            >
              <span className="nav-menu__dot"></span>
              <span className="nav-menu__label">{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
