import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { HeroNexus } from '../Hero/HeroNexus'
import { SupernovaSun } from '../Achievements/SupernovaSun'
import { ResumeDisk } from '../Contact/ResumeDisk'
import { ProjectPlanets } from '../Planets/ProjectPlanets'
import { TechNebula } from '../Tech/TechNebula'
import { CameraRig } from './CameraRig'
import { StarField } from './StarField'
import { NebulaFog } from './NebulaFog'

type SceneContentProps = {
  onReady: () => void
}

export function SceneContent({ onReady }: SceneContentProps) {
  return (
    <>
      <CameraRig />
      <ambientLight intensity={0.12} />
      <directionalLight position={[10, 20, 10]} intensity={0.3} />

      <StarField onReady={onReady} />
      <NebulaFog />
      <HeroNexus />
      <ProjectPlanets />
      <TechNebula />
      <SupernovaSun />
      <ResumeDisk />

      <EffectComposer multisampling={0}>
        <Bloom
          luminanceThreshold={0.15}
          luminanceSmoothing={0.8}
          intensity={1.8}
          mipmapBlur
          levels={8}
        />
      </EffectComposer>
    </>
  )
}
