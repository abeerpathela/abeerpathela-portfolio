import { Preloader } from './components/Preloader/Preloader'
import { ScrollContent } from './components/ScrollContent/ScrollContent'
import { HUD } from './components/UI/HUD'
import { StatCounters } from './components/UI/StatCounters'
import { TerminalForm } from './components/UI/TerminalForm'
import { HeroPortal } from './components/Hero/HeroPortal'
import { Universe } from './components/Universe/Universe'
import { JourneyProvider, useJourney } from './context/JourneyContext'
import { LoadingProvider } from './context/LoadingContext'
import { useLenis } from './hooks/useLenis'
import { useSafetyReset } from './hooks/useSafetyReset'

function AppContent() {
  useSafetyReset()
  useLenis()
  const { scrollProgress, hudMode, achievementsActive } = useJourney()

  return (
    <>
      <Preloader />
      <Universe />
      <HeroPortal />
      <HUD scrollProgress={scrollProgress} mode={hudMode} />
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
