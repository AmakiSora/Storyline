<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from 'vue'
import { storeToRefs } from 'pinia'
import { useEventsStore } from '@/stores/events'
import { useTimelineViewStore } from '@/stores/timelineView'
import { useElementSize } from '@/composables/useElementSize'
import { useTimeScale } from '@/composables/useTimeScale'
import { useTimelineZoom } from '@/composables/useTimelineZoom'
import { useTimelinePan } from '@/composables/useTimelinePan'
import { dateStringToUtcMs } from '@/lib/time'
import TimelineAxis from './TimelineAxis.vue'
import TimelineEvents, { type HitPoint } from './TimelineEvents.vue'
import TooltipCard from './TooltipCard.vue'

const store = useEventsStore()
const viewStore = useTimelineViewStore()
const { originMs, scale, offset } = storeToRefs(viewStore)

const wrapperRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const { width } = useElementSize(wrapperRef)

const axisHeight = 56
const canvasWidth = computed(() => width.value)

const laneCount = computed(() => {
  if (store.mode === 'overlay') return 1
  return Math.max(1, new Set(store.events.map((e) => e.person)).size)
})

const eventsCanvasHeight = computed(() => {
  const topPad = 22
  const laneH = 80
  return topPad * 2 + laneCount.value * laneH
})

const timeScale = useTimeScale({
  originMs,
  scale,
  offset,
  width: canvasWidth,
})

const visible = computed(() => timeScale.visibleRange(canvasWidth.value))

const { zoomAt } = useTimelineZoom({
  originMs,
  scale,
  offset,
  minScale: viewStore.minScale,
  maxScale: viewStore.maxScale,
})

const pan = useTimelinePan({ offset })
let wheelRaf = 0
let pendingWheel = 0
let pendingWheelX = 0

const hitPoints = ref<HitPoint[]>([])
const hoveredId = ref<string | null>(null)
const tooltipPos = ref<{ x: number; y: number } | null>(null)

const hoveredEvent = computed(() => {
  if (!hoveredId.value) return null
  return store.events.find((e) => e.id === hoveredId.value) ?? null
})

function localXFromEvent(e: WheelEvent | PointerEvent | MouseEvent) {
  const el = wrapperRef.value
  if (!el) return 0
  const rect = el.getBoundingClientRect()
  return e.clientX - rect.left
}

function localYFromEvent(e: WheelEvent | PointerEvent | MouseEvent) {
  const el = wrapperRef.value
  if (!el) return 0
  const rect = el.getBoundingClientRect()
  return e.clientY - rect.top
}

function findHit(x: number, y: number) {
  for (let i = 0; i < hitPoints.value.length; i++) {
    const p = hitPoints.value[i]
    const dx = x - p.x
    const dy = y - p.y
    if (dx * dx + dy * dy <= p.r * p.r) return p.id
  }
  return null
}

function onWheel(e: WheelEvent) {
  e.preventDefault()
  const lx = localXFromEvent(e)
  pendingWheel += e.deltaY
  pendingWheelX = lx
  if (wheelRaf) return
  wheelRaf = requestAnimationFrame(() => {
    wheelRaf = 0
    const factor = Math.exp(-pendingWheel * 0.0012)
    pendingWheel = 0
    zoomAt(pendingWheelX, factor)
  })
}

function onPointerDown(e: PointerEvent) {
  ;(e.currentTarget as HTMLElement | null)?.setPointerCapture?.(e.pointerId)
  pan.onPointerDown(e)
}

function onPointerMove(e: PointerEvent) {
  const lx = localXFromEvent(e)
  const ly = localYFromEvent(e)
  const scrollTop = scrollRef.value?.scrollTop ?? 0
  const id = findHit(lx, ly - axisHeight + scrollTop)
  hoveredId.value = id
  tooltipPos.value = id ? { x: lx, y: ly + 10 } : null
  pan.onPointerMove(e)
}

function onPointerUp() {
  pan.onPointerUp()
}

function onHitPoints(points: HitPoint[]) {
  hitPoints.value = points
}

function onClick(e: MouseEvent) {
  const lx = localXFromEvent(e)
  const ly = localYFromEvent(e)
  const scrollTop = scrollRef.value?.scrollTop ?? 0
  const id = findHit(lx, ly - axisHeight + scrollTop)
  store.select(id)
}

function zoomIn() {
  zoomAt(canvasWidth.value * 0.5, 1.2)
}

function zoomOut() {
  zoomAt(canvasWidth.value * 0.5, 1 / 1.2)
}

const fitted = ref(false)

watchEffect(() => {
  const w = canvasWidth.value
  const len = store.events.length
  if (!w || len < 2 || fitted.value) return
  const msList = store.events.map((e) => dateStringToUtcMs(e.date)).sort((a, b) => a - b)
  viewStore.resetToRange({ fromMs: msList[0], toMs: msList[msList.length - 1] }, w)
  fitted.value = true
})

onMounted(async () => {
  fitted.value = false
  await store.refresh()
})

defineExpose({ zoomIn, zoomOut })
</script>

<template>
  <div ref="wrapperRef" class="relative h-full w-full select-none overflow-hidden">
    <div
      class="absolute left-0 top-0 z-10 w-full border-b border-white/10 bg-zinc-950/30"
      :style="{ height: `${axisHeight}px` }"
    >
      <TimelineAxis :width="canvasWidth" :height="axisHeight" :ticks="timeScale.ticks.value" />
    </div>

    <div
      ref="scrollRef"
      class="absolute left-0 right-0 bottom-0 top-0 overflow-auto"
      :style="{ paddingTop: `${axisHeight}px` }"
    >
      <div class="relative" :style="{ width: `${canvasWidth}px`, height: `${eventsCanvasHeight}px` }">
        <TimelineEvents
          :width="canvasWidth"
          :height="eventsCanvasHeight"
          :events="store.events"
          :mode="store.mode"
          :visibleFromMs="visible.fromMs"
          :visibleToMs="visible.toMs"
          :timeToX="timeScale.timeToX"
          :selectedId="store.selectedId"
          @hitPoints="onHitPoints"
        />
      </div>
    </div>

    <div
      class="absolute inset-0 z-20"
      @wheel="onWheel"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="onPointerUp"
      @pointercancel="onPointerUp"
      @click="onClick"
    />

    <TooltipCard v-if="hoveredEvent && tooltipPos" :event="hoveredEvent" :x="tooltipPos.x" :y="tooltipPos.y" />

    <div
      v-if="store.error"
      class="absolute bottom-3 left-3 z-30 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200"
    >
      后端未连接，已使用内置示例数据（{{ store.error }}）
    </div>
  </div>
</template>

