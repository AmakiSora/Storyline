<template><div v-if="event" class="absolute p-3 bg-slate-900 border border-slate-700 rounded">{{ event.title }} - {{ event.date }}</div></template>
<script setup lang="ts">defineProps<{ event: any | null }>();</script>
