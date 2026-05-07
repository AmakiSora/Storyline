/**
 * useTimelineZoom.ts - 以鼠标为中心的缩放算法
 *
 * 核心原理：
 * 1. 缩放前后，鼠标指向的时间点保持不变
 * 2. 通过调整 offsetX 来补偿缩放带来的偏移
 *
 * 公式推导：
 *   缩放前：mouseX = timeToX(targetTime) = (targetMs - startMs) * pixelsPerMs * zoom1 + offsetX1
 *   缩放后：mouseX = timeToX(targetTime) = (targetMs - startMs) * pixelsPerMs * zoom2 + offsetX2
 *
 *   解得：offsetX2 = offsetX1 + (mouseX - offsetX1) * (1 - zoom2/zoom1)
 */

import { ref, computed, type Ref } from 'vue'
import type { RenderConfig, TimeRange } from '@/types'

const MIN_ZOOM = 0.1
const MAX_ZOOM = 10
const ZOOM_SENSITIVITY = 0.001  // 滚轮灵敏度
const ZOOM_STEP = 0.1           // 按钮缩放步长

export function useTimelineZoom(
  renderConfig: Ref<RenderConfig>,
  viewRange: Ref<TimeRange>,
  canvasWidth: Ref<number>
) {
  const zoom = computed({
    get: () => renderConfig.value.zoom,
    set: (value: number) => {
      renderConfig.value.zoom = clampZoom(value)
    }
  })

  /**
   * 以鼠标位置为中心缩放
   * @param mouseX 鼠标在 Canvas 中的 X 坐标
   * @param delta 缩放增量（正数放大，负数缩小）
   */
  const zoomAt = (mouseX: number, delta: number): void => {
    const oldZoom = renderConfig.value.zoom
    const newZoom = clampZoom(oldZoom * (1 + delta * ZOOM_SENSITIVITY * 100))

    if (Math.abs(newZoom - oldZoom) < 0.001) return

    // 计算鼠标指向的时间点（缩放前）
    const range = viewRange.value
    const rangeMs = range.end.getTime() - range.start.getTime()
    const pixelsPerMs = canvasWidth.value / rangeMs

    // 鼠标指向的时间（毫秒）
    const timeUnderMouse = range.start.getTime() + (mouseX - renderConfig.value.offsetX) / (pixelsPerMs * oldZoom)

    // 应用新缩放
    renderConfig.value.zoom = newZoom

    // 重新计算偏移，使鼠标指向的时间保持不变
    const newPixelsPerMs = canvasWidth.value / rangeMs
    renderConfig.value.offsetX = mouseX - (timeUnderMouse - range.start.getTime()) * newPixelsPerMs * newZoom
  }

  /**
   * 按钮缩放（无鼠标中心）
   */
  const zoomIn = (): void => {
    renderConfig.value.zoom = clampZoom(renderConfig.value.zoom * (1 + ZOOM_STEP))
  }

  const zoomOut = (): void => {
    renderConfig.value.zoom = clampZoom(renderConfig.value.zoom / (1 + ZOOM_STEP))
  }

  /**
   * 重置缩放
   */
  const resetZoom = (): void => {
    renderConfig.value.zoom = 1
    renderConfig.value.offsetX = 0
  }

  /**
   * 限制缩放范围
   */
  const clampZoom = (value: number): number => {
    return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, value))
  }

  /**
   * 处理鼠标滚轮事件
   */
  const handleWheel = (event: WheelEvent): boolean => {
    // 只处理水平滚动或 Ctrl+ 垂直滚动（标准缩放行为）
    if (!event.ctrlKey && Math.abs(event.deltaX) < Math.abs(event.deltaY)) {
      return false  // 让浏览器处理垂直滚动
    }

    event.preventDefault()

    // 获取鼠标在 Canvas 中的位置（需要外部传入）
    // 这里返回一个处理函数，由调用方传入 mouseX
    return true
  }

  return {
    zoom,
    zoomAt,
    zoomIn,
    zoomOut,
    resetZoom,
    clampZoom,
    MIN_ZOOM,
    MAX_ZOOM
  }
}

// 导出类型
export type ZoomReturn = ReturnType<typeof useTimelineZoom>
