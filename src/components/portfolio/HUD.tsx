import { useEffect, useState } from "react";
import { PORTFOLIO_DATA } from "./data";

interface HUDProps {
  currentSector: number;
  currentLabel: string;
}

export function HUD({ currentSector, currentLabel }: HUDProps) {
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

  const totalSectors = PORTFOLIO_DATA.sectors.length;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 scanlines">
      {/* Corner brackets */}
      <Corner pos="top-left" />
      <Corner pos="top-right" />
      <Corner pos="bottom-left" />
      <Corner pos="bottom-right" />

      {/* Top bar */}
      <div className="pointer-events-auto absolute left-0 right-0 top-0 flex items-center justify-between gap-4 px-4 py-3 sm:px-8">
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
          className="hud-border hud-text rounded-sm bg-background/40 px-3 py-1.5 text-[10px] sm:text-xs font-bold backdrop-blur-sm transition-all hover:bg-primary/15 hover:shadow-[0_0_20px_oklch(0.82_0.18_195/0.6)]"
        >
          ▼ DOWNLOAD RESUME
        </a>
      </div>

      {/* Left rail – sector index */}
      <div className="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 flex-col gap-3 md:flex">
        {PORTFOLIO_DATA.sectors.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`h-px transition-all ${
                i === currentSector
                  ? "w-10 bg-primary shadow-[0_0_8px_currentColor]"
                  : "w-4 bg-primary/30"
              }`}
            />
            <span
              className={`hud-mono text-[10px] uppercase tracking-widest transition-colors ${
                i === currentSector ? "text-primary" : "text-primary/40"
              }`}
            >
              S{String(i + 1).padStart(2, "0")}
            </span>
          </div>
        ))}
      </div>

      {/* Right rail – stats */}
      <div className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex">
        <StatBlock label="CGPA" value={PORTFOLIO_DATA.stats.cgpa} />
        <StatBlock label="LEETCODE" value={PORTFOLIO_DATA.stats.leetcode} />
        <StatBlock label="SECTOR" value={`${currentSector + 1}/${totalSectors}`} />
      </div>

      {/* Bottom bar – sector tracker */}
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-4 px-4 py-3 sm:px-8">
        <div className="hud-border hud-mono pointer-events-auto rounded-sm bg-background/50 px-3 py-2 text-[10px] uppercase tracking-widest text-primary backdrop-blur-sm">
          <div className="text-primary/50 text-[9px]">SECTOR TRACKER</div>
          <div className="hud-text text-sm font-bold">▣ {currentLabel}</div>
        </div>
        <div className="hud-mono hidden text-right text-[10px] uppercase tracking-widest text-primary/60 sm:block">
          <div>SCROLL TO NAVIGATE ↓</div>
          <div className="text-primary/40">DRAG TO ORBIT</div>
        </div>
      </div>

      {/* Center crosshair */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative h-16 w-16 opacity-30">
          <div className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-primary" />
          <div className="absolute left-1/2 bottom-0 h-3 w-px -translate-x-1/2 bg-primary" />
          <div className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-primary" />
          <div className="absolute top-1/2 right-0 h-px w-3 -translate-y-1/2 bg-primary" />
        </div>
      </div>
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
      style={{ boxShadow: "0 0 8px oklch(0.82 0.18 195 / 0.6)" }}
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