import { Suspense, useMemo, useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ScrollControls,
  useScroll,
  Stars,
  Billboard,
  Text,
  Image as DreiImage,
  Html,
  Float,
  Sphere,
  Torus,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { PORTFOLIO_DATA, STATION_SPACING } from "./data";

const SECTOR_COUNT = PORTFOLIO_DATA.sectors.length; // 5

interface SceneProps {
  onSectorChange: (index: number, label: string) => void;
}

export function Scene({ onSectorChange }: SceneProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <Canvas
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      camera={{ position: [0, 2, 8], fov: isMobile ? 75 : 45, near: 0.1, far: 1000 }}
    >
      <color attach="background" args={["#02040a"]} />
      <fog attach="fog" args={["#02040a", 25, 80]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#00e5ff" />
      <pointLight position={[-10, -5, -10]} intensity={0.8} color="#ff00aa" />

      <Stars radius={120} depth={80} count={6000} factor={4} saturation={0} fade speed={0.5} />

      <Suspense fallback={null}>
        <ScrollControls pages={SECTOR_COUNT + 0.5} damping={0.25}>
          <CameraRig onSectorChange={onSectorChange} />
          <SectorContent />
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}

/* ------------------------- Camera Rig ------------------------- */
function CameraRig({ onSectorChange }: { onSectorChange: (i: number, label: string) => void }) {
  const scroll = useScroll();
  const { camera } = useThree();
  const lastSector = useRef(-1);
  const tmp = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const offset = scroll.offset; // 0..1
    const totalDist = (SECTOR_COUNT - 1) * STATION_SPACING;

    // "Dock" at each station: ease the offset so motion pauses near each integer step
    const raw = offset * (SECTOR_COUNT - 1); // 0..(N-1)
    const sectorIndex = Math.round(raw);
    const localT = raw - Math.floor(raw); // 0..1 between stations
    // smoothstep for docking feel
    const eased = localT * localT * (3 - 2 * localT);
    const docked = Math.floor(raw) + eased;
    const targetZ = -docked * STATION_SPACING;

    tmp.current.set(0, 1.5, targetZ + 9);
    camera.position.lerp(tmp.current, Math.min(1, delta * 4));
    camera.lookAt(0, 1.2, targetZ);

    if (sectorIndex !== lastSector.current) {
      lastSector.current = sectorIndex;
      const clamped = Math.max(0, Math.min(SECTOR_COUNT - 1, sectorIndex));
      onSectorChange(clamped, PORTFOLIO_DATA.sectors[clamped]);
    }

    // prevent unused var warning
    void totalDist;
  });

  return null;
}

/* ------------------------- Sector Layout ------------------------- */
function SectorContent() {
  return (
    <>
      <ProjectsSector z={0} />
      <ParticipationsSector z={-STATION_SPACING} />
      <TechSector z={-2 * STATION_SPACING} />
      <AchievementsSector z={-3 * STATION_SPACING} />
      <ContactSector z={-4 * STATION_SPACING} />
    </>
  );
}

/* ------------------------- Shared bits ------------------------- */
function SectorTitle({ z, title, subtitle }: { z: number; title: string; subtitle?: string }) {
  return (
    <Billboard position={[0, 6, z]}>
      <Text
        fontSize={1.1}
        color="#7df9ff"
        anchorX="center"
        outlineWidth={0.02}
        outlineColor="#00e5ff"
      >
        {title}
      </Text>
      {subtitle && (
        <Text position={[0, -0.9, 0]} fontSize={0.32} color="#7df9ff" anchorX="center">
          {subtitle}
        </Text>
      )}
    </Billboard>
  );
}

function SafeImage({ url, ...props }: { url: string } & React.ComponentProps<typeof DreiImage>) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(
      url,
      () => {},
      undefined,
      () => {
        if (!cancelled) setFailed(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [url]);

  if (failed) {
    return (
      <mesh {...(props as any)}>
        <planeGeometry args={[(props as any).scale?.[0] ?? 3, (props as any).scale?.[1] ?? 2]} />
        <meshBasicMaterial color="#0a2540" />
      </mesh>
    );
  }
  return <DreiImage url={url} {...props} />;
}

/* ------------------------- Sector 1: Projects (9 planets) ------------------------- */
function ProjectsSector({ z }: { z: number }) {
  const radius = 7;
  return (
    <group position={[0, 0, z]}>
      <SectorTitle z={0} title="PROJECTS NEBULA" subtitle="9 ACTIVE BUILDS" />
      {PORTFOLIO_DATA.projects.map((p, i) => {
        const angle = (i / PORTFOLIO_DATA.projects.length) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * 2.5 + 1;
        const localZ = Math.sin(angle) * radius * 0.5 - 4;
        return <ProjectPlanet key={p.title} project={p} position={[x, y, localZ]} index={i} />;
      })}
    </group>
  );
}

function ProjectPlanet({
  project,
  position,
  index,
}: {
  project: (typeof PORTFOLIO_DATA.projects)[number];
  position: [number, number, number];
  index: number;
}) {
  const planetRef = useRef<THREE.Mesh>(null);
  const color = useMemo(
    () => new THREE.Color().setHSL((index / 9) * 0.8 + 0.5, 0.7, 0.55),
    [index],
  );

  useFrame((state) => {
    if (planetRef.current) {
      planetRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group position={position}>
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere ref={planetRef} args={[0.7, 32, 32]}>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} roughness={0.4} />
        </Sphere>
        <Torus args={[1.1, 0.02, 16, 64]} rotation={[Math.PI / 2.3, 0, 0]}>
          <meshBasicMaterial color={color} transparent opacity={0.5} />
        </Torus>

        <Billboard position={[0, 2, 0]}>
          <SafeImage
            url={project.img}
            scale={[3.2, 2, 1] as any}
            transparent
            // @ts-expect-error drei Image extras
            anisotropy={16}
          />
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[3.4, 2.2]} />
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.15} />
          </mesh>

          <Text position={[0, -1.35, 0.01]} fontSize={0.28} color="#7df9ff" anchorX="center">
            {project.title.toUpperCase()}
          </Text>
          <Text position={[0, -1.7, 0.01]} fontSize={0.18} color="#7df9ff" anchorX="center" maxWidth={3}>
            {project.desc}
          </Text>

          <Html
            position={[0, -2.2, 0.01]}
            center
            transform
            distanceFactor={8}
            occlude={false}
            style={{ pointerEvents: "auto" }}
          >
            <div className="flex gap-1.5 hud-mono">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hud-border hud-text rounded-sm bg-background/70 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm transition hover:bg-primary/20"
                >
                  ▸ GITHUB
                </a>
              )}
              {project.live && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="hud-border hud-text rounded-sm bg-background/70 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm transition hover:bg-primary/20"
                >
                  ▸ LIVE
                </a>
              )}
            </div>
          </Html>
        </Billboard>
      </Float>
    </group>
  );
}

/* ------------------------- Sector 2: Participations (carousel) ------------------------- */
function ParticipationsSector({ z }: { z: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const items = PORTFOLIO_DATA.participations;
  const radius = 4.5;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });

  return (
    <group position={[0, 0, z]}>
      <SectorTitle z={0} title="PARTICIPATIONS GALLERY" subtitle="HACKATHONS & EVENTS" />

      {/* Central gallery planet */}
      <Sphere args={[1.6, 48, 48]} position={[0, 1, -2]}>
        <meshStandardMaterial color="#1a0033" emissive="#5500aa" emissiveIntensity={0.25} roughness={0.5} />
      </Sphere>

      <group ref={groupRef} position={[0, 1.2, -2]}>
        {items.map((p, i) => {
          const angle = (i / items.length) * Math.PI * 2;
          const x = Math.cos(angle) * radius;
          const zL = Math.sin(angle) * radius;
          return (
            <Billboard key={p.title} position={[x, 0, zL]}>
              <SafeImage
                url={p.img}
                scale={[2.6, 1.7, 1] as any}
                transparent
                // @ts-expect-error drei Image extras
                anisotropy={16}
              />
              <Text position={[0, -1.1, 0.01]} fontSize={0.22} color="#7df9ff" anchorX="center">
                {p.title.toUpperCase()}
              </Text>
              <Html
                position={[0, -1.55, 0.01]}
                center
                transform
                distanceFactor={8}
                style={{ pointerEvents: "auto" }}
              >
                <a
                  href={p.link}
                  target="_blank"
                  rel="noreferrer"
                  className="hud-border hud-text hud-mono rounded-sm bg-background/70 px-2 py-0.5 text-[10px] font-bold backdrop-blur-sm transition hover:bg-primary/20"
                >
                  ▸ LINKEDIN
                </a>
              </Html>
            </Billboard>
          );
        })}
      </group>
    </group>
  );
}

/* ------------------------- Sector 3: Tech Galaxy ------------------------- */
function TechSector({ z }: { z: number }) {
  const items = PORTFOLIO_DATA.techStack;
  const positions = useMemo(() => {
    return items.map((_, i) => {
      const phi = Math.acos(-1 + (2 * i) / items.length);
      const theta = Math.sqrt(items.length * Math.PI) * phi;
      const r = 4 + Math.random() * 1.5;
      return [
        r * Math.cos(theta) * Math.sin(phi),
        r * Math.sin(theta) * Math.sin(phi) + 1,
        r * Math.cos(phi) - 2,
      ] as [number, number, number];
    });
  }, [items.length]);

  const groupRef = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.15;
    }
  });

  return (
    <group position={[0, 0, z]}>
      <SectorTitle z={0} title="TECH GALAXY" subtitle="STACK & TOOLING" />
      <group ref={groupRef}>
        {items.map((label, i) => (
          <Billboard key={label} position={positions[i]}>
            <Text fontSize={0.32} color="#7df9ff" outlineWidth={0.01} outlineColor="#00e5ff">
              {label}
            </Text>
          </Billboard>
        ))}
        {/* glowing core */}
        <Sphere args={[0.6, 32, 32]} position={[0, 1, -2]}>
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} />
        </Sphere>
      </group>
    </group>
  );
}

/* ------------------------- Sector 4: Achievement Core ------------------------- */
function AchievementsSector({ z }: { z: number }) {
  const coreRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.4;
      coreRef.current.rotation.x = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group position={[0, 0, z]}>
      <SectorTitle z={0} title="ACHIEVEMENT CORE" subtitle="STATS & METRICS" />

      <Sphere ref={coreRef} args={[2, 64, 64]} position={[0, 1.5, -2]}>
        <meshStandardMaterial
          color="#00e5ff"
          emissive="#00e5ff"
          emissiveIntensity={1.2}
          roughness={0.1}
          metalness={0.7}
          wireframe
        />
      </Sphere>
      <Sphere args={[2.4, 32, 32]} position={[0, 1.5, -2]}>
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.08} />
      </Sphere>

      <Billboard position={[-3.5, 1.8, 0]}>
        <Text fontSize={0.3} color="#7df9ff" anchorX="center">CGPA</Text>
        <AnimatedNumber target={9.58} position={[0, -0.7, 0]} suffix="" decimals={2} size={1.1} />
      </Billboard>
      <Billboard position={[3.5, 1.8, 0]}>
        <Text fontSize={0.3} color="#7df9ff" anchorX="center">LEETCODE</Text>
        <AnimatedNumber target={100} position={[0, -0.7, 0]} suffix="+" decimals={0} size={1.1} />
      </Billboard>
    </group>
  );
}

function AnimatedNumber({
  target,
  position,
  suffix = "",
  decimals = 0,
  size = 1,
}: {
  target: number;
  position: [number, number, number];
  suffix?: string;
  decimals?: number;
  size?: number;
}) {
  const ref = useRef<any>(null);
  const value = useRef(0);
  useFrame((_, delta) => {
    value.current = THREE.MathUtils.damp(value.current, target, 1.5, delta);
    if (ref.current) {
      ref.current.text = value.current.toFixed(decimals) + suffix;
    }
  });
  return (
    <Text
      ref={ref}
      position={position}
      fontSize={size}
      color="#00e5ff"
      anchorX="center"
      outlineWidth={0.03}
      outlineColor="#00e5ff"
    >
      0{suffix}
    </Text>
  );
}

/* ------------------------- Sector 5: Contact / Comms Relay ------------------------- */
function ContactSector({ z }: { z: number }) {
  return (
    <group position={[0, 0, z]}>
      <SectorTitle z={0} title="COMMS RELAY" subtitle="OPEN A CHANNEL" />
      <Torus args={[3, 0.05, 16, 80]} position={[0, 1.5, -2]} rotation={[Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color="#00e5ff" />
      </Torus>
      <Billboard position={[0, 1.5, -2]}>
        <Html center transform distanceFactor={6} style={{ pointerEvents: "auto" }}>
          <ContactTerminal />
        </Html>
      </Billboard>
    </group>
  );
}

function ContactTerminal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[Portfolio] Transmission from ${name || "Anonymous"}`);
    const body = encodeURIComponent(`From: ${name} <${email}>\n\n${msg}`);
    window.location.href = `mailto:pathelaabeer@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <form
      onSubmit={submit}
      className="hud-border hud-mono w-[420px] max-w-[90vw] rounded-sm bg-background/85 p-5 text-primary backdrop-blur-md"
      style={{ boxShadow: "0 0 40px oklch(0.82 0.18 195 / 0.4)" }}
    >
      <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-primary/70">
        <span>▣ TERMINAL // pathelaabeer@gmail.com</span>
        <span className="hud-blink">●</span>
      </div>
      <label className="block text-[10px] uppercase tracking-widest text-primary/60">&gt; CALLSIGN</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="mb-3 w-full border-b border-primary/40 bg-transparent py-1 text-sm text-primary outline-none focus:border-primary"
      />
      <label className="block text-[10px] uppercase tracking-widest text-primary/60">&gt; FREQUENCY (EMAIL)</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="mb-3 w-full border-b border-primary/40 bg-transparent py-1 text-sm text-primary outline-none focus:border-primary"
      />
      <label className="block text-[10px] uppercase tracking-widest text-primary/60">&gt; MESSAGE PAYLOAD</label>
      <textarea
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        required
        rows={3}
        className="mb-4 w-full resize-none border-b border-primary/40 bg-transparent py-1 text-sm text-primary outline-none focus:border-primary"
      />
      <button
        type="submit"
        className="hud-border hud-text w-full rounded-sm bg-primary/15 px-3 py-2 text-xs font-bold transition hover:bg-primary/30"
      >
        ▲ TRANSMIT
      </button>
    </form>
  );
}

// silence unused
void useTexture;