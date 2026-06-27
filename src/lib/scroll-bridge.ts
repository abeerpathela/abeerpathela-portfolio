/** Find the drei ScrollControls container that sits over the canvas. */
export function getScrollContainer(): HTMLElement | null {
  const canvas = document.querySelector("canvas");
  if (!canvas?.parentElement) return null;

  for (const child of canvas.parentElement.children) {
    if (!(child instanceof HTMLDivElement)) continue;
    const style = getComputedStyle(child);
    if (style.overflowY === "auto" || style.overflowY === "scroll") {
      return child;
    }
  }
  return null;
}

/** Forward wheel events to the 3D scroll container (used when overlays block native scroll). */
export function forwardWheelToScroll(deltaY: number) {
  const scrollEl = getScrollContainer();
  if (!scrollEl) return;
  const max = scrollEl.scrollHeight - scrollEl.clientHeight;
  scrollEl.scrollTop = Math.max(0, Math.min(max, scrollEl.scrollTop + deltaY));
}
