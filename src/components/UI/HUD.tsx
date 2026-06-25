import './HUD.css'

type HUDProps = {
  scrollProgress: number
  mode: string
}

export function HUD({ scrollProgress, mode }: HUDProps) {
  const distance = Math.round(scrollProgress * 100)

  return (
    <div className="hud" aria-live="polite">
      <div className="hud__panel">
        <p className="hud__label">Scanner Mode</p>
        <p className="hud__mode">{mode}</p>
      </div>
      <div className="hud__panel hud__panel--right">
        <p className="hud__label">Distance Traveled</p>
        <p className="hud__value">{distance}%</p>
        <div className="hud__track">
          <div className="hud__fill" style={{ width: `${distance}%` }} />
        </div>
      </div>
    </div>
  )
}
