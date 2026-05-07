<template>
  <div
    ref="containerRef"
    class="relative w-full h-full overflow-hidden select-none"
    :class="{ 'cursor-grab': !isDragging, 'cursor-grabbing': isDragging }"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
    @wheel="onWheel"
  >
    <!-- Canvas 渲染层 -->
    <canvas
      ref="canvasRef"
      class="absolute inset-0"
      :width="canvasWidth"
      :height="canvasHeight"
    />

    <!-- Tooltip 悬浮卡片 -->
    <TooltipCard
      v-if="hoveredEvent"
      :event="hoveredEvent"
      :x="tooltipX"
      :y="tooltipY"
      @click.stop
    />

    <!-- 加载状态 -->
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-dark-bg/80">
      <div class="text-dark-text">加载中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref, computed, watch, onMounted, onUnmounted,
  type Ref, type ComputedRef
} from 'vue'
import { useTimelineZoom } from '@/composables/useTimelineZoom'
import { useTimelinePan } from '@/composables/useTimelinePan'
import { useTimeScale } from '@/composables/useTimeScale'
import { useTimelineStore } from '@/stores/timeline'
import TooltipCard from './TooltipCard.vue'
import type { TimelineEvent, VisibleEvent, RenderConfig, TimeRange } from '@/types'

// ==================== Props ====================
const props = defineProps<{
  events: TimelineEvent[]
  persons: { id: string; name: string; color: string }[]
  mode: 'overlay' | 'lane'
  filters: {
    personIds: string[]
    types: string[]
    searchQuery?: string
  }
}>()

// ==================== Emits ====================
const emit = defineEmits<{
  (e: 'event-click', event: TimelineEvent): void
  (e: 'time-range-change', range: TimeRange): void
}>()

// ==================== Refs ====================
const containerRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

const canvasWidth = ref(0)
const canvasHeight = ref(600)

// 时间范围（默认显示 2000-2030 年）
const viewRange: Ref<TimeRange> = ref({
  start: new Date('2000-01-01'),
  end: new Date('2030-12-31')
})

// 渲染配置
const renderConfig: Ref<RenderConfig> = ref({
  zoom: 1,
  offsetX: 0,
  laneHeight: 50,
  eventDotRadius: 6,
  showGrid: true,
  showLabels: true
})

// 状态
const isDragging = ref(false)
const hoveredEvent = ref<VisibleEvent | null>(null)
const tooltipX = ref(0)
const tooltipY = ref(0)
const loading = ref(false)

// ==================== Composables ====================
const timelineStore = useTimelineStore()

const { timeToX, xToTime, scaleLevel, generateTicks, autoFit } = useTimeScale(
  viewRange,
  canvasWidth,
  renderConfig
)

const { zoomAt, zoomIn, zoomOut, resetZoom } = useTimelineZoom(
  renderConfig,
  viewRange,
  canvasWidth
)

const {
  isDragging: isDraggingPan,
  startPan,
  panTo,
  endPan
} = useTimelinePan(renderConfig, viewRange, canvasWidth)

// 同步拖拽状态
isDragging = computed(() => isDraggingPan.value)

// ==================== 计算可见事件 ====================
const visibleEvents = computed((): VisibleEvent[] => {
  const { events, persons, mode } = props

  // 1. 筛选事件
  let filtered = events.filter(event => {
    // 按人物筛选
    if (props.filters.personIds.length > 0 && !props.filters.personIds.includes(event.personId)) {
      return false
    }
    // 按类型筛选
    if (props.filters.types.length > 0 && !props.filters.types.includes(event.type)) {
      return false
    }
    // 搜索关键词
    if (props.filters.searchQuery) {
      const query = props.filters.searchQuery.toLowerCase()
      const match = event.title.toLowerCase().includes(query) ||
                    event.content.toLowerCase().includes(query)
      if (!match) return false
    }
    return true
  })

  // 2. 按时间排序
  filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // 3. 分配轨道（lane 模式）
  const laneMap = new Map<string, number>()  // personId -> laneIndex
  let laneCount = 0

  if (mode === 'lane') {
    for (const event of filtered) {
      if (!laneMap.has(event.personId)) {
        laneMap.set(event.personId, laneCount++)
      }
    }
  }

  // 4. 计算坐标并过滤可视区域外的事件（虚拟化）
  const result: VisibleEvent[] = []
  const padding = 100  // 额外渲染边距

  for (const event of filtered) {
    const x = timeToX(new Date(event.date))

    // 虚拟化：只保留可视区域 + 边距内的事件
    if (x < -padding || x > canvasWidth.value + padding) continue

    const laneIndex = mode === 'lane' ? (laneMap.get(event.personId) ?? 0) : 0

    result.push({
      ...event,
      x,
      laneIndex
    })
  }

  return result
})

// ==================== Canvas 渲染 ====================
const render = (): void => {
  if (!ctx.value) return

  const { width, height } = canvasRef.value!
  const { offsetX, zoom, eventDotRadius, showGrid, showLabels } = renderConfig.value

  // 清空画布
  ctx.value.clearRect(0, 0, width, height)

  // 背景
  ctx.value.fillStyle = '#0f172a'
  ctx.value.fillRect(0, 0, width, height)

  // 1. 绘制网格线
  if (showGrid) {
    drawGrid()
  }

  // 2. 绘制时间轴线
  drawTimelineAxis()

  // 3. 绘制事件点
  drawEvents()

  // 4. 绘制刻度标签
  if (showLabels) {
    drawLabels()
  }
}

const drawGrid = (): void => {
  const ticks = generateTicks()
  ctx.value!.save()

  ctx.value.strokeStyle = 'rgba(148, 163, 184, 0.1)'
  ctx.value.lineWidth = 1

  for (const tick of ticks) {
    ctx.value.beginPath()
    ctx.value.moveTo(tick.x, 0)
    ctx.value.lineTo(tick.x, canvasHeight.value)
    ctx.value.stroke()
  }

  ctx.value.restore()
}

const drawTimelineAxis = (): void => {
  const ctx = ctx.value!
  const { offsetX, zoom } = renderConfig.value

  // 主时间轴线
  const axisY = canvasHeight.value / 2

  ctx.save()

  // 轴线
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, axisY)
  ctx.lineTo(canvasWidth.value, axisY)
  ctx.stroke()

  // 轨道线（lane 模式）
  if (props.mode === 'lane') {
    const laneCount = Math.max(1, new Set(props.events.map(e => e.personId)).size)
    const laneSpacing = Math.min(80, (canvasHeight.value - 40) / Math.max(1, laneCount - 1))
    const laneStartY = 20

    for (let i = 0; i < laneCount; i++) {
      const person = props.persons.find(p => p.id === props.events.find(e => e.laneIndex === i)?.personId)
      const y = laneStartY + i * laneSpacing

      ctx.strokeStyle = person?.color || 'rgba(148, 163, 184, 0.2)'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvasWidth.value, y)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }

  ctx.restore()
}

const drawEvents = (): void => {
  const ctx = ctx.value!
  const { eventDotRadius } = renderConfig.value

  // 绘制事件连线（lane 模式）
  if (props.mode === 'lane') {
    const laneEvents = new Map<number, VisibleEvent[]>()
    for (const event of visibleEvents.value) {
      if (!laneEvents.has(event.laneIndex)) {
        laneEvents.set(event.laneIndex, [])
      }
      laneEvents.get(event.laneIndex)!.push(event)
    }

    for (const [laneIndex, events] of laneEvents) {
      const personId = events[0]?.personId
      const person = props.persons.find(p => p.id === personId)

      ctx.save()
      ctx.strokeStyle = person?.color || 'rgba(148, 163, 184, 0.3)'
      ctx.lineWidth = 2
      ctx.setLineDash([3, 3])

      if (events.length > 1) {
        ctx.beginPath()
        ctx.moveTo(events[0].x, getLaneY(laneIndex))
        for (let i = 1; i < events.length; i++) {
          ctx.lineTo(events[i].x, getLaneY(laneIndex))
        }
        ctx.stroke()
      }
      ctx.restore()
    }
  }

  // 绘制事件点
  for (const event of visibleEvents.value) {
    const person = props.persons.find(p => p.id === event.personId)
    const color = person?.color || '#0ea5e9'
    const y = props.mode === 'lane' ? getLaneY(event.laneIndex) : canvasHeight.value / 2

    ctx.save()

    // 高亮效果（hover）
    if (hoveredEvent.value?.id === event.id) {
      ctx.shadowColor = color
      ctx.shadowBlur = 15
    }

    // 外圈
    ctx.beginPath()
    ctx.arc(event.x, y, eventDotRadius + 2, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'
    ctx.fill()

    // 内点
    ctx.beginPath()
    ctx.arc(event.x, y, eventDotRadius, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()

    // 事件类型图标
    drawEventIcon(event.type, event.x, y + eventDotRadius + 12)

    ctx.restore()
  }
}

const getLaneY = (laneIndex: number): number => {
  const laneCount = Math.max(1, new Set(props.events.map(e => e.personId)).size)
  const laneSpacing = Math.min(80, (canvasHeight.value - 40) / Math.max(1, laneCount - 1))
  return 20 + laneIndex * laneSpacing
}

const drawEventIcon = (type: string, x: number, y: number): void => {
  const ctx = ctx.value!
  const icons: Record<string, string> = {
    album: '💿',
    concert: '🎤',
    award: '🏆',
    milestone: '⭐',
    custom: '📌'
  }

  ctx.font = '12px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#94a3b8'
  ctx.fillText(icons[type] || '📌', x, y)
}

const drawLabels = (): void => {
  const ctx = ctx.value!
  const ticks = generateTicks()

  ctx.save()
  ctx.font = '11px sans-serif'
  ctx.textAlign = 'center'
  ctx.fillStyle = '#94a3b8'

  for (const tick of ticks) {
    const axisY = canvasHeight.value / 2
    ctx.fillText(tick.label, tick.x, axisY + 20)
  }

  ctx.restore()
}

// ==================== 事件处理 ====================
const onWheel = (event: WheelEvent): void => {
  if (event.ctrlKey) {
    // Ctrl + 滚轮：缩放
    event.preventDefault()
    const rect = canvasRef.value!.getBoundingClientRect()
    const mouseX = event.clientX - rect.left
    const delta = event.deltaY > 0 ? -1 : 1
    zoomAt(mouseX, delta)
  } else {
    // 普通滚轮：水平平移
    event.preventDefault()
    panTo(renderConfig.value.offsetX - event.deltaX - event.deltaY)
  }
  requestAnimationFrame(render)
}

const onMouseDown = (event: MouseEvent): void => {
  startPan(event.clientX)
}

const onMouseMove = (event: MouseEvent): void => {
  if (isDragging.value) {
    panTo(event.clientX)
    requestAnimationFrame(render)
  }

  // 检测 hover 事件
  const rect = canvasRef.value!.getBoundingClientRect()
  const mouseX = event.clientX - rect.left
  const mouseY = event.clientY - rect.top

  const hovered = visibleEvents.value.find(event => {
    const y = props.mode === 'lane' ? getLaneY(event.laneIndex) : canvasHeight.value / 2
    const dx = mouseX - event.x
    const dy = mouseY - y
    return Math.sqrt(dx * dx + dy * dy) < 20
  })

  hoveredEvent.value = hovered || null
  tooltipX.value = mouseX + 15
  tooltipY.value = mouseY + 15

  canvasRef.value!.style.cursor = hovered ? 'pointer' : (isDragging.value ? 'grabbing' : 'grab')
}

const onMouseUp = (event: MouseEvent): void => {
  endPan(event.clientX)
  requestAnimationFrame(render)
}

const onEventClick = (event: TimelineEvent): void => {
  emit('event-click', event)
}

// ==================== 生命周期 ====================
onMounted(() => {
  if (canvasRef.value) {
    ctx.value = canvasRef.value.getContext('2d')

    // 响应式尺寸
    const resize = (): void => {
      if (containerRef.value && canvasRef.value) {
        canvasWidth.value = containerRef.value.clientWidth
        canvasHeight.value = containerRef.value.clientHeight
        render()
      }
    }

    resize()
    window.addEventListener('resize', resize)

    // 自动适配事件范围
    if (props.events.length > 0) {
      // autoFit(props.events.map(e => ({ date: new Date(e.date) })))
      // requestAnimationFrame(render)
    }
  }
})

// 监听数据变化重新渲染
watch(
  () => [props.events.length, props.mode, renderConfig.value.zoom, renderConfig.value.offsetX],
  () => requestAnimationFrame(render),
  { deep: true }
)

// 暴露方法给父组件
defineExpose({
  zoomIn,
  zoomOut,
  resetZoom,
  timeToX,
  xToTime,
  autoFit
})
</script>

<style scoped>
.cursor-grab {
  cursor: grab;
}
.cursor-grabbing {
  cursor: grabbing;
}
</style>
