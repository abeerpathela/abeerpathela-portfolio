import { lazy, Suspense, useEffect, useState } from "react";
import { HUD } from "./HUD";
import { PORTFOLIO_DATA } from "./data";

const Scene = lazy(() => import("./Scene").then((m) => ({ default: m.Scene })));

export function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [sector, setSector] = useState(0);
  const [label, setLabel] = useState(PORTFOLIO_DATA.sectors[0]);

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
      <HUD currentSector={sector} currentLabel={label} />
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