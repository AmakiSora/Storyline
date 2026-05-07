import type { Ref } from 'vue'

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

export function useTimelineZoom(params: {
  originMs: Ref<number>
  scale: Ref<number>
  offset: Ref<number>
  minScale: number
  maxScale: number
}) {
  const { originMs, scale, offset, minScale, maxScale } = params

  const xToTime = (x: number) => (x - offset.value) / scale.value + originMs.value

  function zoomAt(x: number, factor: number) {
    const t = xToTime(x)
    const nextScale = clamp(scale.value * factor, minScale, maxScale)
    if (nextScale === scale.value) return

    scale.value = nextScale
    offset.value = x - (t - originMs.value) * nextScale
  }

  return { zoomAt }
}

