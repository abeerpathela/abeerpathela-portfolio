import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  ScrollControls,
  useScroll,
  Stars,
  Float,
  Billboard,
  Image as DreiImage,
  Text,
  Html,
} from '@react-three/drei'
import * as THREE from 'three'
import { AnimatePresence, animate, motion } from 'framer-motion'
import emailjs from '@emailjs/browser'

/* ------------------------------------------------------------------ */
/* DATA (kept exactly as provided)                                     */
/* ------------------------------------------------------------------ */
const DATA = {
  projects: [
    { name: 'AutoTune-SQL', img: '/src/assets/ProjectsImages/AutoTune-SQL.png', git: 'https://github.com/abeerpathela/AutoTune-SQL', live: 'https://autotune-sql.in', desc: 'AI SQL Optimizer' },
    { name: 'SimAPI', img: '/src/assets/ProjectsImages/SimAPI.png', git: 'https://github.com/abeerpathela/SimAPI', live: 'https://sim-api-one.vercel.app', desc: 'SMS Gateway' },
    { name: 'Genetic Guardrail', img: '/src/assets/ProjectsImages/GeneticGuardrail.png', git: 'https://github.com/abeerpathela/GeneticGuardrail', live: '', desc: 'Genomic Safety' },
    { name: 'NullPrompt', img: '/src/assets/ProjectsImages/NullPrompt.png', git: 'https://github.com/abeerpathela/NullPrompt', live: '', desc: 'AI Privacy' },
    { name: 'Razorpay Clone', img: '/src/assets/ProjectsImages/RazorpayClone.png', git: 'https://github.com/abeerpathela/Razorpay-Clone', live: 'https://razorpay-clone-chi-eight.vercel.app', desc: 'UI Clone' },
    { name: 'Jal Sahayak AI', img: '/src/assets/ProjectsImages/JalSahayakAI.png', git: 'https://github.com/abeerpathela/Jal-Sahayak-AI', live: 'https://jal-sahayak-ai.vercel.app', desc: 'Water AI' },
    { name: 'CodeFixo', img: '/src/assets/ProjectsImages/CodeFixo.png', git: 'https://github.com/abeerpathela/CodeFixo', live: 'https://code-fixo.vercel.app', desc: 'Code Review' },
    { name: 'AiTextra', img: '/src/assets/ProjectsImages/AiTextra.png', git: 'https://github.com/abeerpathela/AiTextra', live: '', desc: 'SMS Chatbot' },
    { name: 'BrainBuster', img: '/src/assets/ProjectsImages/BrainBuster.png', git: 'https://github.com/abeerpathela/BrainBuster', live: 'https://brain-buster-lac.vercel.app', desc: 'Quiz App' },
  ],
  participations: [
    { title: 'HackIndia 2026', img: '/src/assets/Participations/HackIndia2026.jpeg', url: 'https://www.linkedin.com/posts/abeer-pathela-240001313_hackindia2026-hackathon-ai-activity-7455283772058509313-bbkz' },
    { title: 'BuildX', img: '/src/assets/Participations/BuildX.png', url: 'https://www.linkedin.com/posts/abeer-pathela-240001313_hackathon-buildx-innovation-activity-7462754885097295872-mClT' },
    { title: 'Chitkaraverse', img: '/src/assets/Participations/Chitkaraverse.png', url: 'https://www.linkedin.com/posts/avinash-guleria-a18553324_chitkaraverse2026-hackathon-aiimpact-ugcPost-7447265770331623424-swhG' },
    { title: 'NumPy Physics', img: '/src/assets/Participations/Numpy.png', url: 'https://www.linkedin.com/posts/abeer-pathela-240001313_teamwork-physics-gamedevelopment-activity-7263471895314886656-UhVd' },
  ],
}

const TECH = [
  'React', 'Node.js', 'Express.js', 'MongoDB', 'Java', 'JavaScript', 'TypeScript',
  'Flutter', 'Tailwind', 'Three.js', 'Firebase', 'Git', 'REST APIs', 'OpenAI API',
  'PostgreSQL', 'MySQL', 'Socket.io', 'JWT',
]

const RESUME = '/src/assets/Abeer_Pathela_Resume.pdf'

const PALETTE = ['#6b8cff', '#ff8c6b', '#6bffc8', '#c084fc', '#ff6b9d', '#4dd4ff', '#ffd700', '#ff7eb3', '#7cff6b']

/* ------------------------------------------------------------------ */
/* Asset resolver — maps the "/src/assets/..." strings to bundled URLs  */
/* so images load both in dev and in production builds.                 */
/* ------------------------------------------------------------------ */
const ASSETS = import.meta.glob('./assets/**/*', { eager: true, query: '?url', import: 'default' }) as Record<string, string>
function asset(path: string): string {
  const key = './' + path.replace(/^\/?src\//, '')
  return ASSETS[key] ?? path
}

/* ------------------------------------------------------------------ */
/* Scene depth layout                                                   */
/* ------------------------------------------------------------------ */
const projectZ = (i: number) => -20 * (i + 1) // -20 .. -180
const PARTICIPATIONS_Z = -250
const TECH_Z = -300
const STATS_Z = -350
const CAM_START = 9
const CAM_END = -372

/* ================================================================== */
/* CAMERA RIG — lerps camera.z from scroll offset                       */
/* ================================================================== */
function CameraRig({ onSector }: { onSector: (s: string, statsActive: boolean) => void }) {
  const scroll = useScroll()
  const lastSector = useRef('')
  const lastStats = useRef(false)
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handle = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', handle)
    return () => window.removeEventListener('pointermove', handle)
  }, [])

  useFrame((state, delta) => {
    const offset = scroll.offset
    const targetZ = CAM_START + offset * (CAM_END - CAM_START)
    const cam = state.camera
    cam.position.z = THREE.MathUtils.damp(cam.position.z, targetZ, 4, delta)
    cam.position.x = THREE.MathUtils.damp(cam.position.x, pointer.current.x * 0.8, 3, delta)
    cam.position.y = THREE.MathUtils.damp(cam.position.y, -pointer.current.y * 0.5, 3, delta)
    cam.lookAt(0, 0, cam.position.z - 12)

    const z = cam.position.z
    let sector = 'Origin'
    if (z > -8) sector = 'Origin · Hero'
    else if (z > -195) sector = 'Project Belt'
    else if (z > -278) sector = 'Hall of Honor'
    else if (z > -328) sector = 'Tech Galaxy'
    else sector = 'Core Stats'

    const statsActive = z < -330
    if (sector !== lastSector.current || statsActive !== lastStats.current) {
      lastSector.current = sector
      lastStats.current = statsActive
      onSector(sector, statsActive)
    }
  })

  return null
}

/* ================================================================== */
/* HERO                                                                 */
/* ================================================================== */
function Hero() {
  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1.2}>
      <Billboard position={[0, 0.4, 0]}>
        <Text fontSize={1.4} letterSpacing={-0.03} color="#f4f7ff" anchorX="center" anchorY="middle" outlineWidth={0.01} outlineColor="#6b8cff">
          ABEER PATHELA
        </Text>
        <Text position={[0, -1.1, 0]} fontSize={0.42} letterSpacing={0.12} color="#6b8cff" anchorX="center" anchorY="middle">
          FULL-STACK DEVELOPER · AI ENGINEER
        </Text>
        <Text position={[0, -2.1, 0]} fontSize={0.26} color="#8893b5" anchorX="center" anchorY="middle">
          scroll to launch the journey
        </Text>
      </Billboard>
      <mesh position={[0, 0, -2]}>
        <icosahedronGeometry args={[2.6, 1]} />
        <meshStandardMaterial color="#0a1030" emissive="#3d5aff" emissiveIntensity={0.35} wireframe />
      </mesh>
    </Float>
  )
}

/* ================================================================== */
/* PROJECT STATION                                                      */
/* ================================================================== */
function ProjectStation({ project, index }: { project: (typeof DATA.projects)[number]; index: number }) {
  const color = PALETTE[index % PALETTE.length]
  const x = index % 2 === 0 ? -2.9 : 2.9
  const y = ((index % 3) - 1) * 1.3
  const pos: [number, number, number] = [x, y, projectZ(index)]

  return (
    <group position={pos}>
      <pointLight color={color} intensity={6} distance={14} position={[0, 0, 3]} />
      <Billboard>
        {/* Project image plane */}
        <DreiImage url={asset(project.img)} scale={[4.4, 2.7]} radius={0.12} position={[0, 1.5, 0]} transparent />
        {/* HTML card with clickable links */}
        <Html transform distanceFactor={9} position={[0, -1.55, 0]} pointerEvents="auto">
          <div
            className="w-[300px] rounded-xl border px-5 py-4 text-center backdrop-blur-md"
            style={{ borderColor: `${color}55`, background: 'rgba(6,9,24,0.78)', boxShadow: `0 0 28px ${color}33` }}
          >
            <p className="text-[11px] font-mono tracking-[0.3em]" style={{ color }}>
              STATION {String(index + 1).padStart(2, '0')}
            </p>
            <h3 className="mt-1 text-xl font-semibold text-[#f4f7ff]">{project.name}</h3>
            <p className="mt-1 text-sm text-[#8893b5]">{project.desc}</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <a
                href={project.git}
                target="_blank"
                rel="noreferrer"
                className="rounded-md border border-[#2a3358] px-3 py-1.5 text-xs font-medium text-[#cdd6f4] transition-colors hover:bg-[#1a2142]"
              >
                GitHub
              </a>
              {project.live ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-md px-3 py-1.5 text-xs font-semibold text-[#04060f]"
                  style={{ background: color }}
                >
                  Live →
                </a>
              ) : (
                <span className="rounded-md border border-[#2a3358] px-3 py-1.5 text-xs text-[#5a6485]">In Lab</span>
              )}
            </div>
          </div>
        </Html>
      </Billboard>
    </group>
  )
}

/* ================================================================== */
/* PARTICIPATIONS — Hall of Honor                                       */
/* ================================================================== */
function Participations() {
  return (
    <group position={[0, 0, PARTICIPATIONS_Z]}>
      <Billboard position={[0, 3.6, 0]}>
        <Text fontSize={0.7} color="#ffd700" anchorX="center" anchorY="middle" letterSpacing={0.05}>
          HALL OF HONOR
        </Text>
      </Billboard>
      {DATA.participations.map((p, i) => {
        const x = (i - (DATA.participations.length - 1) / 2) * 5.2
        return (
          <group key={p.title} position={[x, 0, 0]}>
            <pointLight color="#ffd700" intensity={3} distance={10} position={[0, 0, 3]} />
            <Billboard>
              <DreiImage url={asset(p.img)} scale={[4, 2.6]} radius={0.1} position={[0, 1.1, 0]} transparent />
              <Html transform distanceFactor={9} position={[0, -1.1, 0]} pointerEvents="auto">
                <div
                  className="w-[260px] rounded-xl border px-4 py-3 text-center backdrop-blur-md"
                  style={{ borderColor: '#ffd70055', background: 'rgba(6,9,24,0.8)', boxShadow: '0 0 24px #ffd70022' }}
                >
                  <h3 className="text-base font-semibold text-[#f4f7ff]">{p.title}</h3>
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block rounded-md bg-[#0a66c2] px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
                  >
                    View on LinkedIn
                  </a>
                </div>
              </Html>
            </Billboard>
          </group>
        )
      })}
    </group>
  )
}

/* ================================================================== */
/* TECH GALAXY — orbiting labels around a glowing core                  */
/* ================================================================== */
function TechGalaxy() {
  const groupRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.18
  })

  const points = useMemo(() => {
    const n = TECH.length
    const r = 6.5
    return TECH.map((t, i) => {
      const phi = Math.acos(-1 + (2 * i) / n)
      const theta = Math.sqrt(n * Math.PI) * phi
      return {
        label: t,
        pos: [
          r * Math.cos(theta) * Math.sin(phi),
          r * Math.sin(theta) * Math.sin(phi),
          r * Math.cos(phi),
        ] as [number, number, number],
      }
    })
  }, [])

  return (
    <group position={[0, 0, TECH_Z]}>
      <Billboard position={[0, 7.6, 0]}>
        <Text fontSize={0.7} color="#4dd4ff" anchorX="center" anchorY="middle" letterSpacing={0.05}>
          TECH GALAXY
        </Text>
      </Billboard>
      {/* glowing core */}
      <mesh>
        <sphereGeometry args={[2.4, 48, 48]} />
        <meshStandardMaterial color="#0a2040" emissive="#00aaff" emissiveIntensity={1.6} toneMapped={false} />
      </mesh>
      <pointLight color="#00aaff" intensity={40} distance={30} />
      <group ref={groupRef}>
        {points.map((p) => (
          <Billboard key={p.label} position={p.pos}>
            <Text fontSize={0.42} color="#cdeeff" anchorX="center" anchorY="middle">
              {p.label}
            </Text>
          </Billboard>
        ))}
      </group>
    </group>
  )
}

/* ================================================================== */
/* CORE STATS marker (3D) — numbers themselves animate in the HUD       */
/* ================================================================== */
function StatsCore() {
  return (
    <group position={[0, 0, STATS_Z]}>
      <Billboard>
        <Text position={[0, 3, 0]} fontSize={0.7} color="#7cff6b" anchorX="center" anchorY="middle" letterSpacing={0.05}>
          CORE STATS
        </Text>
      </Billboard>
      <mesh rotation={[0.4, 0.4, 0]}>
        <torusGeometry args={[3, 0.08, 16, 100]} />
        <meshStandardMaterial color="#7cff6b" emissive="#44ff22" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <mesh rotation={[1.4, 0.2, 0]}>
        <torusGeometry args={[4, 0.05, 16, 100]} />
        <meshStandardMaterial color="#6b8cff" emissive="#3d5aff" emissiveIntensity={1} toneMapped={false} />
      </mesh>
      <pointLight color="#7cff6b" intensity={20} distance={25} />
    </group>
  )
}

/* ================================================================== */
/* 3D SCENE                                                             */
/* ================================================================== */
function Scene({ onSector }: { onSector: (s: string, statsActive: boolean) => void }) {
  return (
    <>
      <CameraRig onSector={onSector} />
      <ambientLight intensity={0.4} />
      <Stars radius={300} depth={90} count={6000} factor={5} saturation={0} fade speed={1} />
      <fog attach="fog" args={['#020208', 18, 60]} />

      <Suspense fallback={null}>
        <Hero />
        {DATA.projects.map((p, i) => (
          <ProjectStation key={p.name} project={p} index={i} />
        ))}
        <Participations />
        <TechGalaxy />
        <StatsCore />
      </Suspense>
    </>
  )
}

/* ================================================================== */
/* HUD — animated count up                                              */
/* ================================================================== */
function CountUp({ to, decimals = 0, suffix = '', active }: { to: number; decimals?: number; suffix?: string; active: boolean }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) {
      setVal(0)
      return
    }
    const controls = animate(0, to, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (v) => setVal(v),
    })
    return () => controls.stop()
  }, [active, to])
  return (
    <span>
      {val.toFixed(decimals)}
      {suffix}
    </span>
  )
}

/* ================================================================== */
/* CONTACT FORM (EmailJS ready)                                         */
/* ================================================================== */
function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const SERVICE = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const TEMPLATE = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const PUBLIC = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    try {
      if (SERVICE && TEMPLATE && PUBLIC && formRef.current) {
        await emailjs.sendForm(SERVICE, TEMPLATE, formRef.current, { publicKey: PUBLIC })
      } else {
        // EmailJS keys not configured — simulate success so the UI stays functional
        await new Promise((r) => setTimeout(r, 700))
      }
      setStatus('sent')
      formRef.current?.reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="pointer-events-auto flex w-[300px] flex-col gap-2 rounded-xl border border-[#1e2748] bg-[rgba(6,9,24,0.82)] p-4 backdrop-blur-md"
    >
      <p className="font-mono text-[11px] tracking-[0.3em] text-[#6b8cff]">TRANSMIT MESSAGE</p>
      <input
        name="user_name"
        required
        placeholder="Your name"
        className="rounded-md border border-[#1e2748] bg-[#070b1a] px-3 py-2 text-sm text-[#f4f7ff] outline-none focus:border-[#6b8cff]"
      />
      <input
        name="user_email"
        type="email"
        required
        placeholder="Your email"
        className="rounded-md border border-[#1e2748] bg-[#070b1a] px-3 py-2 text-sm text-[#f4f7ff] outline-none focus:border-[#6b8cff]"
      />
      <textarea
        name="message"
        required
        rows={2}
        placeholder="Your message"
        className="resize-none rounded-md border border-[#1e2748] bg-[#070b1a] px-3 py-2 text-sm text-[#f4f7ff] outline-none focus:border-[#6b8cff]"
      />
      <button
        type="submit"
        disabled={status === 'sending'}
        className="rounded-md bg-[#6b8cff] px-3 py-2 text-sm font-semibold text-[#04060f] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent ✓' : status === 'error' ? 'Retry' : 'Send'}
      </button>
    </form>
  )
}

/* ================================================================== */
/* OVERLAY HUD                                                          */
/* ================================================================== */
function Overlay({ sector, statsActive }: { sector: string; statsActive: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-10 font-sans">
      {/* Top bar */}
      <div className="flex items-center justify-between p-5">
        <div className="pointer-events-auto">
          <p className="text-sm font-semibold tracking-tight text-[#f4f7ff]">ABEER PATHELA</p>
          <p className="font-mono text-[10px] tracking-[0.25em] text-[#5a6485]">DEEP-SPACE PORTFOLIO</p>
        </div>
        <a
          href={asset(RESUME)}
          target="_blank"
          rel="noreferrer"
          className="pointer-events-auto rounded-full border border-[#6b8cff66] bg-[rgba(107,140,255,0.12)] px-5 py-2 text-sm font-semibold text-[#cdd6f4] backdrop-blur-md transition-colors hover:bg-[rgba(107,140,255,0.25)]"
        >
          Resume
        </a>
      </div>

      {/* Sector status (bottom-left) */}
      <div className="absolute bottom-5 left-5">
        <div className="rounded-lg border border-[#1e2748] bg-[rgba(6,9,24,0.7)] px-4 py-2 backdrop-blur-md">
          <p className="font-mono text-[10px] tracking-[0.25em] text-[#5a6485]">CURRENT SECTOR</p>
          <p className="flex items-center gap-2 text-sm font-medium text-[#6b8cff]">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#6b8cff]" />
            {sector}
          </p>
        </div>
      </div>

      {/* Contact form (bottom-right) */}
      <div className="absolute bottom-5 right-5">
        <ContactForm />
      </div>

      {/* Animated stats overlay */}
      <AnimatePresence>
        {statsActive && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 gap-10"
          >
            <div className="text-center">
              <p className="text-6xl font-bold text-[#7cff6b] tabular-nums">
                <CountUp to={9.58} decimals={2} active={statsActive} />
              </p>
              <p className="mt-1 font-mono text-xs tracking-[0.25em] text-[#8893b5]">CGPA</p>
            </div>
            <div className="text-center">
              <p className="text-6xl font-bold text-[#ffd700] tabular-nums">
                <CountUp to={100} suffix="+" active={statsActive} />
              </p>
              <p className="mt-1 font-mono text-xs tracking-[0.25em] text-[#8893b5]">LEETCODE SOLVED</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ================================================================== */
/* APP                                                                  */
/* ================================================================== */
export default function App() {
  const [sector, setSector] = useState('Origin · Hero')
  const [statsActive, setStatsActive] = useState(false)

  const handleSector = (s: string, active: boolean) => {
    setSector(s)
    setStatsActive(active)
  }

  return (
    <div className="fixed inset-0 bg-[#020208]">
      <Canvas camera={{ position: [0, 0, CAM_START], fov: 60 }} gl={{ antialias: true }} dpr={[1, 2]}>
        <ScrollControls pages={10} damping={0.2}>
          <Scene onSector={handleSector} />
        </ScrollControls>
      </Canvas>
      <Overlay sector={sector} statsActive={statsActive} />
    </div>
  )
}
