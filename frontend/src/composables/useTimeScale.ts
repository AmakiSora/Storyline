import { computed, ref } from 'vue';

// 中文注释：维护时间与像素之间的双向映射
export function useTimeScale() {
  const centerTime = ref(new Date('2012-01-01').getTime());
  const pxPerDay = ref(2);

  const msPerPixel = computed(() => (24 * 3600 * 1000) / pxPerDay.value);

  const timeToX = (t: number, width: number) => width / 2 + (t - centerTime.value) / msPerPixel.value;
  const xToTime = (x: number, width: number) => centerTime.value + (x - width / 2) * msPerPixel.value;

  const zoomAt = (mouseX: number, width: number, factor: number) => {
    const anchorTime = xToTime(mouseX, width);
    pxPerDay.value = Math.min(60, Math.max(0.05, pxPerDay.value * factor));
    centerTime.value = anchorTime - (mouseX - width / 2) * msPerPixel.value;
  };

  return { centerTime, pxPerDay, msPerPixel, timeToX, xToTime, zoomAt };
}
