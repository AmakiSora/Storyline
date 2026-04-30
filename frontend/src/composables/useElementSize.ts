import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'

export function useElementSize(el: Ref<HTMLElement | null>) {
  const width = ref(0)
  const height = ref(0)

  let ro: ResizeObserver | null = null

  onMounted(() => {
    if (!el.value) return
    ro = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width: w, height: h } = entry.contentRect
      width.value = w
      height.value = h
    })
    ro.observe(el.value)
  })

  onBeforeUnmount(() => {
    ro?.disconnect()
    ro = null
  })

  return { width, height }
}

