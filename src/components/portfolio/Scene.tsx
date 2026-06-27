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
import { PORTFOLIO_DATA, STATION_SPACING } from "../../data";
import profilePic from "../../assets/ProfilePic.png";
import {
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiJavascript,
  SiMongodb,
  SiExpress,
  SiTailwindcss,
  SiPython,
  SiOpenjdk,
  SiFlutter,
  SiOpenai,
  SiGit,
  SiGithub,
  SiDocker,
  SiVercel,
  SiFirebase,
} from "react-icons/si";

/* Premium palette — rich gold, electric violet, deep space */
const C = {
  gold: "#f0c040",
  goldBright: "#ffe566",
  goldSoft: "#d4a843",
  rose: "#ff6b9d",
  violet: "#b06aff",
  violetDeep: "#7c3aed",
  cyan: "#38bdf8",
  bg: "#030014",
  panel: "#0c0620",
  panelEdge: "#1e1040",
  text: "#faf3e0",
  textMuted: "#c4b896",
  glow: "#e8b830",
};

const TECH_ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiJavascript,
  SiMongodb,
  SiExpress,
  SiTailwindcss,
  SiPython,
  SiOpenjdk,
  SiFlutter,
  SiOpenai,
  SiGit,
  SiGithub,
  SiDocker,
  SiVercel,
  SiFirebase,
};

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
  { kind: "contact", label: "GET IN TOUCH" },
];
const STATION_COUNT = STATIONS.length;

/** Portal Html overlays to body so they aren't clipped by canvas overflow-hidden */
const HTML_PORTAL = {
  get current() {
    return typeof document !== "undefined" ? document.body : null;
  },
};

/** Fade overlays in/out — tight peak so only one station dominates at a time */
function useStationOpacity(stationIndex: number) {
  const scroll = useScroll();
  const smoothed = useRef(0);
  const [opacity, setOpacity] = useState(0);

  useFrame((_, delta) => {
    const raw = scroll.offset * (STATION_COUNT - 1);
    const dist = Math.abs(raw - stationIndex);
    const target = dist < 0.3 ? 1 - THREE.MathUtils.smoothstep(0.02, 0.3, dist) : 0;
    smoothed.current = THREE.MathUtils.damp(smoothed.current, target, 14, delta);
    if (Math.abs(smoothed.current - opacity) > 0.005) {
      setOpacity(smoothed.current);
    }
  });

  return { opacity, active: opacity > 0.04 };
}

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
      <color attach="background" args={[C.bg]} />
      <fog attach="fog" args={["#120828", 18, 55]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1.4} color={C.violet} />
      <pointLight position={[-10, -5, -10]} intensity={1.1} color={C.gold} />
      <pointLight position={[0, 8, -20]} intensity={1.0} color={C.rose} />

      <Stars radius={120} depth={80} count={6000} factor={4} saturation={0.15} fade speed={0.5} />

      <Suspense fallback={null}>
        <ScrollControls pages={STATION_COUNT} damping={0.45} maxSpeed={1.5}>
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
  const smoothPos = useRef(new THREE.Vector3(0, 1.55, 9));

  useFrame((_, delta) => {
    const offset = scroll.offset; // 0..1
    const raw = offset * (STATION_COUNT - 1); // 0..(N-1)
    const localT = raw - Math.floor(raw); // 0..1 between stations

    // Brief dwell at each station so every sector gets a clear stop.
    const dock = (t: number) => {
      const hold = 0.1;
      if (t < hold) return 0;
      if (t > 1 - hold) return 1;
      const k = (t - hold) / (1 - 2 * hold);
      return THREE.MathUtils.smootherstep(0, 1, k);
    };
    const docked = Math.floor(raw) + dock(localT);
    const targetZ = -docked * STATION_SPACING;

    tmp.current.set(0, 1.55, targetZ + 9);
    smoothPos.current.x = THREE.MathUtils.damp(smoothPos.current.x, tmp.current.x, 2.6, delta);
    smoothPos.current.y = THREE.MathUtils.damp(smoothPos.current.y, tmp.current.y, 2.6, delta);
    smoothPos.current.z = THREE.MathUtils.damp(smoothPos.current.z, tmp.current.z, 2.6, delta);
    camera.position.copy(smoothPos.current);
    camera.lookAt(0, 1.35, targetZ);

    const stationIndex = Math.max(0, Math.min(STATION_COUNT - 1, Math.round(docked)));

    if (stationIndex !== lastStation.current) {
      lastStation.current = stationIndex;
      onSectorChange(stationIndex, STATIONS[stationIndex].label);
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
                stationIndex={i}
                index={station.index}
                total={PORTFOLIO_DATA.projects.length}
              />
            );
          case "participations":
            return <ParticipationsSector key={i} z={z} stationIndex={i} />;
          case "tech":
            return <TechSector key={i} z={z} stationIndex={i} />;
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
    <Billboard position={[0, 3.6, z]}>
      <Text
        fontSize={0.72}
        color={C.goldBright}
        anchorX="center"
        outlineWidth={0.015}
        outlineColor={C.gold}
      >
        {title}
      </Text>
      {subtitle && (
        <Text position={[0, -0.55, 0]} fontSize={0.24} color={C.textMuted} anchorX="center">
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

/* ------------------------- 3D HUD helpers ------------------------- */
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
        <meshBasicMaterial color={disabled ? C.panel : C.panelEdge} transparent opacity={disabled ? 0.5 : 0.9} />
      </mesh>
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.13}
        color={disabled ? `${C.goldSoft}88` : C.goldBright}
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

/* ------------------------- Intro Station ------------------------- */
function IntroStation({ z }: { z: number }) {
  const { hero } = PORTFOLIO_DATA;
  const ringRef = useRef<THREE.Mesh>(null);
  const portrait = useTexture(profilePic);

  useEffect(() => {
    portrait.colorSpace = THREE.SRGBColorSpace;
  }, [portrait]);

  useFrame((s) => {
    if (ringRef.current) ringRef.current.rotation.z = s.clock.elapsedTime * 0.12;
  });

  return (
    <group position={[0, 0, z]}>
      <Float speed={1.2} rotationIntensity={0.06} floatIntensity={0.3}>
        <group position={[0, 1.3, -2]}>
          <Sphere args={[1.2, 32, 32]} position={[0, 0, -0.2]}>
            <meshBasicMaterial color={C.violet} transparent opacity={0.06} />
          </Sphere>
          <Billboard>
            <mesh position={[0, 0, -0.03]}>
              <ringGeometry args={[1.18, 1.24, 64]} />
              <meshBasicMaterial color={C.violet} transparent opacity={0.25} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <circleGeometry args={[1.05, 64]} />
              <meshBasicMaterial map={portrait} toneMapped={false} />
            </mesh>
            <mesh position={[0, 0, 0.015]}>
              <ringGeometry args={[1.04, 1.07, 64]} />
              <meshBasicMaterial color={C.goldBright} transparent opacity={0.95} side={THREE.DoubleSide} />
            </mesh>
            <mesh ref={ringRef} position={[0, 0, 0.02]}>
              <ringGeometry args={[1.1, 1.12, 64]} />
              <meshBasicMaterial color={C.gold} transparent opacity={0.55} side={THREE.DoubleSide} />
            </mesh>
          </Billboard>
        </group>
      </Float>
      <Billboard position={[0, 3.2, -1]}>
        <Text fontSize={0.85} color={C.goldBright} outlineWidth={0.02} outlineColor={C.gold} anchorX="center">
          {hero.name.toUpperCase()}
        </Text>
        <Text position={[0, -0.65, 0]} fontSize={0.26} color={C.textMuted} anchorX="center" maxWidth={7}>
          {hero.title.toUpperCase()}
        </Text>
      </Billboard>
    </group>
  );
}

type ProjectData = (typeof PORTFOLIO_DATA.projects)[number];

function ProjectCardHtml({
  project,
  index,
  total,
  interactive,
}: {
  project: ProjectData;
  index: number;
  total: number;
  interactive: boolean;
}) {
  const hasLive = Boolean(project.live?.trim());
  return (
    <div className={`project-card-premium ${interactive ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div className="project-card-index">
        PROJECT {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
      <img src={project.img} alt={project.title} />
      <div className="project-card-body">
        <h3 className="project-card-title">{project.title}</h3>
        <p className="project-card-desc">{project.desc}</p>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <span key={t} className="tech-pill">
              {t}
            </span>
          ))}
        </div>
        <div className={`flex gap-2 ${hasLive ? "" : "justify-center"}`}>
          {project.github && (
            <button
              type="button"
              className="project-btn"
              onClick={() => window.open(project.github, "_blank", "noopener,noreferrer")}
            >
              GitHub
            </button>
          )}
          {hasLive && (
            <button
              type="button"
              className="project-btn"
              onClick={() => window.open(project.live, "_blank", "noopener,noreferrer")}
            >
              Live Demo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------- Project Station ------------------------- */
function ProjectStation({
  z,
  stationIndex,
  index,
  total,
}: {
  z: number;
  stationIndex: number;
  index: number;
  total: number;
}) {
  const project = PORTFOLIO_DATA.projects[index];
  const { opacity: cardOpacity, active: cardActive } = useStationOpacity(stationIndex);
  const planetRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const color = useMemo(
    () => new THREE.Color().setHSL((index / total) * 0.75 + 0.52, 0.75, 0.58),
    [index, total],
  );

  useFrame((state) => {
    if (planetRef.current) planetRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    if (ringRef.current) ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
  });

  const planetSide = index % 2 === 0 ? -3.8 : 3.8;

  return (
    <group position={[0, 0, z]}>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
        <group position={[planetSide, 1.4, -2.5]}>
          <Sphere ref={planetRef} args={[1.1, 48, 48]}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.55 * cardOpacity}
              roughness={0.3}
              metalness={0.25}
              transparent
              opacity={Math.max(0.15, cardOpacity)}
            />
          </Sphere>
          <Torus ref={ringRef} args={[1.8, 0.025, 16, 80]} rotation={[Math.PI / 2.3, 0, 0]}>
            <meshBasicMaterial color={color} transparent opacity={0.75 * cardOpacity} />
          </Torus>
        </group>
      </Float>

      {cardActive && (
        <Html
          position={[0, 1.35, -1]}
          center
          portal={HTML_PORTAL}
          zIndexRange={[100, 200]}
          style={{
            pointerEvents: "none",
            opacity: cardOpacity,
            transition: "opacity 0.12s ease-out",
          }}
        >
          <ProjectCardHtml
            project={project}
            index={index}
            total={total}
            interactive={cardOpacity > 0.85}
          />
        </Html>
      )}
    </group>
  );
}

/* ------------------------- Sector 2: Participations (carousel) ------------------------- */
function ParticipationsSector({ z, stationIndex }: { z: number; stationIndex: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const { opacity: sectorOpacity, active: sectorActive } = useStationOpacity(stationIndex);
  const items = PORTFOLIO_DATA.participations;
  const radius = 4.5;

  useFrame((state) => {
    if (groupRef.current && sectorActive) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.25;
    }
  });

  return (
    <group position={[0, 0, z]}>
      <SectorTitle z={0} title="PARTICIPATIONS GALLERY" subtitle="HACKATHONS & EVENTS" />

      {sectorActive && (
        <>
          <Billboard position={[0, 2.85, 0]}>
            <Text fontSize={0.2} color={C.goldSoft} anchorX="center" fillOpacity={0.9 * sectorOpacity}>
              CLICK ON AN IMAGE TO VIEW EVENT DETAILS
            </Text>
          </Billboard>

          <Sphere args={[1.6, 48, 48]} position={[0, 1, -2]}>
            <meshStandardMaterial
              color={C.panel}
              emissive={C.violetDeep}
              emissiveIntensity={0.35 * sectorOpacity}
              roughness={0.45}
              transparent
              opacity={Math.max(0.2, sectorOpacity)}
            />
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
                      opacity={sectorOpacity}
                    />
                    <mesh
                      position={[0, 0, 0.03]}
                      onClick={
                        sectorOpacity > 0.6
                          ? (e) => {
                              e.stopPropagation();
                              openLinkedIn();
                            }
                          : undefined
                      }
                      onPointerOver={() => {
                        if (sectorOpacity > 0.6) document.body.style.cursor = "pointer";
                      }}
                      onPointerOut={() => {
                        document.body.style.cursor = "auto";
                      }}
                    >
                      <planeGeometry args={[2.6, 1.7]} />
                      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
                    </mesh>
                    <Text position={[0, -1.1, 0.01]} fontSize={0.2} color={C.goldBright} anchorX="center" fillOpacity={sectorOpacity}>
                      {p.title.toUpperCase()}
                    </Text>
                    <HudButton3D
                      label="▸ LINKEDIN"
                      position={[0, -1.55, 0.02]}
                      onClick={sectorOpacity > 0.6 ? openLinkedIn : undefined}
                      disabled={sectorOpacity <= 0.6}
                    />
                  </Billboard>
                </group>
              );
            })}
          </group>
        </>
      )}
    </group>
  );
}

/* ------------------------- Sector 3: Tech Galaxy ------------------------- */

type TechItem = (typeof PORTFOLIO_DATA.techStack)[number];

function TechOrbitDot({
  index,
  total,
  tech,
  active,
}: {
  index: number;
  total: number;
  tech: TechItem;
  active: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const Icon = TECH_ICON_MAP[tech.icon];
  const color = useMemo(
    () => new THREE.Color().setHSL((index / total) * 0.8 + 0.55, 0.7, 0.55),
    [index, total],
  );
  const orbit = useMemo(() => {
    const layer = index % 3;
    return {
      radius: 2.5 + layer * 1.5,
      speed: 0.1 + (index % 5) * 0.03,
      phase: (index / total) * Math.PI * 2,
      yAmp: 0.4 + layer * 0.2,
    };
  }, [index, total]);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime * orbit.speed + orbit.phase;
    groupRef.current.position.set(
      Math.cos(t) * orbit.radius,
      Math.sin(t * 0.7) * orbit.yAmp,
      Math.sin(t) * orbit.radius * 0.6,
    );
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshBasicMaterial color={color} transparent opacity={0.45} />
      </mesh>
      {active && (
        <Billboard>
          <Html center portal={HTML_PORTAL} distanceFactor={14} zIndexRange={[90, 200]} style={{ pointerEvents: "none" }}>
            <div className="tech-orbit-badge" title={tech.name}>
              {Icon ? <Icon size={24} color={tech.color} /> : <span style={{ color: tech.color }}>{tech.name.slice(0, 2)}</span>}
            </div>
          </Html>
        </Billboard>
      )}
    </group>
  );
}

function TechSector({ z, stationIndex }: { z: number; stationIndex: number }) {
  const { opacity: sectorOpacity, active: sectorActive } = useStationOpacity(stationIndex);
  const items = PORTFOLIO_DATA.techStack;
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (coreRef.current && sectorActive) {
      coreRef.current.rotation.y = state.clock.elapsedTime * 0.25;
      const pulse = 0.6 + Math.sin(state.clock.elapsedTime * 1.2) * 0.2;
      (coreRef.current.material as THREE.MeshBasicMaterial).opacity = pulse * sectorOpacity;
    }
  });

  return (
    <group position={[0, 0, z]}>
      <SectorTitle z={0} title="TECH GALAXY" subtitle="STACK & TOOLING" />
      {sectorActive && (
        <group position={[0, 0.75, -2]}>
          {items.map((tech, i) => (
            <TechOrbitDot
              key={tech.name}
              index={i}
              total={items.length}
              tech={tech}
              active={sectorOpacity > 0.4}
            />
          ))}
          <Sphere ref={coreRef} args={[0.7, 32, 32]}>
            <meshBasicMaterial color={C.gold} transparent opacity={0.65 * sectorOpacity} />
          </Sphere>
          <Torus args={[3.2, 0.015, 16, 80]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color={C.violet} transparent opacity={0.35 * sectorOpacity} />
          </Torus>
        </group>
      )}
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

      <Sphere ref={coreRef} args={[2, 64, 64]} position={[0, 1.15, -2]}>
        <meshStandardMaterial
          color={C.gold}
          emissive={C.violet}
          emissiveIntensity={1.0}
          roughness={0.15}
          metalness={0.65}
          wireframe
        />
      </Sphere>
      <Sphere args={[2.4, 32, 32]} position={[0, 1.15, -2]}>
        <meshBasicMaterial color={C.gold} transparent opacity={0.08} />
      </Sphere>

      <Billboard position={[-3.5, 1.45, 0]}>
        <Text fontSize={0.3} color={C.goldSoft} anchorX="center">CGPA</Text>
        <AnimatedNumber target={9.58} position={[0, -0.7, 0]} suffix="" decimals={2} size={1.1} />
      </Billboard>
      <Billboard position={[3.5, 1.45, 0]}>
        <Text fontSize={0.3} color={C.goldSoft} anchorX="center">LEETCODE</Text>
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
      color={C.goldBright}
      anchorX="center"
      outlineWidth={0.025}
      outlineColor={C.gold}
    >
      0{suffix}
    </Text>
  );
}

/* ------------------------- Sector 5: Contact (3D backdrop only — UI in ContactOverlay) ------------------------- */
function ContactSector({ z }: { z: number }) {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (ringRef.current) ringRef.current.rotation.z = s.clock.elapsedTime * 0.12;
  });

  return (
    <group position={[0, 0, z]}>
      <Float speed={0.8} rotationIntensity={0.1} floatIntensity={0.2}>
        <group position={[0, 1.4, -2]}>
          <Torus ref={ringRef} args={[2.8, 0.04, 16, 80]} rotation={[Math.PI / 2, 0, 0]}>
            <meshBasicMaterial color={C.gold} transparent opacity={0.7} />
          </Torus>
          <Sphere args={[0.9, 32, 32]}>
            <meshStandardMaterial
              color={C.violetDeep}
              emissive={C.violet}
              emissiveIntensity={0.8}
              roughness={0.2}
            />
          </Sphere>
        </group>
      </Float>
    </group>
  );
}
