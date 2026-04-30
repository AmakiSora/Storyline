<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'

const props = defineProps<{
  width: number
  height: number
  ticks: Array<{ x: number; label: string; kind: 'year' | 'month' | 'day' }>
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
let raf = 0

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

  ctx.strokeStyle = 'rgba(255,255,255,0.10)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(0, h - 1)
  ctx.lineTo(w, h - 1)
  ctx.stroke()

  ctx.font = '12px "IBM Plex Sans", ui-sans-serif'
  ctx.textBaseline = 'top'

  for (const t of props.ticks) {
    const x = Math.round(t.x) + 0.5
    ctx.strokeStyle = t.kind === 'day' ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.12)'
    ctx.beginPath()
    ctx.moveTo(x, h - 10)
    ctx.lineTo(x, h - 1)
    ctx.stroke()

    ctx.fillStyle = 'rgba(228,228,231,0.9)'
    ctx.fillText(t.label, Math.round(t.x) + 6, 8)
  }
}

watchEffect(() => {
  void props.width
  void props.height
  void props.ticks
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

