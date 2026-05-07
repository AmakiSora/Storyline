/**
 * useTimeScale.ts - 时间-像素映射核心算法
 *
 * 核心功能：
 * 1. 时间 → 像素的线性映射
 * 2. 动态刻度生成（根据缩放级别自动选择年/月/日）
 * 3. 像素 → 时间的反向映射
 */

import { ref, computed, type Ref } from 'vue'
import type { TimeRange, TimeScaleLevel, RenderConfig } from '@/types'

// 常量定义
const MIN_ZOOM = 0.1
const MAX_ZOOM = 10
const BASE_PIXELS_PER_YEAR = 200  // 基准：1年 = 200像素（zoom=1时）

export function useTimeScale(
  viewRange: Ref<TimeRange>,
  canvasWidth: Ref<number>,
  renderConfig: Ref<RenderConfig>
) {
  // ==================== 核心映射函数 ====================

  /**
   * 将时间戳映射到 Canvas X 坐标
   * 公式：x = (timestamp - range.start) * pixelsPerMs * zoom + offsetX
   */
  const timeToX = (date: Date): number => {
    const { start } = viewRange.value
    const startMs = start.getTime()
    const dateMs = date.getTime()
    const rangeMs = viewRange.value.end.getTime() - startMs
    const pixelsPerMs = canvasWidth.value / rangeMs
    const zoom = renderConfig.value.zoom
    const offsetX = renderConfig.value.offsetX

    return (dateMs - startMs) * pixelsPerMs * zoom + offsetX
  }

  /**
   * 将 Canvas X 坐标反向映射到时间
   * 公式：timestamp = start + (x - offsetX) / (pixelsPerMs * zoom)
   */
  const xToTime = (x: number): Date => {
    const { start, end } = viewRange.value
    const startMs = start.getTime()
    const rangeMs = end.getTime() - startMs
    const pixelsPerMs = canvasWidth.value / rangeMs
    const zoom = renderConfig.value.zoom
    const offsetX = renderConfig.value.offsetX

    const dateMs = startMs + (x - offsetX) / (pixelsPerMs * zoom)
    return new Date(dateMs)
  }

  /**
   * 获取当前缩放级别对应的时间刻度
   * 缩放越小（zoom < 0.3）→ 显示年
   * 缩放中等（0.3 ~ 2）→ 显示月
   * 缩放较大（zoom > 2）→ 显示日
   */
  const scaleLevel = computed((): TimeScaleLevel => {
    const zoom = renderConfig.value.zoom
    if (zoom < 0.3) return 'year'
    if (zoom < 2) return 'month'
    return 'day'
  })

  /**
   * 生成刻度线数据
   * 根据当前时间范围和缩放级别，生成可视区域内的刻度
   */
  const generateTicks = (): Array<{ date: Date; label: string; x: number; major: boolean }> => {
    const { start, end } = viewRange.value
    const level = scaleLevel.value
    const ticks: Array<{ date: Date; label: string; x: number; major: boolean }> = []

    const rangeMs = end.getTime() - start.getTime()
    const rangeYears = rangeMs / (365.25 * 24 * 60 * 60 * 1000)

    let intervalMs: number
    let format: (d: Date) => string

    switch (level) {
      case 'year':
        // 每年一个刻度，大刻度每5年
        intervalMs = 365.25 * 24 * 60 * 60 * 1000
        format = (d) => d.getFullYear().toString()
        break
      case 'month':
        // 每月一个刻度，大刻度每季度
        intervalMs = 30.44 * 24 * 60 * 60 * 1000
        format = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        break
      case 'day':
        // 每天一个刻度，大刻度每周
        intervalMs = 24 * 60 * 60 * 1000
        format = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        break
    }

    // 从范围开始生成刻度
    let current = new Date(start)
    // 对齐到刻度边界
    alignToInterval(current, intervalMs, level)

    const zoom = renderConfig.value.zoom
    const offsetX = renderConfig.value.offsetX
    const rangePixels = canvasWidth.value * zoom

    while (current.getTime() <= end.getTime()) {
      const x = timeToX(current)

      // 只添加可视区域内的刻度
      if (x >= -50 && x <= canvasWidth.value + 50) {
        // 判断是否为大刻度
        let major = false
        if (level === 'year') {
          major = current.getFullYear() % 5 === 0
        } else if (level === 'month') {
          major = current.getMonth() % 3 === 0
        } else if (level === 'day') {
          major = current.getDay() === 0 // 周日
        }

        ticks.push({
          date: new Date(current),
          label: format(current),
          x,
          major
        })
      }

      current = new Date(current.getTime() + intervalMs)
    }

    return ticks
  }

  /**
   * 将日期对齐到时间间隔边界
   */
  const alignToInterval = (date: Date, intervalMs: number, level: TimeScaleLevel): void => {
    if (level === 'year') {
      date.setMonth(0, 1)
      date.setHours(0, 0, 0, 0)
    } else if (level === 'month') {
      date.setDate(1)
      date.setHours(0, 0, 0, 0)
    } else if (level === 'day') {
      date.setHours(0, 0, 0, 0)
    }
  }

  /**
   * 获取时间范围跨度（年）
   */
  const rangeSpan = computed(() => {
    const { start, end } = viewRange.value
    return (end.getTime() - start.getTime()) / (365.25 * 24 * 60 * 60 * 1000)
  })

  /**
   * 根据事件数量自动调整视图范围
   */
  const autoFit = (events: { date: Date }[]): void => {
    if (events.length === 0) return

    const dates = events.map(e => e.date.getTime())
    const min = Math.min(...dates)
    const max = Math.max(...dates)

    // 添加边距（总跨度的 10%）
    const margin = (max - min) * 0.1
    viewRange.value = {
      start: new Date(min - margin),
      end: new Date(max + margin)
    }
    renderConfig.value.zoom = 1
    renderConfig.value.offsetX = 0
  }

  /**
   * 将视图居中到指定时间
   */
  const centerOnTime = (date: Date): void => {
    const x = timeToX(date)
    const centerX = canvasWidth.value / 2
    renderConfig.value.offsetX += centerX - x
  }

  return {
    // 核心映射
    timeToX,
    xToTime,

    // 计算属性
    scaleLevel,
    rangeSpan,

    // 方法
    generateTicks,
    autoFit,
    centerOnTime
  }
}

// 导出类型
export type TimeScaleReturn = ReturnType<typeof useTimeScale>
