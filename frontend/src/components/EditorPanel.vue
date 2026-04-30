<template>
  <form class="grid grid-cols-2 gap-2" @submit.prevent="save">
    <input v-model="model.id" placeholder="ID" class="bg-slate-800 p-2 rounded" />
    <input v-model="model.title" placeholder="标题" class="bg-slate-800 p-2 rounded" />
    <input type="date" v-model="model.date" class="bg-slate-800 p-2 rounded" />
    <input v-model="model.person" placeholder="人物" class="bg-slate-800 p-2 rounded" />
    <input v-model="model.type" placeholder="类型" class="bg-slate-800 p-2 rounded" />
    <input v-model="model.image" placeholder="图片URL" class="bg-slate-800 p-2 rounded" />
    <textarea v-model="model.content" placeholder="描述" class="bg-slate-800 p-2 rounded col-span-2" />
    <button class="bg-blue-500 rounded p-2">保存</button>
    <button type="button" class="bg-red-500 rounded p-2" @click="del">删除</button>
  </form>
</template>
<script setup lang="ts">
import { reactive } from 'vue';
import { useTimelineStore } from '../stores/timeline';
const store = useTimelineStore();
const model = reactive({ id: '', title: '', date: '2024-01-01', content: '', image: '', person: 'Jay', type: 'album' });
const save = () => store.upsert({ ...model });
const del = () => store.remove(model.id);
</script>
