import { Suspense, useMemo, useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import emailjs from "@emailjs/browser";
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
import { PORTFOLIO_DATA, STATION_SPACING } from "../../data";
import { SiGithub, SiInstagram } from "react-icons/si";
import { TbBrandLinkedin } from "react-icons/tb";

/* ------------------------- Stations ------------------------- */
// Each project is its own destination station, then the supporting sectors.
type Station =
  | { kind: "intro"; label: string }
  | { kind: "project"; index: number; label: string }
  | { kind: "participations"; label: string }
  | { kind: "tech"; label: string }
  | { kind: "achievements"; label: string }
  | { kind: "contact"; label: string };

const STATIONS: Station[] = [
  { kind: "intro", label: "MISSION BRIEFING" },
  ...PORTFOLIO_DATA.projects.map((p, i) => ({
    kind: "project" as const,
    index: i,
    label: `PROJECT ${String(i + 1).padStart(2, "0")} // ${p.title.toUpperCase()}`,
  })),
  { kind: "participations", label: "PARTICIPATIONS GALLERY" },
  { kind: "tech", label: "TECH GALAXY" },
  { kind: "achievements", label: "ACHIEVEMENT CORE" },
  { kind: "contact", label: "CONTACT CHANNEL" },
];
const STATION_COUNT = STATIONS.length;

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
      <color attach="background" args={["#070418"]} />
      <fog attach="fog" args={["#0a0820", 18, 55]} />
      <ambientLight intensity={0.45} />
      <pointLight position={[10, 10, 10]} intensity={1.3} color="#7c5cff" />
      <pointLight position={[-10, -5, -10]} intensity={1.0} color="#ff5dc8" />
      <pointLight position={[0, 8, -20]} intensity={0.9} color="#ffb86b" />

      <Stars radius={120} depth={80} count={6000} factor={4} saturation={0} fade speed={0.5} />

      <Suspense fallback={null}>
        <ScrollControls pages={STATION_COUNT * 1.2} damping={0.22}>
          <CameraRig onSectorChange={onSectorChange} />
          <StationsContent />
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}

/* ------------------------- Camera Rig ------------------------- */
function CameraRig({ onSectorChange }: { onSectorChange: (i: number, label: string) => void }) {
  const scroll = useScroll();
  const { camera } = useThree();
  const lastStation = useRef(-1);
  const tmp = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    const offset = scroll.offset; // 0..1
    const raw = offset * (STATION_COUNT - 1); // 0..(N-1)
    const stationIndex = Math.round(raw);
    const localT = raw - Math.floor(raw); // 0..1 between stations

    // Docking curve: long pause at each station, quick transit between.
    // Map localT (0..1) so the middle 40% does most of the movement.
    const dock = (t: number) => {
      const edge = 0.3;
      if (t < edge) return 0;
      if (t > 1 - edge) return 1;
      const k = (t - edge) / (1 - 2 * edge);
      return k * k * (3 - 2 * k);
    };
    const docked = Math.floor(raw) + dock(localT);
    const targetZ = -docked * STATION_SPACING;

    tmp.current.set(0, 1.5, targetZ + 9);
    camera.position.lerp(tmp.current, Math.min(1, delta * 4));
    camera.lookAt(0, 1.2, targetZ);

    if (stationIndex !== lastStation.current) {
      lastStation.current = stationIndex;
      const clamped = Math.max(0, Math.min(STATION_COUNT - 1, stationIndex));
      onSectorChange(clamped, STATIONS[clamped].label);
    }
  });

  return null;
}

/* ------------------------- Station Layout ------------------------- */
function StationsContent() {
  return (
    <>
      {STATIONS.map((station, i) => {
        const z = -i * STATION_SPACING;
        switch (station.kind) {
          case "intro":
            return <IntroStation key={i} z={z} />;
          case "project":
            return (
              <ProjectStation
                key={i}
                z={z}
                index={station.index}
                total={PORTFOLIO_DATA.projects.length}
              />
            );
          case "participations":
            return <ParticipationsSector key={i} z={z} />;
          case "tech":
            return <TechSector key={i} z={z} />;
          case "achievements":
            return <AchievementsSector key={i} z={z} />;
          case "contact":
            return <ContactSector key={i} z={z} />;
        }
      })}
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
  const [status, setStatus] = useState<"loading" | "ok" | "failed">("loading");
  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (!cancelled) setStatus("ok");
    };
    img.onerror = () => {
      if (!cancelled) setStatus("failed");
    };
    img.src = url;
    return () => {
      cancelled = true;
    };
  }, [url]);

  const scale = (props as any).scale ?? [3, 2, 1];
  const w = Array.isArray(scale) ? scale[0] : 3;
  const h = Array.isArray(scale) ? scale[1] : 2;

  if (status !== "ok") {
    const isLoading = status === "loading";
    return (
      <mesh position={(props as any).position}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial
          color={isLoading ? "#0a2540" : "#08233a"}
          transparent
          opacity={0.85}
        />
      </mesh>
    );
  }
  return <DreiImage url={url} {...props} />;
}

/* ------------------------- 3D HUD helpers (no Html — avoids transform collapse at origin) ------------------------- */
function ProjectTechBadges({ tech, y = -1.72 }: { tech: string[]; y?: number }) {
  const xs = useMemo(() => {
    const gap = 1.05;
    const span = (tech.length - 1) * gap;
    return tech.map((_, i) => -span / 2 + i * gap);
  }, [tech]);

  return (
    <>
      {tech.map((t, i) => (
        <Text
          key={t}
          position={[xs[i], y, 0.06]}
          fontSize={0.1}
          color="#7df9ff"
          anchorX="center"
          outlineWidth={0.004}
          outlineColor="#00e5ff"
        >
          {t.toUpperCase()}
        </Text>
      ))}
    </>
  );
}

function HudButton3D({
  label,
  position,
  onClick,
  disabled = false,
}: {
  label: string;
  position: [number, number, number];
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <group position={position}>
      <mesh
        onClick={
          disabled
            ? undefined
            : (e) => {
                e.stopPropagation();
                onClick?.();
              }
        }
        onPointerOver={() => {
          if (!disabled) document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "auto";
        }}
      >
        <planeGeometry args={[1.45, 0.36]} />
        <meshBasicMaterial color={disabled ? "#041018" : "#001821"} transparent opacity={disabled ? 0.5 : 0.85} />
      </mesh>
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.13}
        color={disabled ? "#7df9ff88" : "#7df9ff"}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

function ProjectDossierActions({
  github,
  live,
  tech,
}: {
  github: string;
  live: string;
  tech: string[];
}) {
  return (
    <>
      <ProjectTechBadges tech={tech} />
      {github && (
        <HudButton3D
          label="▸ GITHUB"
          position={[-0.9, -2.05, 0.06]}
          onClick={() => window.open(github, "_blank", "noopener,noreferrer")}
        />
      )}
      {live ? (
        <HudButton3D
          label="▸ LIVE DEMO"
          position={[0.9, -2.05, 0.06]}
          onClick={() => window.open(live, "_blank", "noopener,noreferrer")}
        />
      ) : (
        <HudButton3D label="▸ COMING SOON" position={[0.9, -2.05, 0.06]} disabled />
      )}
    </>
  );
}

/* ------------------------- Intro Station (hero planet only — no project UI) ------------------------- */
function IntroStation({ z }: { z: number }) {
  const { hero } = PORTFOLIO_DATA;
  const ringRef = useRef<THREE.Mesh>(null);
  const scrollTextRef = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (ringRef.current) ringRef.current.rotation.z = s.clock.elapsedTime * 0.15;
    if (scrollTextRef.current) {
      const pulse = Math.sin(s.clock.elapsedTime * 1.5) * 0.15 + 0.85;
      scrollTextRef.current.scale.set(pulse, pulse, pulse);
    }
  });
  return (
    <group position={[0, 0, z]}>
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
        <group position={[0, 1.3, -2]}>
          <Sphere args={[1.1, 48, 48]}>
            <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.8} roughness={0.2} />
          </Sphere>
          <Torus ref={ringRef} args={[2, 0.03, 16, 80]} rotation={[Math.PI / 2.4, 0, 0]}>
            <meshBasicMaterial color="#00e5ff" />
          </Torus>
          <Sphere args={[1.5, 32, 32]}>
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.08} />
          </Sphere>
        </group>
      </Float>
      <Billboard position={[0, 3.4, -1]}>
        <Text fontSize={0.9} color="#7df9ff" outlineWidth={0.02} outlineColor="#00e5ff" anchorX="center">
          {hero.name.toUpperCase()}
        </Text>
        <Text position={[0, -0.7, 0]} fontSize={0.28} color="#7df9ff" anchorX="center">
          {hero.title.toUpperCase()}
        </Text>
        <group ref={scrollTextRef}>
          <Text
            position={[0, -1.15, 0]}
            fontSize={0.48}
            color="#ffffff"
            fillOpacity={1}
            outlineWidth={0.08}
            outlineColor="#003344"
            anchorX="center"
            maxWidth={8}
          >
            {hero.scrollText}
          </Text>
        </group>
      </Billboard>
    </group>
  );
}

/* ------------------------- Project Station (one per project) ------------------------- */
function ProjectStation({
  z,
  index,
  total,
}: {
  z: number;
  index: number;
  total: number;
}) {
  const project = PORTFOLIO_DATA.projects[index];
  const planetRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const color = useMemo(
    () => new THREE.Color().setHSL((index / total) * 0.8 + 0.5, 0.7, 0.55),
    [index, total],
  );

  useFrame((state) => {
    if (planetRef.current) planetRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    if (ringRef.current) ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
  });

  // Alternate the planet to opposite sides for visual rhythm.
  const planetSide = index % 2 === 0 ? -3.6 : 3.6;

  return (
    <group position={[0, 0, z]}>
      {/* Station marker badge */}
      <Billboard position={[0, 4.3, 0]}>
        <Text fontSize={0.22} color="#7df9ff" anchorX="center" outlineWidth={0.005} outlineColor="#00e5ff">
          {`▣ PROJECT ${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}
        </Text>
      </Billboard>

      {/* Decorative planet — mesh, rings, and glow only */}
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        <group position={[planetSide, 1.4, -2.5]}>
          <Sphere ref={planetRef} args={[1.1, 48, 48]}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
              roughness={0.35}
              metalness={0.2}
            />
          </Sphere>
          <Torus ref={ringRef} args={[1.8, 0.025, 16, 80]} rotation={[Math.PI / 2.3, 0, 0]}>
            <meshBasicMaterial color={color} transparent opacity={0.7} />
          </Torus>
          <Sphere args={[1.5, 32, 32]}>
            <meshBasicMaterial color={color} transparent opacity={0.08} />
          </Sphere>
        </group>
      </Float>

      {/* Holographic dossier — 3D UI parented to this station group */}
      <group position={[0, 1.4, -1]}>
        <Billboard>
          {/* Holo frame */}
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[5.6, 4]} />
            <meshBasicMaterial color="#001821" transparent opacity={0.7} />
          </mesh>
          <mesh position={[0, 0, -0.015]}>
            <planeGeometry args={[5.8, 4.2]} />
            <meshBasicMaterial color={color} transparent opacity={0.18} />
          </mesh>

          {/* Top label strip */}
          <Text
            position={[-2.6, 1.78, 0.02]}
            fontSize={0.14}
            color="#7df9ff"
            anchorX="left"
          >
            ▸ DOSSIER // CASE FILE
          </Text>
          <Text
            position={[2.6, 1.78, 0.02]}
            fontSize={0.14}
            color="#7df9ff"
            anchorX="right"
          >
            STATUS: ONLINE ●
          </Text>

          {/* Project image */}
          <SafeImage
            url={project.img}
            scale={[5.2, 2.4, 1] as any}
            position={[0, 0.55, 0.02]}
            transparent
            // @ts-expect-error drei Image extras
            anisotropy={16}
          />

          {/* Title + desc */}
          <Text
            position={[0, -0.95, 0.02]}
            fontSize={0.42}
            color="#7df9ff"
            anchorX="center"
            outlineWidth={0.01}
            outlineColor="#00e5ff"
            maxWidth={5}
          >
            {project.title.toUpperCase()}
          </Text>
          <Text
            position={[0, -1.45, 0.02]}
            fontSize={0.22}
            color="#a5e9ff"
            anchorX="center"
            maxWidth={5}
          >
            {project.desc}
          </Text>

          <ProjectDossierActions github={project.github} live={project.live} tech={project.tech} />
        </Billboard>
      </group>
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
          const openLinkedIn = () => window.open(p.link, "_blank", "noopener,noreferrer");
          return (
            <group key={p.title} position={[x, 0, zL]}>
              <Billboard>
                <SafeImage
                  url={p.img}
                  scale={[2.6, 1.7, 1] as any}
                  transparent
                  // @ts-expect-error drei Image extras
                  anisotropy={16}
                />
                <mesh
                  position={[0, 0, 0.03]}
                  onClick={(e) => {
                    e.stopPropagation();
                    openLinkedIn();
                  }}
                  onPointerOver={() => {
                    document.body.style.cursor = "pointer";
                  }}
                  onPointerOut={() => {
                    document.body.style.cursor = "auto";
                  }}
                >
                  <planeGeometry args={[2.6, 1.7]} />
                  <meshBasicMaterial transparent opacity={0} depthWrite={false} />
                </mesh>
                <Text position={[0, -1.1, 0.01]} fontSize={0.22} color="#7df9ff" anchorX="center">
                  {p.title.toUpperCase()}
                </Text>
                <HudButton3D
                  label="▸ LINKEDIN"
                  position={[0, -1.55, 0.02]}
                  onClick={openLinkedIn}
                />
              </Billboard>
            </group>
          );
        })}
      </group>
    </group>
  );
}

/* ------------------------- Sector 3: Tech Galaxy (orbiting constellation) ------------------------- */
type TechItem = (typeof PORTFOLIO_DATA.techStack)[number];

function TechOrbitIcon({
  tech,
  index,
  total,
}: {
  tech: TechItem;
  index: number;
  total: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const color = useMemo(() => new THREE.Color(tech.color), [tech.color]);
  const orbit = useMemo(() => {
    const layer = index % 3;
    return {
      radius: 2.2 + layer * 1.4,
      speed: 0.12 + (index % 5) * 0.035,
      phase: (index / total) * Math.PI * 2,
      yAmp: 0.35 + layer * 0.15,
      zAmp: 0.55 + layer * 0.2,
      tilt: 0.25 + (index % 4) * 0.12,
    };
  }, [index, total]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * orbit.speed + orbit.phase;
    groupRef.current.position.set(
      Math.cos(t) * orbit.radius,
      Math.sin(t * 0.65 + orbit.tilt) * orbit.yAmp,
      Math.sin(t) * orbit.radius * orbit.zAmp,
    );
  });

  return (
    <group ref={groupRef}>
      <Billboard>
        <mesh>
          <planeGeometry args={[0.72, 0.72]} />
          <meshBasicMaterial color={color} transparent opacity={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.76, 0.76]} />
          <meshBasicMaterial color={color} transparent opacity={0.12} wireframe />
        </mesh>
        <Text position={[0, 0, 0.02]} fontSize={0.18} color={tech.color} anchorX="center" anchorY="middle">
          {tech.name.slice(0, 2).toUpperCase()}
        </Text>
        <Text position={[0, -0.58, 0.02]} fontSize={0.11} color={tech.color} anchorX="center">
          {tech.name.toUpperCase()}
        </Text>
      </Billboard>
    </group>
  );
}

function TechSector({ z }: { z: number }) {
  const items = PORTFOLIO_DATA.techStack;
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.25;
      const pulse = 0.55 + Math.sin(state.clock.elapsedTime * 1.2) * 0.15;
      (coreRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
    }
  });

  return (
    <group position={[0, 0, z]}>
      <SectorTitle z={0} title="TECH GALAXY" subtitle="STACK & TOOLING" />
      <group position={[0, 1, -2]}>
        {items.map((tech, i) => (
          <TechOrbitIcon key={tech.name} tech={tech} index={i} total={items.length} />
        ))}
        {/* glowing core */}
        <Sphere ref={coreRef} args={[0.6, 32, 32]}>
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} />
        </Sphere>
        <Sphere args={[1.2, 32, 32]}>
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.06} />
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
      {/* Screen-projected Html (no transform) — stays locked to this station's world position */}
      <Html
        position={[0, 1.5, -2]}
        center
        occlude={false}
        style={{ pointerEvents: "auto" }}
      >
        <ContactTerminal />
      </Html>
    </group>
  );
}

function ContactTerminal() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setStatus("sending");

      try {
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        if (!serviceId || !templateId || !publicKey) {
          throw new Error("EmailJS environment variables are not configured");
        }

        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: name,
            from_email: email,
            reply_to: email,
            subject: subject || `[Portfolio] Transmission from ${name}`,
            message: msg,
            to_email: PORTFOLIO_DATA.contact.email,
          },
          publicKey,
        );
        setStatus("sent");
        setName("");
        setEmail("");
        setSubject("");
        setMsg("");
      } catch {
        setStatus("error");
      }
    },
    [name, email, subject, msg],
  );

  const socialClass =
    "pointer-events-auto hud-border flex h-10 w-10 items-center justify-center rounded-sm bg-background/80 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:scale-110 hover:bg-primary/25 hover:shadow-[0_0_24px_rgba(0,229,255,0.65)]";

  return (
    <div className="pointer-events-auto flex flex-col items-center gap-4">
      <form
        onSubmit={submit}
        className="hud-border hud-mono w-[420px] max-w-[90vw] rounded-sm bg-background/85 p-5 text-primary backdrop-blur-md"
        style={{ boxShadow: "0 0 40px oklch(0.82 0.18 195 / 0.4)" }}
      >
        <div className="mb-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-primary/70">
          <span>▣ TERMINAL // {PORTFOLIO_DATA.contact.email}</span>
          <span className="hud-blink">●</span>
        </div>
        <label className="block text-[10px] uppercase tracking-widest text-primary/60">&gt; CALLSIGN (NAME)</label>
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
        <label className="block text-[10px] uppercase tracking-widest text-primary/60">&gt; SUBJECT</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
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
          disabled={status === "sending"}
          className="hud-border hud-text w-full rounded-sm bg-primary/15 px-3 py-2 text-xs font-bold transition hover:bg-primary/30 disabled:opacity-50"
        >
          {status === "sending" ? "▲ TRANSMITTING..." : "▲ TRANSMIT"}
        </button>
        {status === "sent" && (
          <p className="mt-2 text-center text-[10px] text-primary">✓ Transmission received. Signal confirmed.</p>
        )}
        {status === "error" && (
          <p className="mt-2 text-center text-[10px] text-red-400">
            ✗ Transmission failed. Check EmailJS configuration.
          </p>
        )}
      </form>

      <div className="flex gap-3">
        <a
          href={PORTFOLIO_DATA.socials.github}
          target="_blank"
          rel="noreferrer"
          className={socialClass}
          aria-label="GitHub"
        >
          <SiGithub size={20} color="#7df9ff" />
        </a>
        <a
          href={PORTFOLIO_DATA.socials.linkedin}
          target="_blank"
          rel="noreferrer"
          className={socialClass}
          aria-label="LinkedIn"
        >
          <TbBrandLinkedin size={20} color="#7df9ff" />
        </a>
        <a
          href={PORTFOLIO_DATA.socials.leetcode}
          target="_blank"
          rel="noreferrer"
          className={socialClass}
          aria-label="LeetCode"
        >
          <span className="hud-text font-bold">LC</span>
        </a>
        <a
          href={PORTFOLIO_DATA.socials.instagram}
          target="_blank"
          rel="noreferrer"
          className={socialClass}
          aria-label="Instagram"
        >
          <SiInstagram size={20} color="#7df9ff" />
        </a>
        <a
          href={`mailto:${PORTFOLIO_DATA.socials.email}`}
          className={socialClass}
          aria-label="Email"
        >
          <span className="hud-text font-bold">@</span>
        </a>
      </div>
    </div>
  );
}

// silence unused
void useTexture;