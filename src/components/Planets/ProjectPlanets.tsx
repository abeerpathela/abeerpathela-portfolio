import { PROJECTS } from '../../data/projects'
import { Planet } from './Planet'

export function ProjectPlanets() {
  return (
    <group>
      {PROJECTS.map((project) => (
        <Planet
          key={project.id}
          title={project.title}
          description={project.description}
          color={project.color}
          size={project.size}
          position={project.position}
        />
      ))}
    </group>
  )
}
