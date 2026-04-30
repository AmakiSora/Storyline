export function useTimelinePan(offsetX: { value: number }) {
  let dragging = false
  let lastX = 0
  const onPointerDown = (e: PointerEvent) => { dragging = true; lastX = e.clientX }
  const onPointerMove = (e: PointerEvent) => { if (!dragging) return; offsetX.value += e.clientX - lastX; lastX = e.clientX }
  const onPointerUp = () => { dragging = false }
  return { onPointerDown, onPointerMove, onPointerUp }
}
