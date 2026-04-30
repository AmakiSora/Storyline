<template>
  <canvas ref="cv" class="w-full h-[420px] rounded-xl bg-slate-900/70" @pointerdown="onDown" @pointermove="move" @pointerup="onUp" @pointerleave="onUp" @wheel="onWheel"></canvas>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useTimelineStore } from '../stores/timeline';
import { useTimeScale } from '../composables/useTimeScale';
import { useTimelinePan } from '../composables/useTimelinePan';
import { useTimelineZoom } from '../composables/useTimelineZoom';
const store = useTimelineStore();
const cv = ref<HTMLCanvasElement | null>(null);
const { centerTime, msPerPixel, timeToX, zoomAt } = useTimeScale();
const pan = useTimelinePan((dx) => (centerTime.value -= dx * msPerPixel.value));
const zoom = useTimelineZoom(zoomAt);

const draw = () => {
  if (!cv.value) return;
  const dpr = window.devicePixelRatio || 1;
  const { clientWidth: w, clientHeight: h } = cv.value;
  cv.value.width = w * dpr; cv.value.height = h * dpr;
  const ctx = cv.value.getContext('2d')!; ctx.scale(dpr, dpr); ctx.clearRect(0, 0, w, h);
  const visible = store.filtered.filter((e) => {
    const x = timeToX(new Date(e.date).getTime(), w);
    return x >= -40 && x <= w + 40;
  });
  const people = [...new Set(visible.map((e) => e.person))];
  const laneY = (p: string) => store.mode === 'overlay' ? h / 2 : 120 + people.indexOf(p) * 120;
  ctx.lineWidth = 2;
  visible.forEach((e) => {
    const x = timeToX(new Date(e.date).getTime(), w); const y = laneY(e.person);
    ctx.strokeStyle = e.type === 'album' ? '#60a5fa' : '#fb923c';
    ctx.beginPath(); ctx.moveTo(x, y - 24); ctx.lineTo(x, y + 24); ctx.stroke();
    ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.arc(x, y, 9, 0, Math.PI * 2); ctx.fill();
  });
};
const move = (e: PointerEvent) => { pan.onMove(e); draw(); };
const onDown = (e: PointerEvent) => pan.onDown(e);
const onUp = () => pan.onUp();
const onWheel = (e: WheelEvent) => { if (!cv.value) return; zoom(e, cv.value.clientWidth); draw(); };
onMounted(draw);
watch(() => [store.filtered, store.mode], draw, { deep: true });
</script>
