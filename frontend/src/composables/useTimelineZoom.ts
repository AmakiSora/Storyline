import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import { throttle } from '../utils/dateUtils';

interface UseTimelineZoomOptions {
  onZoom: (delta: number, mouseX: number) => void;
  sensitivity?: number;
}

interface UseTimelineZoomReturn {
  isZooming: Ref<boolean>;
  handleWheel: (event: WheelEvent) => void;
}

export function useTimelineZoom(
  targetRef: Ref<HTMLElement | null>,
  options: UseTimelineZoomOptions
): UseTimelineZoomReturn {
  const { onZoom, sensitivity = 1 } = options;
  const isZooming = ref(false);

  const throttledZoom = throttle((delta: number, mouseX: number) => {
    onZoom(delta, mouseX);
  }, 16);

  function handleWheel(event: WheelEvent): void {
    event.preventDefault();
    isZooming.value = true;

    const target = targetRef.value;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;

    const delta = event.deltaY * sensitivity;
    throttledZoom(delta, mouseX);

    setTimeout(() => {
      isZooming.value = false;
    }, 100);
  }

  onMounted(() => {
    const target = targetRef.value;
    if (target) {
      target.addEventListener('wheel', handleWheel, { passive: false });
    }
  });

  onUnmounted(() => {
    const target = targetRef.value;
    if (target) {
      target.removeEventListener('wheel', handleWheel);
    }
  });

  return {
    isZooming,
    handleWheel,
  };
}
