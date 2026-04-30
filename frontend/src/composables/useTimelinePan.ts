import { ref, type Ref } from 'vue'

export function useTimelinePan(params: { offset: Ref<number> }) {
  const { offset } = params

  const dragging = ref(false)
  const lastX = ref(0)
  let raf = 0
  let pendingDx = 0

  function flush() {
    raf = 0
    if (pendingDx === 0) return
    offset.value += pendingDx
    pendingDx = 0
  }

  function onPointerDown(e: PointerEvent) {
    dragging.value = true
    lastX.value = e.clientX
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging.value) return
    const dx = e.clientX - lastX.value
    lastX.value = e.clientX
    pendingDx += dx
    if (!raf) raf = requestAnimationFrame(flush)
  }

  function onPointerUp() {
    dragging.value = false
    if (raf) {
      cancelAnimationFrame(raf)
      raf = 0
    }
    pendingDx = 0
  }

  return { dragging, onPointerDown, onPointerMove, onPointerUp }
}

