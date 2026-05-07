<template>
  <div
    ref="cardRef"
    class="fixed z-50 bg-dark-card border border-dark-border rounded-lg shadow-xl p-4 min-w-[280px] max-w-[360px]"
    :style="{ left: `${x}px`, top: `${y}px` }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <!-- 事件类型标签 -->
    <div class="flex items-center gap-2 mb-2">
      <span
        class="px-2 py-0.5 text-xs font-medium rounded-full"
        :style="{ backgroundColor: personColor, color: '#fff' }"
      >
        {{ typeLabel }}
      </span>
      <span class="text-dark-muted text-xs">{{ formatDate(event.date) }}</span>
    </div>

    <!-- 标题 -->
    <h3 class="text-lg font-semibold text-dark-text mb-2">{{ event.title }}</h3>

    <!-- 描述 -->
    <p class="text-dark-muted text-sm mb-3 line-clamp-3">{{ event.content }}</p>

    <!-- 图片预览 -->
    <img
      v-if="event.image"
      :src="event.image"
      alt=""
      class="w-full h-32 object-cover rounded-md mb-3"
      @error="handleImageError"
    />

    <!-- 人物信息 -->
    <div class="flex items-center gap-2 text-sm text-dark-muted">
      <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: personColor }" />
      {{ personName }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { TimelineEvent } from '@/types'

const props = defineProps<{
  event: TimelineEvent & { x: number; laneIndex: number }
  x: number
  y: number
}>()

const cardRef = ref<HTMLElement | null>(null)
const hovered = ref(false)

// 事件类型标签
const typeLabels: Record<string, string> = {
  album: '专辑',
  concert: '演唱会',
  award: '奖项',
  milestone: '里程碑',
  custom: '其他'
}

const typeLabel = computed(() => typeLabels[props.event.type] || '事件')

// 人物颜色
const getPersonColor = (personId: string): string => {
  // 从 store 获取人物颜色
  const store = useTimelineStore()
  const person = store.persons.find(p => p.id === personId)
  return person?.color || '#0ea5e9'
}

const personColor = computed(() => getPersonColor(props.event.personId))
const personName = computed(() => {
  const store = useTimelineStore()
  const person = store.persons.find(p => p.id === props.event.personId)
  return person?.name || '未知'
})

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleImageError = (e: Event): void => {
  const img = e.target as HTMLImageElement
  img.style.display = 'none'
}
</script>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
