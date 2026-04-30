<template>
  <div class="grid grid-cols-5 gap-2 text-sm">
    <input v-model="store.keyword" placeholder="搜索" class="bg-slate-800 px-2 py-1 rounded" />
    <select v-model="store.typeFilter" class="bg-slate-800 px-2 py-1 rounded"><option value="all">全部类型</option><option value="album">专辑</option><option value="concert">演唱会</option></select>
    <select v-model="store.mode" class="bg-slate-800 px-2 py-1 rounded"><option value="overlay">叠加</option><option value="lane">并列</option></select>
    <input type="date" v-model="store.range[0]" class="bg-slate-800 px-2 py-1 rounded" />
    <input type="date" v-model="store.range[1]" class="bg-slate-800 px-2 py-1 rounded" />
  </div>
</template>
<script setup lang="ts">import { useTimelineStore } from '../stores/timeline'; const store = useTimelineStore();</script>
