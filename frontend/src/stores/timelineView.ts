import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useTimelineViewStore = defineStore('timelineView', () => {
  const originMs = ref(0)
  const scale = ref(1 / (24 * 60 * 60 * 1000) * 120)
  const offset = ref(80)

  const minScale = 1 / (24 * 60 * 60 * 1000) * 0.5
  const maxScale = 1 / (24 * 60 * 60 * 1000) * 800

  const msPerPx = computed(() => 1 / scale.value)

  function resetToRange(range: { fromMs: number; toMs: number }, width: number) {
    const padding = 120
    const usable = Math.max(200, width - padding * 2)
    const duration = Math.max(1, range.toMs - range.fromMs)
    const nextScale = usable / duration
    scale.value = Math.min(maxScale, Math.max(minScale, nextScale))
    originMs.value = 0
    offset.value = padding - range.fromMs * scale.value
  }

  return { originMs, scale, offset, minScale, maxScale, msPerPx, resetToRange }
})

