export type Project = {
  id: string
  title: string
  description: string
  color: string
  size: number
  position: [number, number, number]
}

export const PROJECTS: Project[] = [
  {
    id: 'nebula-chat',
    title: 'Nebula Chat',
    description: 'Real-time messaging with WebSockets & React',
    color: '#6b8cff',
    size: 3.2,
    position: [-18, 2, 120],
  },
  {
    id: 'orbit-commerce',
    title: 'Orbit Commerce',
    description: 'Headless e-commerce built on Node & Stripe',
    color: '#ff8c6b',
    size: 2.8,
    position: [16, -1, 145],
  },
  {
    id: 'pulse-analytics',
    title: 'Pulse Analytics',
    description: 'Live dashboards with D3 & Three.js visuals',
    color: '#6bffc8',
    size: 3.5,
    position: [-12, 3, 170],
  },
  {
    id: 'void-os',
    title: 'Void OS',
    description: 'Experimental spatial UI framework',
    color: '#c084fc',
    size: 2.6,
    position: [14, 1, 190],
  },
]
