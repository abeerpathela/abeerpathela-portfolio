export type TechNode = {
  id: string
  label: string
  color: string
  position: [number, number, number]
}

export const TECH_STACK: TechNode[] = [
  { id: 'react', label: 'React', color: '#61dafb', position: [-14, 4, 270] },
  { id: 'node', label: 'Node.js', color: '#68a063', position: [12, 2, 290] },
  { id: 'three', label: 'Three.js', color: '#ffffff', position: [-8, -3, 310] },
  { id: 'typescript', label: 'TypeScript', color: '#3178c6', position: [16, 5, 325] },
  { id: 'python', label: 'Python', color: '#ffd43b', position: [0, 0, 340] },
]
