<script setup lang="ts">
import type { TimelineEvent } from '../types/event'
defineProps<{ event: TimelineEvent; x: number; y: number }>()
</script>
<template>
  <div class="absolute z-50 w-72 rounded-xl border border-slate-700 bg-slate-900/95 p-3" :style="{ left: `${x + 12}px`, top: `${y + 12}px` }">
    <h4 class="font-semibold">{{ event.title }}</h4><p class="text-xs text-slate-400">{{ event.date }}</p><p class="mt-2 text-sm">{{ event.content }}</p>
  </div>
</template>
