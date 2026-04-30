import { ref, onMounted, onUnmounted, type Ref } from 'vue';
import { throttle } from '../utils/dateUtils';

interface UseTimelinePanOptions {
  onPan: (deltaX: number) => void;
}

interface UseTimelinePanReturn {
  isDragging: Ref<boolean>;
  dragStartX: Ref<number>;
  handleMouseDown: (event: MouseEvent) => void;
  handleMouseMove: (event: MouseEvent) => void;
  handleMouseUp: () => void;
  handleMouseLeave: () => void;
}

export function useTimelinePan(
  targetRef: Ref<HTMLElement | null>,
  options: UseTimelinePanOptions
): UseTimelinePanReturn {
  const { onPan } = options;
  const isDragging = ref(false);
  const dragStartX = ref(0);
  const lastPanX = ref(0);

  const throttledPan = throttle((deltaX: number) => {
    onPan(deltaX);
  }, 16);

  function handleMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return;
    isDragging.value = true;
    dragStartX.value = event.clientX;
    lastPanX.value = event.clientX;

    const target = targetRef.value;
    if (target) {
      target.style.cursor = 'grabbing';
      target.setAttribute('data-dragging', 'true');
    }
  }

  function handleMouseMove(event: MouseEvent): void {
    if (!isDragging.value) return;

    const deltaX = lastPanX.value - event.clientX;
    lastPanX.value = event.clientX;
    throttledPan(deltaX);
  }

  function handleMouseUp(): void {
    isDragging.value = false;
    const target = targetRef.value;
    if (target) {
      target.style.cursor = 'grab';
      target.removeAttribute('data-dragging');
    }
  }

  function handleMouseLeave(): void {
    if (isDragging.value) {
      handleMouseUp();
    }
  }

  onMounted(() => {
    const target = targetRef.value;
    if (target) {
      target.addEventListener('mousedown', handleMouseDown);
      target.addEventListener('mousemove', handleMouseMove);
      target.addEventListener('mouseup', handleMouseUp);
      target.addEventListener('mouseleave', handleMouseLeave);
    }
  });

  onUnmounted(() => {
    const target = targetRef.value;
    if (target) {
      target.removeEventListener('mousedown', handleMouseDown);
      target.removeEventListener('mousemove', handleMouseMove);
      target.removeEventListener('mouseup', handleMouseUp);
      target.removeEventListener('mouseleave', handleMouseLeave);
    }
  });

  return {
    isDragging,
    dragStartX,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  };
}
