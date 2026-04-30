<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { Trash2, Pencil, X, Save } from 'lucide-vue-next'
import type { TimelineEvent } from '@/types/event'

type PanelMode = 'view' | 'edit' | 'create'

const props = defineProps<{
  open: boolean
  mode: PanelMode
  event: TimelineEvent | null
  persons: string[]
  types: string[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'mode', mode: PanelMode): void
  (e: 'create', payload: Omit<TimelineEvent, 'id'>): void
  (e: 'update', payload: TimelineEvent): void
  (e: 'delete', id: string): void
}>()

const form = reactive<Omit<TimelineEvent, 'id'>>({
  title: '',
  date: '',
  content: '',
  image: null,
  person: '',
  type: '',
})

watch(
  () => [props.mode, props.event] as const,
  () => {
    if (props.mode === 'create') {
      form.title = ''
      form.date = ''
      form.content = ''
      form.image = null
      form.person = props.persons[0] ?? ''
      form.type = props.types[0] ?? ''
      return
    }
    if (!props.event) return
    form.title = props.event.title
    form.date = props.event.date
    form.content = props.event.content
    form.image = props.event.image ?? null
    form.person = props.event.person
    form.type = props.event.type
  },
  { immediate: true },
)

const title = computed(() => {
  if (props.mode === 'create') return '新增事件'
  if (props.mode === 'edit') return '编辑事件'
  return '事件详情'
})

function onSubmit() {
  if (props.mode === 'create') emit('create', { ...form })
  else if (props.mode === 'edit' && props.event) emit('update', { ...form, id: props.event.id })
}
</script>

<template>
  <div
    v-if="open"
    class="absolute right-0 top-0 z-40 flex h-full w-[420px] flex-col border-l border-white/10 bg-zinc-950/70 backdrop-blur"
    v-motion
    :initial="{ x: 24, opacity: 0 }"
    :enter="{ x: 0, opacity: 1 }"
    :leave="{ x: 24, opacity: 0 }"
    :transition="{ duration: 0.18 }"
  >
    <div class="flex items-start justify-between gap-3 border-b border-white/10 p-4">
      <div class="min-w-0">
        <div class="truncate font-semibold text-zinc-100">{{ title }}</div>
        <div v-if="event && mode !== 'create'" class="mt-1 text-xs text-zinc-400">
          {{ event.date }} · {{ event.person }} · {{ event.type }}
        </div>
      </div>
      <button
        type="button"
        class="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-zinc-200"
        @click="emit('close')"
      >
        <X class="h-5 w-5" />
      </button>
    </div>

    <div v-if="mode === 'view' && event" class="flex-1 overflow-auto p-4">
      <div class="flex items-start gap-3">
        <div v-if="event.image" class="h-20 w-20 overflow-hidden rounded-xl border border-white/10 bg-white/5">
          <img :src="event.image" alt="" class="h-full w-full object-cover" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="text-lg font-semibold text-zinc-100">{{ event.title }}</div>
          <div class="mt-1 text-sm leading-relaxed text-zinc-200/90 whitespace-pre-wrap">
            {{ event.content }}
          </div>
        </div>
      </div>
    </div>

    <form v-else class="flex-1 overflow-auto p-4" @submit.prevent="onSubmit">
      <div class="space-y-3">
        <label class="block">
          <div class="text-xs text-zinc-400">标题</div>
          <input
            v-model="form.title"
            required
            class="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 outline-none"
          />
        </label>

        <label class="block">
          <div class="text-xs text-zinc-400">时间（日期）</div>
          <input
            v-model="form.date"
            required
            type="date"
            class="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 outline-none"
          />
        </label>

        <label class="block">
          <div class="text-xs text-zinc-400">人物</div>
          <input
            v-model="form.person"
            list="persons"
            required
            class="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 outline-none"
          />
          <datalist id="persons">
            <option v-for="p in persons" :key="p" :value="p" />
          </datalist>
        </label>

        <label class="block">
          <div class="text-xs text-zinc-400">类型</div>
          <input
            v-model="form.type"
            list="types"
            required
            class="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 outline-none"
          />
          <datalist id="types">
            <option v-for="t in types" :key="t" :value="t" />
          </datalist>
        </label>

        <label class="block">
          <div class="text-xs text-zinc-400">图片 URL（可选）</div>
          <input
            v-model="form.image"
            placeholder="https://..."
            class="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 outline-none"
          />
        </label>

        <label class="block">
          <div class="text-xs text-zinc-400">描述</div>
          <textarea
            v-model="form.content"
            rows="7"
            required
            class="mt-1 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 outline-none"
          />
        </label>
      </div>
    </form>

    <div class="flex items-center justify-between gap-2 border-t border-white/10 p-4">
      <div class="flex items-center gap-2">
        <button
          v-if="mode === 'view' && event"
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
          @click="emit('mode', 'edit')"
        >
          <Pencil class="h-4 w-4" />
          <span>编辑</span>
        </button>

        <button
          v-if="event && mode !== 'create'"
          type="button"
          class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-rose-200/90 transition hover:bg-rose-500/10"
          @click="emit('delete', event.id)"
        >
          <Trash2 class="h-4 w-4" />
          <span>删除</span>
        </button>
      </div>

      <div class="flex items-center gap-2">
        <button
          v-if="mode === 'edit' || mode === 'create'"
          type="button"
          class="inline-flex items-center gap-2 rounded-xl bg-sky-500/90 px-3 py-2 text-sm font-medium text-zinc-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
          @click="onSubmit"
        >
          <Save class="h-4 w-4" />
          <span>保存</span>
        </button>
      </div>
    </div>
  </div>
</template>
