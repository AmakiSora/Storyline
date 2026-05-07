<template>
  <div class="fixed top-4 right-4 z-40 flex flex-col gap-3">
    <!-- 缩放控制 -->
    <div class="bg-dark-card border border-dark-border rounded-lg p-2 flex flex-col gap-1">
      <button
        @click="$emit('zoom-in')"
        class="p-2 hover:bg-dark-border rounded transition-colors"
        title="放大"
      >
        <svg class="w-5 h-5 text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <span class="text-center text-xs text-dark-muted py-1">{{ Math.round(zoom * 100) }}%</span>
      <button
        @click="$emit('zoom-out')"
        class="p-2 hover:bg-dark-border rounded transition-colors"
        title="缩小"
      >
        <svg class="w-5 h-5 text-dark-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
        </svg>
      </button>
      <button
        @click="$emit('reset-view')"
        class="p-1 text-xs text-dark-muted hover:text-dark-text transition-colors"
      >
        重置
      </button>
    </div>

    <!-- 模式切换 -->
    <div class="bg-dark-card border border-dark-border rounded-lg p-2">
      <div class="text-xs text-dark-muted mb-2">显示模式</div>
      <div class="flex gap-1">
        <button
          @click="$emit('update:mode', 'overlay')"
          class="px-3 py-1 text-xs rounded transition-colors"
          :class="mode === 'overlay' ? 'bg-primary-600 text-white' : 'text-dark-muted hover:bg-dark-border'"
        >
          叠加
        </button>
        <button
          @click="$emit('update:mode', 'lane')"
          class="px-3 py-1 text-xs rounded transition-colors"
          :class="mode === 'lane' ? 'bg-primary-600 text-white' : 'text-dark-muted hover:bg-dark-border'"
        >
          并列
        </button>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="bg-dark-card border border-dark-border rounded-lg p-3 min-w-[200px]">
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-sm font-semibold text-dark-text">筛选</h3>
        <button @click="$emit('clear-filters')" class="text-xs text-primary-400 hover:text-primary-300">
          清除
        </button>
      </div>

      <!-- 人物筛选 -->
      <div class="mb-3">
        <label class="block text-xs text-dark-muted mb-1">人物</label>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="person in persons"
            :key="person.id"
            @click="togglePerson(person.id)"
            class="px-2 py-0.5 text-xs rounded-full transition-colors"
            :class="selectedPersons.includes(person.id) ? '' : 'opacity-50'"
            :style="selectedPersons.includes(person.id) ? { backgroundColor: person.color, color: '#fff' } : { border: `1px solid ${person.color}` }"
          >
            {{ person.name }}
          </button>
        </div>
      </div>

      <!-- 事件类型筛选 -->
      <div>
        <label class="block text-xs text-dark-muted mb-1">事件类型</label>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="type in eventTypes"
            :key="type.value"
            @click="toggleType(type.value)"
            class="px-2 py-0.5 text-xs rounded transition-colors"
            :class="selectedTypes.includes(type.value) ? 'bg-dark-border text-dark-text' : 'text-dark-muted opacity-50'"
          >
            {{ type.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="bg-dark-card border border-dark-border rounded-lg p-2">
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          @input="$emit('update:search', searchQuery)"
          type="text"
          placeholder="搜索标题或描述..."
          class="bg-transparent text-dark-text text-sm outline-none w-[180px] placeholder-dark-muted"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  persons: { id: string; name: string; color: string }[]
  mode: 'overlay' | 'lane'
  zoom: number
  selectedPersons: string[]
  selectedTypes: string[]
  searchQuery: string
}>()

const emit = defineEmits<{
  (e: 'zoom-in'): void
  (e: 'zoom-out'): void
  (e: 'reset-view'): void
  (e: 'update:mode', value: 'overlay' | 'lane'): void
  (e: 'toggle-person', personId: string): void
  (e: 'toggle-type', type: string): void
  (e: 'clear-filters'): void
  (e: 'update:search', value: string): void
}>()

const searchQuery = ref(props.searchQuery)

watch(() => props.searchQuery, (v) => { searchQuery.value = v })

const eventTypes = [
  { value: 'album', label: '专辑' },
  { value: 'concert', label: '演唱会' },
  { value: 'award', label: '奖项' },
  { value: 'milestone', label: '里程碑' },
  { value: 'custom', label: '其他' }
]

const togglePerson = (personId: string): void => {
  emit('toggle-person', personId)
}

const toggleType = (type: string): void => {
  emit('toggle-type', type)
}
</script>
