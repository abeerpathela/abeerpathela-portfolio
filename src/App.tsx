import { useMemo } from 'react'
import { Preloader } from './components/Preloader/Preloader'
import { ScrollContent } from './components/ScrollContent/ScrollContent'
import { HUD } from './components/UI/HUD'
import { NavigationMenu } from './components/UI/NavigationMenu'
import { StatCounters } from './components/UI/StatCounters'
import { TerminalForm } from './components/UI/TerminalForm'
import { HeroPortal } from './components/Hero/HeroPortal'
import { ProjectShowcase } from './components/Projects/ProjectShowcase'
import { TechShowcase } from './components/Tech/TechShowcase'
import { Universe } from './components/Universe/Universe'
import { PROJECTS } from './data/portfolio'
import { JourneyProvider, useJourney } from './context/JourneyContext'
import { LoadingProvider } from './context/LoadingContext'
import { useLenis } from './hooks/useLenis'
import { useSafetyReset } from './hooks/useSafetyReset'

function AppContent() {
  useSafetyReset()
  useLenis()
  const { scrollProgress, hudMode, achievementsActive, currentDockingZone } = useJourney()

  // Find the currently docked project
  const currentProject = useMemo(() => {
    if (!currentDockingZone) return null
    return PROJECTS.find((p) => p.id === currentDockingZone)
  }, [currentDockingZone])

  const isProjectDocking = currentProject !== null

  return (
    <>
      <Preloader />
      <Universe />
      <HeroPortal />
      {isProjectDocking && currentProject && (
        <ProjectShowcase project={currentProject} isVisible={isProjectDocking} />
      )}
      <TechShowcase />
      <HUD scrollProgress={scrollProgress} mode={hudMode} />
      <NavigationMenu />
      <StatCounters active={achievementsActive} />
      <TerminalForm visible={hudMode === 'Contact'} />
      <ScrollContent />
    </>
  )
}

export default function App() {
  return (
    <LoadingProvider>
      <JourneyProvider>
        <AppContent />
      </JourneyProvider>
    </LoadingProvider>
  )
}
