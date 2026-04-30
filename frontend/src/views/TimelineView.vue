<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import ControlPanel from '@/components/ControlPanel.vue'
import TimelineCanvas from '@/components/TimelineCanvas.vue'
import EditorPanel from '@/components/EditorPanel.vue'
import { useEventsStore } from '@/stores/events'
import type { TimelineEvent } from '@/types/event'

const store = useEventsStore()

const panelOpen = ref(false)
const panelMode = ref<'view' | 'edit' | 'create'>('view')

const panelEvent = computed(() => store.selectedEvent)

watch(
  () => store.selectedId,
  (id) => {
    if (!id) return
    panelOpen.value = true
    panelMode.value = 'view'
  },
)

async function onCreate() {
  store.select(null)
  panelMode.value = 'create'
  panelOpen.value = true
}

async function onCreateSubmit(payload: Omit<TimelineEvent, 'id'>) {
  await store.createEvent(payload)
  panelMode.value = 'view'
}

async function onUpdateSubmit(payload: TimelineEvent) {
  await store.updateEvent(payload)
  panelMode.value = 'view'
}

async function onDelete(id: string) {
  await store.deleteEvent(id)
  panelOpen.value = false
}

function onClose() {
  panelOpen.value = false
  panelMode.value = 'view'
}

function onModeChange(next: 'view' | 'edit' | 'create') {
  panelMode.value = next
}

const canvasRef = ref<InstanceType<typeof TimelineCanvas> | null>(null)
function zoomIn() {
  canvasRef.value?.zoomIn()
}
function zoomOut() {
  canvasRef.value?.zoomOut()
}

onMounted(() => {
  store.refresh()
})
</script>

<template>
  <div class="h-full bg-[#06070b] text-zinc-100">
    <div class="relative h-full">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_10%,rgba(56,189,248,0.18),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(167,139,250,0.15),transparent_45%),radial-gradient(circle_at_60%_90%,rgba(251,146,60,0.12),transparent_40%)]" />
      <div class="relative z-10 flex h-full flex-col">
        <header class="px-6 pt-6">
          <div class="flex items-end justify-between gap-6">
            <div class="min-w-0">
              <div class="font-[Fraunces] text-2xl tracking-tight">JAY CHOU: MUSIC & JOURNEY</div>
              <div class="mt-1 text-sm text-zinc-400">高性能可编辑时间线（Canvas 渲染 · 缩放/拖拽 · 多时间线模式）</div>
            </div>
          </div>
          <div class="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur">
            <ControlPanel :onZoomIn="zoomIn" :onZoomOut="zoomOut" :onCreate="onCreate" />
          </div>
        </header>

        <main class="relative flex-1 px-6 pb-6 pt-4">
          <div class="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/40 backdrop-blur">
            <TimelineCanvas ref="canvasRef" />
            <EditorPanel
              :open="panelOpen"
              :mode="panelMode"
              :event="panelEvent"
              :persons="store.persons"
              :types="store.types"
              @close="onClose"
              @mode="onModeChange"
              @create="onCreateSubmit"
              @update="onUpdateSubmit"
              @delete="onDelete"
            />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

