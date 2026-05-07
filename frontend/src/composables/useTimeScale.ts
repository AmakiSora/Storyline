import { computed, ref } from 'vue'

export function useTimeScale() {
  const zoom = ref(1)
  const offsetX = ref(0)
  const basePixelsPerDay = 0.8
  const pixelsPerDay = computed(() => basePixelsPerDay * zoom.value)

  // 时间 -> 像素
  const timeToPixel = (time: number, startTime: number) => (time - startTime) / 86400000 * pixelsPerDay.value + offsetX.value
  // 像素 -> 时间
  const pixelToTime = (px: number, startTime: number) => startTime + ((px - offsetX.value) / pixelsPerDay.value) * 86400000

  const tickUnit = computed(() => {
    if (zoom.value < 1.5) return 'year'
    if (zoom.value < 6) return 'month'
    return 'day'
  })
  return { zoom, offsetX, pixelsPerDay, tickUnit, timeToPixel, pixelToTime }
}
