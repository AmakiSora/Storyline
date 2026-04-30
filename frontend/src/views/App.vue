<template>
  <main class="min-h-screen bg-slate-950 text-slate-100 p-6 space-y-4">
    <h1 class="text-3xl font-bold">可编辑交互时间线</h1>
    <ControlPanel />
    <TimelineAxis />
    <TimelineCanvas />
    <EditorPanel />
  </main>
</template>
<script setup lang="ts">
import ControlPanel from '../components/ControlPanel.vue';
import TimelineAxis from '../components/TimelineAxis.vue';
import TimelineCanvas from '../components/TimelineCanvas.vue';
import EditorPanel from '../components/EditorPanel.vue';
</script>
