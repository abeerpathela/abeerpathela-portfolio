import { lazy, Suspense, useEffect, useState } from "react";
import { HUD } from "./HUD";
import { ContactOverlay } from "./ContactOverlay";
import { PORTFOLIO_DATA } from "../../data";

// 1 intro + 9 projects + participations + tech + achievements + contact = 14
const TOTAL_STATIONS = 1 + PORTFOLIO_DATA.projects.length + 4;
const CONTACT_STATION = TOTAL_STATIONS - 1;

const Scene = lazy(() => import("./Scene").then((m) => ({ default: m.Scene })));

export function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [sector, setSector] = useState(0);
  const [label, setLabel] = useState("MISSION BRIEFING");

  useEffect(() => setMounted(true), []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-background text-foreground">
      {mounted ? (
        <Suspense fallback={<BootScreen />}>
          <Scene
            onSectorChange={(i, l) => {
              setSector(i);
              setLabel(l);
            }}
          />
        </Suspense>
      ) : (
        <BootScreen />
      )}
      <ContactOverlay visible={sector === CONTACT_STATION} />
      <HUD
        currentSector={sector}
        currentLabel={label}
        totalStations={TOTAL_STATIONS}
        scrollHint={PORTFOLIO_DATA.hero.scrollText}
      />
    </main>
  );
}

function BootScreen() {
  return (
    <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-background">
      <div className="hud-text text-lg font-bold tracking-[0.4em] hud-blink">
        CALIBRATING TELESCOPE...
      </div>
      <div className="hud-mono text-[10px] uppercase tracking-widest text-primary/60">
        Initializing astrometric grid · Loading 3D engine
      </div>
      <div className="hud-border h-1 w-64 overflow-hidden rounded-sm bg-background/50">
        <div className="h-full w-1/3 animate-[slide-in-right_1.4s_ease-in-out_infinite] bg-primary shadow-[0_0_12px_currentColor]" />
      </div>
    </div>
  );
}