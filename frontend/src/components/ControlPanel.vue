<script setup lang="ts">
import { useTimelineStore } from '../stores/timeline'
const store = useTimelineStore()
</script>
<template>
  <div class="grid grid-cols-4 gap-3 rounded-xl border border-slate-800 bg-slate-900/70 p-3">
    <select class="rounded bg-slate-800 p-2" v-model="store.mode"><option value="overlay">叠加</option><option value="lane">并列</option></select>
    <input class="rounded bg-slate-800 p-2" placeholder="关键词" v-model="store.filter.keyword" />
    <input class="rounded bg-slate-800 p-2" type="date" v-model="store.filter.from" />
    <input class="rounded bg-slate-800 p-2" type="date" v-model="store.filter.to" />
  </div>
</template>
