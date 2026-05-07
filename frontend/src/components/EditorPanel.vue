<template>
  <!-- 遮罩层 -->
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    @click.self="$emit('close')"
  >
    <div class="bg-dark-card border border-dark-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <!-- 头部 -->
      <div class="flex items-center justify-between p-4 border-b border-dark-border">
        <h2 class="text-lg font-semibold text-dark-text">
          {{ editingEvent ? '编辑事件' : '新增事件' }}
        </h2>
        <button
          @click="$emit('close')"
          class="p-1 hover:bg-dark-border rounded transition-colors"
        >
          <svg class="w-5 h-5 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- 表单 -->
      <form @submit.prevent="handleSubmit" class="p-4 space-y-4">
        <!-- 标题 -->
        <div>
          <label class="block text-sm text-dark-muted mb-1">标题 *</label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text outline-none focus:border-primary-500 transition-colors"
            placeholder="输入事件标题"
          />
        </div>

        <!-- 日期 -->
        <div>
          <label class="block text-sm text-dark-muted mb-1">日期 *</label>
          <input
            v-model="form.date"
            type="date"
            required
            class="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text outline-none focus:border-primary-500 transition-colors"
          />
        </div>

        <!-- 人物 -->
        <div>
          <label class="block text-sm text-dark-muted mb-1">人物 / 分类 *</label>
          <select
            v-model="form.personId"
            required
            class="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text outline-none focus:border-primary-500 transition-colors"
          >
            <option value="">选择人物...</option>
            <option v-for="person in persons" :key="person.id" :value="person.id">
              {{ person.name }}
            </option>
          </select>
        </div>

        <!-- 事件类型 -->
        <div>
          <label class="block text-sm text-dark-muted mb-1">事件类型 *</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="type in eventTypes"
              :key="type.value"
              type="button"
              @click="form.type = type.value"
              class="px-3 py-1.5 text-sm rounded-lg border transition-colors"
              :class="form.type === type.value
                ? 'border-primary-500 bg-primary-500/20 text-white'
                : 'border-dark-border text-dark-muted hover:border-dark-text'"
            >
              {{ type.label }}
            </button>
          </div>
        </div>

        <!-- 描述 -->
        <div>
          <label class="block text-sm text-dark-muted mb-1">描述</label>
          <textarea
            v-model="form.content"
            rows="4"
            class="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text outline-none focus:border-primary-500 transition-colors resize-none"
            placeholder="输入详细描述..."
          />
        </div>

        <!-- 图片 URL -->
        <div>
          <label class="block text-sm text-dark-muted mb-1">图片 URL</label>
          <input
            v-model="form.image"
            type="url"
            class="w-full bg-dark-bg border border-dark-border rounded-lg px-3 py-2 text-dark-text outline-none focus:border-primary-500 transition-colors"
            placeholder="https://example.com/image.jpg"
          />
          <!-- 图片预览 -->
          <img
            v-if="form.image"
            :src="form.image"
            alt="Preview"
            class="mt-2 w-full h-32 object-cover rounded-lg"
            @error="form.image = ''"
          />
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-3 pt-2">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 py-2 border border-dark-border text-dark-muted rounded-lg hover:bg-dark-border transition-colors"
          >
            取消
          </button>
          <button
            v-if="editingEvent"
            type="button"
            @click="handleDelete"
            class="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            删除
          </button>
          <button
            type="submit"
            class="flex-1 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-500 transition-colors"
          >
            {{ editingEvent ? '保存修改' : '添加事件' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { TimelineEvent, EventType } from '@/types'

const props = defineProps<{
  visible: boolean
  editingEvent: TimelineEvent | null
  persons: { id: string; name: string; color: string }[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', event: Omit<TimelineEvent, 'id' | 'createdAt' | 'updatedAt'>): void
  (e: 'delete', eventId: string): void
}>()

const form = ref({
  title: '',
  date: '',
  personId: '',
  type: 'custom' as EventType,
  content: '',
  image: ''
})

const eventTypes = [
  { value: 'album', label: '📀 专辑' },
  { value: 'concert', label: '🎤 演唱会' },
  { value: 'award', label: '🏆 奖项' },
  { value: 'milestone', label: '⭐ 里程碑' },
  { value: 'custom', label: '📌 其他' }
]

// 监听编辑事件，填充表单
watch(() => props.editingEvent, (event) => {
  if (event) {
    form.value = {
      title: event.title,
      date: event.date,
      personId: event.personId,
      type: event.type,
      content: event.content,
      image: event.image || ''
    }
  } else {
    // 重置表单
    form.value = {
      title: '',
      date: '',
      personId: '',
      type: 'custom',
      content: '',
      image: ''
    }
  }
}, { immediate: true })

const handleSubmit = (): void => {
  emit('submit', {
    title: form.value.title,
    date: form.value.date,
    personId: form.value.personId,
    type: form.value.type,
    content: form.value.content,
    image: form.value.image || undefined
  })
}

const handleDelete = (): void => {
  if (props.editingEvent && confirm('确定要删除这个事件吗？')) {
    emit('delete', props.editingEvent.id)
    emit('close')
  }
}
</script>
