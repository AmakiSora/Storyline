import { ref } from 'vue';

export function useTimelinePan(onPan: (dx: number) => void) {
  const dragging = ref(false);
  let lastX = 0;

  const onDown = (e: PointerEvent) => {
    dragging.value = true;
    lastX = e.clientX;
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging.value) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    onPan(dx);
  };
  const onUp = () => (dragging.value = false);

  return { dragging, onDown, onMove, onUp };
}
