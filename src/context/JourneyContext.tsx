import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
  type ReactNode,
} from 'react'
import {
  INITIAL_JOURNEY,
  type HudMode,
  type JourneyRefs,
} from '../config/journey'

type JourneyContextValue = {
  journeyRef: MutableRefObject<JourneyRefs>
  scrollProgress: number
  setScrollProgress: (value: number) => void
  hudMode: HudMode
  setHudMode: (mode: HudMode) => void
  achievementsActive: boolean
  setAchievementsActive: (active: boolean) => void
  scrollContainerRef: React.RefObject<HTMLElement | null>
  isDocking: boolean
  setIsDocking: (docking: boolean) => void
  currentDockingZone: string | null
  setCurrentDockingZone: (zone: string | null) => void
}

const JourneyContext = createContext<JourneyContextValue | null>(null)

export function JourneyProvider({ children }: { children: ReactNode }) {
  const journeyRef = useRef<JourneyRefs>(structuredClone(INITIAL_JOURNEY))
  const scrollContainerRef = useRef<HTMLElement | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [hudMode, setHudMode] = useState<HudMode>('Hero')
  const [achievementsActive, setAchievementsActive] = useState(false)
  const [isDocking, setIsDocking] = useState(false)
  const [currentDockingZone, setCurrentDockingZone] = useState<string | null>(null)

  const value = useMemo(
    () => ({
      journeyRef,
      scrollProgress,
      setScrollProgress,
      hudMode,
      setHudMode,
      achievementsActive,
      setAchievementsActive,
      scrollContainerRef,
      isDocking,
      setIsDocking,
      currentDockingZone,
      setCurrentDockingZone,
    }),
    [scrollProgress, hudMode, achievementsActive, isDocking, currentDockingZone],
  )

  return (
    <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>
  )
}

export function useJourney() {
  const context = useContext(JourneyContext)
  if (!context) {
    throw new Error('useJourney must be used within JourneyProvider')
  }
  return context
}
