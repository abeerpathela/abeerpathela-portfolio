import { Preloader } from './components/Preloader/Preloader'
import { ScrollContent } from './components/ScrollContent/ScrollContent'
import { Universe } from './components/Universe/Universe'
import { LoadingProvider } from './context/LoadingContext'
import { useLenis } from './hooks/useLenis'

function AppContent() {
  useLenis()

  return (
    <>
      <Preloader />
      <Universe />
      <ScrollContent />
    </>
  )
}

export default function App() {
  return (
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  )
}
