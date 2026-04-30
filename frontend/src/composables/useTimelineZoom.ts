import { throttle } from '../utils/throttle'

export function useTimelineZoom(zoom: { value: number }, offsetX: { value: number }, min = 0.5, max = 20) {
  const onWheel = throttle((e: WheelEvent, anchorX: number) => {
    const factor = e.deltaY < 0 ? 1.12 : 0.88
    const next = Math.min(max, Math.max(min, zoom.value * factor))
    const scale = next / zoom.value
    // 以鼠标为中心缩放：保持鼠标下时间点不漂移
    offsetX.value = anchorX - (anchorX - offsetX.value) * scale
    zoom.value = next
  }, 16)
  return { onWheel }
}
