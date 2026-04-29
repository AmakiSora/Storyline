<script setup lang="ts">
import type { TimelineEvent } from '@/types/event'

defineProps<{
  event: TimelineEvent
  x: number
  y: number
}>()
</script>

<template>
  <div
    class="pointer-events-none absolute z-30 w-[320px] -translate-x-1/2 rounded-xl border border-white/10 bg-zinc-950/80 p-3 shadow-2xl backdrop-blur"
    :style="{ left: `${x}px`, top: `${y}px` }"
  >
    <div class="flex items-start gap-3">
      <div v-if="event.image" class="h-14 w-14 overflow-hidden rounded-lg border border-white/10 bg-white/5">
        <img :src="event.image" alt="" class="h-full w-full object-cover" />
      </div>
      <div class="min-w-0 flex-1">
        <div class="truncate font-medium text-zinc-100">{{ event.title }}</div>
        <div class="mt-0.5 text-xs text-zinc-400">{{ event.date }} · {{ event.person }} · {{ event.type }}</div>
      </div>
    </div>
    <div class="mt-2 max-h-[4.5rem] overflow-hidden text-sm leading-relaxed text-zinc-200/90">
      {{ event.content }}
    </div>
  </div>
</template>
