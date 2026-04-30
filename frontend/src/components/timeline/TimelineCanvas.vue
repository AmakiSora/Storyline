<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useTimelineStore } from '../../stores/timelineStore';
import { useEditorStore } from '../../stores/editorStore';
import { useTimeScale } from '../../composables/useTimeScale';
import { useTimelineZoom } from '../../composables/useTimelineZoom';
import { useTimelinePan } from '../../composables/useTimelinePan';
import { useTimelineRenderer } from '../../composables/useTimelineRenderer';
import TooltipCard from '../ui/TooltipCard.vue';

const timelineStore = useTimelineStore();
const editorStore = useEditorStore();

const containerRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const canvasWidth = ref(1200);

const {
  timeScale,
  xToTime,
  zoomAtPoint,
  setZoomLevel,
  pan,
  resetView,
} = useTimeScale(canvasWidth);

const { handleWheel } = useTimelineZoom(containerRef, {
  onZoom: zoomAtPoint,
});

const { isDragging } = useTimelinePan(containerRef, {
  onPan: pan,
});

const {
  canvasHeight,
  eventPositions,
  hoveredEvent,
  handleClick,
  handleMouseMove,
  handleMouseLeave,
} = useTimelineRenderer({
  canvasRef,
  timeScale,
  events: computed(() => timelineStore.filteredEvents),
  filterOptions: computed(() => timelineStore.filterOptions),
  viewMode: computed(() => timelineStore.viewMode),
  lanes: computed(() => timelineStore.lanes),
  height: 400,
});

const tooltipPosition = ref({ x: 0, y: 0 });
const showTooltip = ref(false);

function updateCanvasWidth(): void {
  if (containerRef.value) {
    canvasWidth.value = containerRef.value.clientWidth;
  }
}

function onCanvasClick(event: MouseEvent): void {
  handleClick(event);

  const clickedEvent = eventPositions.value.find(pos => {
    const rect = canvasRef.value?.getBoundingClientRect();
    if (!rect) return false;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
    return distance <= 12;
  });

  if (clickedEvent) {
    editorStore.openViewPanel(clickedEvent.event);
  }
}

function onCanvasDoubleClick(event: MouseEvent): void {
  const rect = canvasRef.value?.getBoundingClientRect();
  if (!rect) return;

  const x = event.clientX - rect.left;
  const date = xToTime(x);

  editorStore.openCreatePanel(date);
}

function onMouseMove(event: MouseEvent): void {
  handleMouseMove(event);

  if (hoveredEvent.value) {
    const rect = canvasRef.value?.getBoundingClientRect();
    if (rect) {
      tooltipPosition.value = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
      showTooltip.value = true;
    }
  } else {
    showTooltip.value = false;
  }
}

function zoomIn(): void {
  const levels = ['year', 'halfyear', 'quarter', 'month', 'week', 'day'] as const;
  const currentIndex = levels.indexOf(timelineStore.zoomLevel);
  if (currentIndex < levels.length - 1) {
    timelineStore.setZoomLevel(levels[currentIndex + 1]);
    setZoomLevel(levels[currentIndex + 1]);
  }
}

function zoomOut(): void {
  const levels = ['year', 'halfyear', 'quarter', 'month', 'week', 'day'] as const;
  const currentIndex = levels.indexOf(timelineStore.zoomLevel);
  if (currentIndex > 0) {
    timelineStore.setZoomLevel(levels[currentIndex - 1]);
    setZoomLevel(levels[currentIndex - 1]);
  }
}

watch(() => timelineStore.zoomLevel, (level) => {
  setZoomLevel(level);
});

onMounted(() => {
  updateCanvasWidth();
  window.addEventListener('resize', updateCanvasWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateCanvasWidth);
});
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full h-[400px] bg-bg-deep overflow-hidden select-none"
    :class="{ 'cursor-grabbing': isDragging, 'cursor-grab': !isDragging }"
    @wheel.prevent="handleWheel"
  >
    <canvas
      ref="canvasRef"
      class="absolute inset-0"
      @click="onCanvasClick"
      @dblclick="onCanvasDoubleClick"
      @mousemove="onMouseMove"
      @mouseleave="handleMouseLeave"
    />

    <div class="absolute top-4 left-4 flex gap-2">
      <button
        @click="zoomOut"
        class="w-8 h-8 rounded-lg bg-bg-card hover:bg-bg-elevated text-text-primary flex items-center justify-center transition-colors"
        title="缩小"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </button>
      <span class="px-3 py-1.5 rounded-lg bg-bg-card text-text-secondary text-sm font-mono">
        {{ timelineStore.zoomLevel === 'year' ? '年' : timelineStore.zoomLevel === 'halfyear' ? '半年' : timelineStore.zoomLevel === 'quarter' ? '季度' : timelineStore.zoomLevel === 'month' ? '月' : timelineStore.zoomLevel === 'week' ? '周' : '日' }}
      </span>
      <button
        @click="zoomIn"
        class="w-8 h-8 rounded-lg bg-bg-card hover:bg-bg-elevated text-text-primary flex items-center justify-center transition-colors"
        title="放大"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>

    <button
      @click="resetView"
      class="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-bg-card hover:bg-bg-elevated text-text-secondary text-sm transition-colors"
    >
      重置视图
    </button>

    <TooltipCard
      v-if="showTooltip && hoveredEvent"
      :event="hoveredEvent"
      :x="tooltipPosition.x"
      :y="tooltipPosition.y"
      :canvas-width="canvasWidth"
      :canvas-height="canvasHeight"
    />
  </div>
</template>
