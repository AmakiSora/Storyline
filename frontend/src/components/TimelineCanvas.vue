<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useTimelineStore } from '../stores/timeline'
import { useTimeScale } from '../composables/useTimeScale'
import { useTimelineZoom } from '../composables/useTimelineZoom'
import { useTimelinePan } from '../composables/useTimelinePan'
import TooltipCard from './TooltipCard.vue'
import TimelineAxis from './TimelineAxis.vue'

const store = useTimelineStore()
const canvasRef = ref<HTMLCanvasElement | null>(null)
const wrapper = ref<HTMLElement | null>(null)
const hover = ref<{ id: string; x: number; y: number } | null>(null)
const startTime = new Date('1999-01-01').getTime()
const { zoom, offsetX, timeToPixel, tickUnit } = useTimeScale()
const { onWheel } = useTimelineZoom(zoom, offsetX)
const pan = useTimelinePan(offsetX)

const visible = computed(() => store.filteredEvents)
const hoveredEvent = computed(() => store.filteredEvents.find(e => e.id === hover.value?.id))
const ticks = computed(() => {
  const unit = tickUnit.value
  const arr: {label:string;x:number}[] = []
  for (let y = 2000; y <= 2026; y += 1) {
    const d = new Date(`${y}-01-01`).getTime(); const x = timeToPixel(d, startTime)
    if ((unit === 'year') || (unit === 'month' && y % 1 === 0)) arr.push({ label: String(y), x })
  }
  return arr
})

const draw = () => {
  const c = canvasRef.value; if (!c) return
  const ctx = c.getContext('2d')!; const { width, height } = c
  ctx.clearRect(0, 0, width, height)
  ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2); ctx.stroke()
  const viewportStart = -120
  const viewportEnd = width + 120
  const lanes = new Map<string, number>()
  visible.value.forEach((e) => {
    const x = timeToPixel(new Date(e.date).getTime(), startTime)
    if (x < viewportStart || x > viewportEnd) return
    const lane = store.mode === 'overlay' ? 0 : (lanes.get(e.person) ?? lanes.size)
    lanes.set(e.person, lane)
    const y = height / 2 + lane * 80
    ctx.fillStyle = e.type === 'album' ? '#60a5fa' : '#fb923c'
    ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill()
  })
}
let raf = 0
const schedule = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw) }

onMounted(() => {
  const c = canvasRef.value!; c.width = c.clientWidth * devicePixelRatio; c.height = c.clientHeight * devicePixelRatio; c.getContext('2d')!.scale(devicePixelRatio, devicePixelRatio); c.width = c.clientWidth; c.height = c.clientHeight
  schedule()
})

const onMove = (e: PointerEvent) => {
  pan.onPointerMove(e)
  const x = e.offsetX
  const hit = visible.value.find(i => Math.abs(timeToPixel(new Date(i.date).getTime(), startTime) - x) < 10)
  hover.value = hit ? { id: hit.id, x: e.clientX, y: e.clientY } : null
  schedule()
}
</script>
<template>
  <div ref="wrapper" class="relative h-[520px] rounded-xl border border-slate-800 bg-slate-950">
    <canvas ref="canvasRef" class="h-full w-full" @wheel.prevent="onWheel($event, $event.offsetX); schedule()" @pointerdown="pan.onPointerDown" @pointerup="pan.onPointerUp" @pointerleave="pan.onPointerUp" @pointermove="onMove" @click="hover && (store.selected = hoveredEvent || null)" />
    <TimelineAxis :ticks="ticks" />
    <TooltipCard v-if="hover && hoveredEvent" :event="hoveredEvent" :x="hover.x" :y="hover.y" />
  </div>
</template>
