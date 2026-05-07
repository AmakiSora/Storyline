<template>
  <div class="h-screen w-screen flex flex-col bg-dark-bg">
    <!-- 顶部标题栏 -->
    <header class="flex items-center justify-between px-4 py-3 border-b border-dark-border">
      <div class="flex items-center gap-3">
        <svg class="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h1 class="text-xl font-bold text-dark-text">Timeline</h1>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="store.openEditor()"
          class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          新增事件
        </button>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="flex-1 relative">
      <!-- 时间轴 Canvas -->
      <TimelineCanvas
        ref="canvasRef"
        :events="store.filteredEvents"
        :persons="store.visiblePersons"
        :mode="store.mode"
        :filters="{
          personIds: store.selectedPersonIds,
          types: store.selectedTypes,
          searchQuery: store.searchQuery
        }"
        @event-click="(event) => store.openEditor(event)"
      />

      <!-- 控制面板 -->
      <ControlPanel
        :persons="store.persons"
        :mode="store.mode"
        :zoom="1"
        :selected-persons="store.selectedPersonIds"
        :selected-types="store.selectedTypes"
        :search-query="store.searchQuery"
        @zoom-in="handleZoomIn"
        @zoom-out="handleZoomOut"
        @reset-view="handleResetView"
        @update:mode="store.setMode"
        @toggle-person="store.togglePerson"
        @toggle-type="store.toggleType"
        @clear-filters="store.clearFilters"
        @update:search="store.searchQuery = $event"
      />
    </main>

    <!-- 编辑面板 -->
    <EditorPanel
      :visible="store.isEditorOpen"
      :editing-event="store.editingEvent"
      :persons="store.persons"
      @close="store.closeEditor"
      @submit="handleSaveEvent"
      @delete="handleDeleteEvent"
    />

    <!-- 加载状态 -->
    <div v-if="store.loading" class="fixed inset-0 flex items-center justify-center bg-dark-bg/80 z-50">
      <div class="text-dark-text text-lg">加载中...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTimelineStore } from '@/stores/timeline'
import TimelineCanvas from '@/components/TimelineCanvas.vue'
import ControlPanel from '@/components/ControlPanel.vue'
import EditorPanel from '@/components/EditorPanel.vue'

const store = useTimelineStore()
const canvasRef = ref<InstanceType<typeof TimelineCanvas> | null>(null)

// 加载数据
onMounted(() => {
  store.loadData()
})

// 缩放控制
const handleZoomIn = (): void => {
  canvasRef.value?.zoomIn()
}

const handleZoomOut = (): void => {
  canvasRef.value?.zoomOut()
}

const handleResetView = (): void => {
  canvasRef.value?.resetZoom()
}

// 事件保存
const handleSaveEvent = async (eventData: Parameters<typeof store.createEvent>[0]) => {
  if (store.editingEvent) {
    await store.updateEvent(store.editingEvent.id, eventData)
  } else {
    await store.createEvent(eventData)
  }
  store.closeEditor()
  store.refreshEvents()
}

// 事件删除
const handleDeleteEvent = async (eventId: string) => {
  await store.deleteEvent(eventId)
  store.refreshEvents()
}
</script>
