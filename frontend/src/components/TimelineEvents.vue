<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import type { TimelineEvent, TimelineMode } from '@/types/event'
import { dateStringToUtcMs } from '@/lib/time'
import { lowerBound, upperBound } from '@/lib/binarySearch'

export type HitPoint = {
  id: string
  x: number
  y: number
  r: number
}

const props = defineProps<{
  width: number
  height: number
  events: TimelineEvent[]
  mode: TimelineMode
  visibleFromMs: number
  visibleToMs: number
  timeToX: (ms: number) => number
  selectedId: string | null
}>()

const emit = defineEmits<{
  (e: 'hitPoints', points: HitPoint[]): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let raf = 0

const eventsWithMs = computed(() =>
  props.events.map((e) => ({
    e,
    ms: dateStringToUtcMs(e.date),
  })),
)

const typeColors = {
  专辑发布: { fill: 'rgba(56,189,248,0.95)', glow: 'rgba(56,189,248,0.35)' },
  演唱会历程: { fill: 'rgba(251,146,60,0.95)', glow: 'rgba(251,146,60,0.35)' },
} as const

function getColor(type: string) {
  return typeColors[type as keyof typeof typeColors] ?? {
    fill: 'rgba(167,139,250,0.95)',
    glow: 'rgba(167,139,250,0.35)',
  }
}

function draw() {
  raf = 0
  const canvas = canvasRef.value
  if (!canvas) return

  const dpr = window.devicePixelRatio || 1
  const w = Math.max(1, Math.floor(props.width))
  const h = Math.max(1, Math.floor(props.height))

  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`

  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)

  const labelW = 160
  const topPad = 22
  const laneH = 80

  const persons = props.mode === 'lane' ? Array.from(new Set(props.events.map((e) => e.person))).sort() : []
  const lanes = props.mode === 'lane' ? persons : ['overlay']

  const hitPoints: HitPoint[] = []

  ctx.font = '12px "IBM Plex Sans", ui-sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'rgba(228,228,231,0.85)'

  for (let i = 0; i < lanes.length; i++) {
    const y = topPad + i * laneH + laneH / 2

    ctx.strokeStyle = 'rgba(255,255,255,0.10)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(labelW, y)
    ctx.lineTo(w, y)
    ctx.stroke()

    if (props.mode === 'lane') {
      ctx.fillStyle = 'rgba(228,228,231,0.78)'
      ctx.fillText(lanes[i], 14, y)
    }
  }

  const sorted = eventsWithMs.value.slice().sort((a, b) => a.ms - b.ms)
  const startIdx = lowerBound(sorted, (v) => v.ms >= props.visibleFromMs)
  const endIdx = upperBound(sorted, (v) => v.ms <= props.visibleToMs)

  for (let i = startIdx; i < endIdx; i++) {
    const item = sorted[i]
    const ev = item.e
    const x = props.timeToX(item.ms)
    if (x < labelW - 40 || x > w + 40) continue

    const laneIndex = props.mode === 'lane' ? Math.max(0, persons.indexOf(ev.person)) : 0
    const y = topPad + laneIndex * laneH + laneH / 2

    const isSelected = props.selectedId === ev.id
    const r = isSelected ? 8 : 6
    const { fill, glow } = getColor(ev.type)

    ctx.save()
    ctx.shadowBlur = isSelected ? 18 : 12
    ctx.shadowColor = glow
    ctx.fillStyle = fill
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()

    ctx.strokeStyle = 'rgba(255,255,255,0.22)'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(x, y, r + 2, 0, Math.PI * 2)
    ctx.stroke()

    hitPoints.push({ id: ev.id, x, y, r: r + 6 })

    if (props.mode === 'overlay') {
      ctx.fillStyle = 'rgba(228,228,231,0.82)'
      ctx.textBaseline = 'bottom'
      ctx.fillText(ev.title, x + 10, y - 10)
      ctx.textBaseline = 'middle'
    }
  }

  emit('hitPoints', hitPoints)
}

watchEffect(() => {
  void props.width
  void props.height
  void props.events
  void props.visibleFromMs
  void props.visibleToMs
  void props.mode
  void props.selectedId
  if (raf) cancelAnimationFrame(raf)
  raf = requestAnimationFrame(draw)
})

onMounted(() => {
  raf = requestAnimationFrame(draw)
})

onBeforeUnmount(() => {
  if (raf) cancelAnimationFrame(raf)
})
</script>

<template>
  <canvas ref="canvasRef" class="block" />
</template>

