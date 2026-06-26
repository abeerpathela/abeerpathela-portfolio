import * as THREE from 'three'

export type Waypoint = {
  id: string
  label: string
  position: [number, number, number]
  lookAt: [number, number, number]
  section: 'hero' | 'project' | 'tech' | 'participation' | 'achievements'
}

export const WAYPOINTS: Waypoint[] = [
  { id: 'hero', label: 'Hero', position: [0, 3, 10], lookAt: [0, 0, 0], section: 'hero' },
  { id: 'autotune-sql', label: 'AutoTune-SQL', position: [0, 3, -40], lookAt: [0, 0, -50], section: 'project' },
  { id: 'simapi', label: 'SimAPI', position: [0, 3, -90], lookAt: [0, 0, -100], section: 'project' },
  { id: 'genetic-guardrail', label: 'Genetic Guardrail', position: [0, 3, -140], lookAt: [0, 0, -150], section: 'project' },
  { id: 'nullprompt', label: 'NullPrompt', position: [0, 3, -190], lookAt: [0, 0, -200], section: 'project' },
  { id: 'razorpay-clone', label: 'Razorpay Clone', position: [0, 3, -240], lookAt: [0, 0, -250], section: 'project' },
  { id: 'jal-sahayak-ai', label: 'Jal Sahayak AI', position: [0, 3, -290], lookAt: [0, 0, -300], section: 'project' },
  { id: 'codefixo', label: 'CodeFixo', position: [0, 3, -340], lookAt: [0, 0, -350], section: 'project' },
  { id: 'aitextra', label: 'AiTextra', position: [0, 3, -390], lookAt: [0, 0, -400], section: 'project' },
  { id: 'brainbuster', label: 'BrainBuster', position: [0, 3, -440], lookAt: [0, 0, -450], section: 'project' },
  { id: 'tech-galaxy', label: 'Tech Galaxy', position: [0, 3, -490], lookAt: [0, 0, -500], section: 'tech' },
  { id: 'participations', label: 'Participations', position: [0, 3, -550], lookAt: [0, 0, -560], section: 'participation' },
  { id: 'achievements', label: 'Achievements', position: [0, 3, -600], lookAt: [0, 0, -610], section: 'achievements' },
]

export const getProgressForWaypoint = (waypointId: string): number => {
  const index = WAYPOINTS.findIndex(w => w.id === waypointId)
  return index / (WAYPOINTS.length - 1)
}

export const JOURNEY_SECTIONS = {
  hero: { zStart: 0, zEnd: 0 },
  projects: { zStart: -50, zEnd: -450 },
  tech: { zStart: -500, zEnd: -500 },
  participations: { zStart: -550, zEnd: -560 },
  achievements: { zStart: -600, zEnd: -610 },
} as const

export type HudMode = 'Hero' | 'Projects' | 'Tech' | 'Participations' | 'Achievements'

export function resolveHudMode(progressPercent: number): HudMode {
  if (progressPercent <= 8) return 'Hero'
  if (progressPercent <= 75) return 'Projects'
  if (progressPercent <= 85) return 'Tech'
  if (progressPercent <= 92) return 'Participations'
  return 'Achievements'
}

export type JourneyRefs = {
  camera: { x: number; y: number; z: number }
  lookAt: { x: number; y: number; z: number }
}

export const INITIAL_JOURNEY: JourneyRefs = {
  camera: { x: 0, y: 3, z: 10 },
  lookAt: { x: 0, y: 0, z: 0 },
}
