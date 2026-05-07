/**
 * useTimelinePan.ts - 时间轴拖拽（平移）算法
 *
 * 核心原理：
 * 1. 记录拖拽起始位置和当前偏移量
 * 2. 实时更新 offsetX
 * 3. 惯性滚动（可选）
 *
 * 边界处理：
 * - 不允许拖拽超出时间范围两端
 */

import { ref, type Ref } from 'vue'
import type { RenderConfig, TimeRange } from '@/types'

// 惯性参数
const FRICTION = 0.95           // 摩擦力系数
const MIN_VELOCITY = 0.5        // 最小速度阈值
const MAX_DRAG_DISTANCE = 5000  // 最大拖拽距离（像素）

export function useTimelinePan(
  renderConfig: Ref<RenderConfig>,
  viewRange: Ref<TimeRange>,
  canvasWidth: Ref<number>
) {
  const isDragging = ref(false)
  const dragStartX = ref(0)
  const dragStartOffset = ref(0)
  const velocityX = ref(0)  // 当前水平速度

  let animationFrame: number | null = null

  /**
   * 开始拖拽
   */
  const startPan = (x: number): void => {
    isDragging.value = true
    dragStartX.value = x
    dragStartOffset.value = renderConfig.value.offsetX
    velocityX.value = 0
    cancelInertia()
  }

  /**
   * 拖拽移动
   */
  const panTo = (currentX: number): void => {
    if (!isDragging.value) return

    const deltaX = currentX - dragStartX.value
    let newOffset = dragStartOffset.value + deltaX

    // 边界限制（可选）
    // newOffset = clampOffset(newOffset)

    renderConfig.value.offsetX = newOffset
  }

  /**
   * 结束拖拽，开始惯性滚动
   */
  const endPan = (currentX: number): void => {
    if (!isDragging.value) return

    isDragging.value = false

    // 计算抛出速度
    const deltaX = currentX - dragStartX.value
    velocityX.value = deltaX * 0.1  // 简化速度计算

    // 启动惯性动画
    startInertia()
  }

  /**
   * 惯性滚动动画
   */
  const startInertia = (): void => {
    cancelInertia()

    const inertia = (): void => {
      if (Math.abs(velocityX.value) < MIN_VELOCITY) {
        velocityX.value = 0
        return
      }

      renderConfig.value.offsetX += velocityX.value
      velocityX.value *= FRICTION

      animationFrame = requestAnimationFrame(inertia)
    }

    animationFrame = requestAnimationFrame(inertia)
  }

  /**
   * 取消惯性
   */
  const cancelInertia = (): void => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
      animationFrame = null
    }
  }

  /**
   * 限制偏移量（可选，防止拖出边界）
   */
  const clampOffset = (offset: number): number => {
    const { start, end } = viewRange.value
    const rangeMs = end.getTime() - start.getTime()
    const pixelsPerMs = canvasWidth.value / rangeMs
    const zoom = renderConfig.value.zoom

    const minOffset = 0  // 左边界
    const maxOffset = canvasWidth.value * zoom - canvasWidth.value  // 右边界

    return Math.max(minOffset, Math.min(maxOffset, offset))
  }

  /**
   * 处理鼠标/触摸事件
   */
  const handleMouseDown = (event: MouseEvent): void => {
    startPan(event.clientX)
  }

  const handleMouseMove = (event: MouseEvent): void => {
    panTo(event.clientX)
  }

  const handleMouseUp = (event: MouseEvent): void => {
    endPan(event.clientX)
  }

  /**
   * 程序化平移（用于按钮或自动导航）
   */
  const panBy = (deltaX: number): void => {
    renderConfig.value.offsetX += deltaX
  }

  const panToPosition = (targetOffset: number): void => {
    renderConfig.value.offsetX = targetOffset
  }

  return {
    isDragging,
    velocityX,

    // 方法
    startPan,
    panTo,
    endPan,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    panBy,
    panToPosition,
    cancelInertia
  }
}

// 导出类型
export type PanReturn = ReturnType<typeof useTimelinePan>
