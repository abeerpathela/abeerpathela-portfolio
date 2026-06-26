import { PROJECTS } from '../../data/portfolio'
import { ProjectStation } from './ProjectStation'

export function ProjectPlanets() {
  return (
    <group>
      {PROJECTS.map((project, index) => (
        <ProjectStation
          key={project.id}
          project={project}
          index={index}
        />
      ))}
    </group>
  )
}
