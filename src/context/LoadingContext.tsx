import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type LoadingSignal = 'canvas' | 'scene' | 'fonts' | 'dom'

type LoadingContextValue = {
  isReady: boolean
  progress: number
  markReady: (signal: LoadingSignal) => void
}

const SIGNALS: LoadingSignal[] = ['canvas', 'scene', 'fonts', 'dom']

const LoadingContext = createContext<LoadingContextValue | null>(null)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [readySignals, setReadySignals] = useState<Record<LoadingSignal, boolean>>({
    canvas: false,
    scene: false,
    fonts: false,
    dom: false,
  })

  const markReady = useCallback((signal: LoadingSignal) => {
    setReadySignals((current) => {
      if (current[signal]) return current
      return { ...current, [signal]: true }
    })
  }, [])

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      markReady('fonts')
    } else {
      void document.fonts.ready.then(() => markReady('fonts'))
    }

    if (document.readyState === 'complete') {
      markReady('dom')
    } else {
      const onLoad = () => markReady('dom')
      window.addEventListener('load', onLoad, { once: true })
      return () => window.removeEventListener('load', onLoad)
    }
  }, [markReady])

  const readyCount = SIGNALS.filter((signal) => readySignals[signal]).length
  const progress = readyCount / SIGNALS.length
  const isReady = readyCount === SIGNALS.length

  const value = useMemo(
    () => ({ isReady, progress, markReady }),
    [isReady, progress, markReady],
  )

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}
