import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { HeroNexus } from '../Hero/HeroNexus'
import { SupernovaSun } from '../Achievements/SupernovaSun'
import { ResumeDisk } from '../Contact/ResumeDisk'
import { ProjectPlanets } from '../Planets/ProjectPlanets'
import { TechConstellation } from '../Tech/TechConstellation'
import { CameraRig } from './CameraRig'
import { StarField } from './StarField'

type SceneContentProps = {
  onReady: () => void
}

export function SceneContent({ onReady }: SceneContentProps) {
  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 20, 10]} intensity={0.4} />

      <StarField onReady={onReady} />
      <HeroNexus />
      <ProjectPlanets />
      <TechConstellation />
      <SupernovaSun />
      <ResumeDisk />

      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.25}
          luminanceSmoothing={0.85}
          intensity={1.4}
          mipmapBlur
        />
      </EffectComposer>
    </>
  )
}
