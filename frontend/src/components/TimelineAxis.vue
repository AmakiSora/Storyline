<script setup lang="ts">
defineProps<{ ticks: { label: string; x: number }[] }>()
</script>
<template><div class="absolute bottom-2 left-0 right-0 h-8 pointer-events-none"><div v-for="t in ticks" :key="t.x" class="absolute text-xs text-slate-400" :style="{left:`${t.x}px`}">{{ t.label }}</div></div></template>
