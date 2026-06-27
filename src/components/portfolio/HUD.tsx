import { useEffect, useState } from "react";
import { PORTFOLIO_DATA } from "../../data";

interface HUDProps {
  currentSector: number;
  currentLabel: string;
  totalStations: number;
  scrollHint?: string;
}

export function HUD({ currentSector, currentLabel, totalStations, scrollHint }: HUDProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(
        `${d.getUTCHours().toString().padStart(2, "0")}:${d
          .getUTCMinutes()
          .toString()
          .padStart(2, "0")}:${d.getUTCSeconds().toString().padStart(2, "0")} UTC`,
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const totalSectors = totalStations;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 scanlines">
      {/* Corner brackets — decorative only, inset from edges */}
      <Corner pos="top-left" />
      <Corner pos="top-right" />
      <Corner pos="bottom-left" />
      <Corner pos="bottom-right" />

      {/* Top bar — compact, does not cover scene center */}
      <div className="pointer-events-auto absolute left-0 right-0 top-0 flex items-center justify-between gap-4 px-4 py-2 sm:px-8 sm:py-3">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-primary hud-blink shadow-[0_0_12px_currentColor]" />
          <span className="hud-text text-xs sm:text-sm font-bold">
            ABEER PATHELA <span className="opacity-60">//</span> SYSTEM ACTIVE
          </span>
        </div>
        <div className="hidden md:flex hud-mono text-[10px] uppercase tracking-widest text-primary/70">
          {time}
        </div>
        <a
          href={PORTFOLIO_DATA.stats.resume}
          download
          className="hud-border hud-text rounded-sm bg-background/40 px-3 py-1.5 text-[10px] sm:text-xs font-bold backdrop-blur-sm transition-all hover:bg-primary/15 hover:shadow-[0_0_20px_oklch(0.82_0.13_75/0.5)]"
        >
          ▼ DOWNLOAD RESUME
        </a>
      </div>

      {/* Left rail – station progress dots */}
      <div className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-1.5 md:flex">
        <span className="hud-mono mb-2 text-[9px] uppercase tracking-widest text-primary/60">
          STN
        </span>
        {Array.from({ length: totalStations }).map((_, i) => (
          <div
            key={i}
            className={`transition-all ${
              i === currentSector
                ? "h-2.5 w-2.5 rounded-full bg-primary shadow-[0_0_10px_currentColor]"
                : i < currentSector
                ? "h-1.5 w-1.5 rounded-full bg-primary/70"
                : "h-1.5 w-1.5 rounded-full bg-primary/25"
            }`}
          />
        ))}
      </div>

      {/* Right rail – stats */}
      <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex">
        <StatBlock label="CGPA" value={PORTFOLIO_DATA.stats.cgpa} />
        <StatBlock label="LEETCODE" value={PORTFOLIO_DATA.stats.leetcode} />
        <StatBlock label="SECTOR" value={`${currentSector + 1}/${totalSectors}`} />
      </div>

      {/* Bottom dock bar — scroll hint lives here, never over hero name */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center gap-2 px-4 pb-3 pt-8 sm:pb-4 bg-gradient-to-t from-background/85 via-background/30 to-transparent">
        {currentSector === 0 && scrollHint && (
          <div className="scroll-hint hud-mono pointer-events-none text-center text-[10px] uppercase tracking-[0.25em] text-primary/70 sm:text-xs">
            {scrollHint}
            <span className="mt-1 block animate-bounce text-primary">↓</span>
          </div>
        )}
        <div className="flex w-full items-end justify-between gap-4 sm:px-4">
          <div className="hud-border hud-mono pointer-events-auto max-w-[min(100%,20rem)] rounded-sm bg-background/60 px-3 py-1.5 text-[10px] uppercase tracking-widest text-primary backdrop-blur-sm">
            <div className="text-primary/45 text-[8px] sm:text-[9px]">NOW VIEWING</div>
            <div className="hud-text truncate text-xs sm:text-sm font-bold">▣ {currentLabel}</div>
          </div>
          <div className="hud-mono hidden pb-0.5 text-right text-[9px] uppercase tracking-widest text-primary/45 sm:block">
            <div>{currentSector === totalStations - 1 ? "SCROLL ↑" : "SCROLL ↓"}</div>
          </div>
        </div>
      </div>

      {/* Reticle removed — was overlapping content */}
    </div>
  );
}

function Corner({ pos }: { pos: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const map: Record<string, string> = {
    "top-left": "top-2 left-2 border-t-2 border-l-2",
    "top-right": "top-2 right-2 border-t-2 border-r-2",
    "bottom-left": "bottom-2 left-2 border-b-2 border-l-2",
    "bottom-right": "bottom-2 right-2 border-b-2 border-r-2",
  };
  return (
    <div
      className={`absolute h-6 w-6 border-primary corner-pulse ${map[pos]}`}
      style={{ boxShadow: "0 0 8px oklch(0.82 0.13 75 / 0.45)" }}
    />
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="hud-border hud-mono rounded-sm bg-background/40 px-3 py-2 text-right backdrop-blur-sm">
      <div className="text-[9px] uppercase tracking-widest text-primary/50">{label}</div>
      <div className="hud-text text-lg font-bold">{value}</div>
    </div>
  );
}