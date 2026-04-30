<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useTimelineStore } from '../stores/timeline'
const store = useTimelineStore()
const model = reactive({ id:'', title:'', date:'', content:'', image:'', person:'Jay', type:'album' as 'album'|'concert' })
watch(() => store.selected, (v) => v && Object.assign(model, v), { deep: true })
</script>
<template>
  <form class="space-y-2 rounded-xl border border-slate-800 bg-slate-900/70 p-3" @submit.prevent="store.saveEvent(model as any)">
    <input v-model="model.title" class="w-full rounded bg-slate-800 p-2" placeholder="标题" />
    <input v-model="model.date" type="date" class="w-full rounded bg-slate-800 p-2" />
    <textarea v-model="model.content" class="w-full rounded bg-slate-800 p-2" placeholder="描述" />
    <input v-model="model.image" class="w-full rounded bg-slate-800 p-2" placeholder="图片URL" />
    <input v-model="model.person" class="w-full rounded bg-slate-800 p-2" placeholder="人物" />
    <select v-model="model.type" class="w-full rounded bg-slate-800 p-2"><option value="album">专辑</option><option value="concert">演唱会</option></select>
    <div class="flex gap-2"><button class="rounded bg-blue-600 px-3 py-1">保存</button><button type="button" class="rounded bg-rose-600 px-3 py-1" @click="store.removeEvent(model.id)">删除</button></div>
  </form>
</template>
