<script setup lang="ts">
import { computed } from 'vue'
import { Search, Plus, ZoomIn, ZoomOut, Layers, Rows3 } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { useEventsStore } from '@/stores/events'

const props = defineProps<{
  onZoomIn: () => void
  onZoomOut: () => void
  onCreate: () => void
}>()

const store = useEventsStore()

const modeOptions = [
  { key: 'overlay' as const, label: '叠加', Icon: Layers },
  { key: 'lane' as const, label: '并列', Icon: Rows3 },
]

const personValue = computed({
  get: () => (store.filter.persons?.[0] ?? ''),
  set: (v: string) => {
    store.filter.persons = v ? [v] : undefined
  },
})

const typeValue = computed({
  get: () => (store.filter.types?.[0] ?? ''),
  set: (v: string) => {
    store.filter.types = v ? [v] : undefined
  },
})
</script>

<template>
  <div class="flex flex-wrap items-center justify-between gap-3">
    <div class="flex items-center gap-2">
      <div class="flex items-center rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          v-for="opt in modeOptions"
          :key="opt.key"
          class="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm transition"
          :class="
            cn(
              store.mode === opt.key
                ? 'bg-white/10 text-zinc-50 shadow-sm'
                : 'text-zinc-300 hover:bg-white/5 hover:text-zinc-100',
            )
          "
          type="button"
          @click="store.mode = opt.key"
        >
          <component :is="opt.Icon" class="h-4 w-4" />
          <span>{{ opt.label }}</span>
        </button>
      </div>

      <div class="hidden items-center gap-2 md:flex">
        <button
          class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
          type="button"
          @click="props.onZoomOut"
        >
          <ZoomOut class="h-4 w-4" />
          <span>缩小</span>
        </button>
        <button
          class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200 transition hover:bg-white/10"
          type="button"
          @click="props.onZoomIn"
        >
          <ZoomIn class="h-4 w-4" />
          <span>放大</span>
        </button>
      </div>
    </div>

    <div class="flex flex-1 flex-wrap items-center justify-end gap-2">
      <div class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
        <Search class="h-4 w-4 text-zinc-400" />
        <input
          v-model="store.filter.search"
          placeholder="搜索标题或描述…"
          class="w-[220px] bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
        />
      </div>

      <select
        v-model="personValue"
        class="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-zinc-200 outline-none"
      >
        <option value="">全部人物</option>
        <option v-for="p in store.persons" :key="p" :value="p">{{ p }}</option>
      </select>

      <select
        v-model="typeValue"
        class="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-zinc-200 outline-none"
      >
        <option value="">全部类型</option>
        <option v-for="t in store.types" :key="t" :value="t">{{ t }}</option>
      </select>

      <div class="hidden items-center gap-2 lg:flex">
        <input
          v-model="store.filter.dateFrom"
          type="date"
          class="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-zinc-200 outline-none"
        />
        <span class="text-zinc-500">—</span>
        <input
          v-model="store.filter.dateTo"
          type="date"
          class="h-10 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-zinc-200 outline-none"
        />
      </div>

      <button
        class="inline-flex h-10 items-center gap-2 rounded-xl bg-sky-500/90 px-3 text-sm font-medium text-zinc-950 shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
        type="button"
        @click="props.onCreate"
      >
        <Plus class="h-4 w-4" />
        <span>新增事件</span>
      </button>
    </div>
  </div>
</template>

