<script setup lang="ts">
import ControlPanel from '../components/ControlPanel.vue'
import TimelineCanvas from '../components/TimelineCanvas.vue'
import EditorPanel from '../components/EditorPanel.vue'
</script>
<template>
  <main class="min-h-screen bg-slate-950 p-6 text-slate-100">
    <h1 class="mb-4 text-3xl font-bold">可编辑高性能时间线系统</h1>
    <div class="space-y-4"><ControlPanel /><TimelineCanvas /><EditorPanel /></div>
  </main>
</template>
