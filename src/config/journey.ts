export const JOURNEY_SECTIONS = {
  hero: { zStart: 0, zEnd: 50 },
  projects: { zStart: 100, zEnd: 200 },
  tech: { zStart: 250, zEnd: 350 },
  achievements: { zStart: 400, zEnd: 450 },
  contact: { zStart: 500, zEnd: 500 },
} as const

export const JOURNEY_TOTAL_Z = 550

export type HudMode = 'Hero' | 'Projects' | 'Tech' | 'Achievements' | 'Contact'

export function resolveHudMode(progressPercent: number): HudMode {
  if (progressPercent <= 20) return 'Hero'
  if (progressPercent <= 50) return 'Projects'
  if (progressPercent <= 70) return 'Tech'
  if (progressPercent <= 85) return 'Achievements'
  return 'Contact'
}

export type JourneyRefs = {
  camera: { x: number; y: number; z: number }
  lookAt: { x: number; y: number; z: number }
}

export const INITIAL_JOURNEY: JourneyRefs = {
  camera: { x: 0, y: 3, z: -8 },
  lookAt: { x: 0, y: 0, z: 25 },
}
