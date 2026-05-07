import { computed, type ComputedRef, type Ref } from 'vue'

export type TimeScale = {
  timeToX: (timeMs: number) => number
  xToTime: (x: number) => number
  visibleRange: (width: number) => { fromMs: number; toMs: number }
  ticks: ComputedRef<Array<{ x: number; label: string; kind: 'year' | 'month' | 'day' }>>
}

function toUtcMidnightMs(dateLike: Date) {
  return Date.UTC(dateLike.getUTCFullYear(), dateLike.getUTCMonth(), dateLike.getUTCDate())
}

function startOfMonthUtcMs(d: Date) {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)
}

function startOfYearUtcMs(d: Date) {
  return Date.UTC(d.getUTCFullYear(), 0, 1)
}

function addMonthsUtc(ms: number, count: number) {
  const d = new Date(ms)
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + count, 1)
}

function addYearsUtc(ms: number, count: number) {
  const d = new Date(ms)
  return Date.UTC(d.getUTCFullYear() + count, 0, 1)
}

function addDaysUtc(ms: number, count: number) {
  const d = new Date(ms)
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + count)
}

function formatYear(ms: number) {
  return String(new Date(ms).getUTCFullYear())
}

function formatMonth(ms: number) {
  const d = new Date(ms)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

function formatDay(ms: number) {
  const d = new Date(ms)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function useTimeScale(params: {
  originMs: Ref<number>
  scale: Ref<number>
  offset: Ref<number>
  width: Ref<number>
}): TimeScale {
  const { originMs, scale, offset, width } = params

  const timeToX = (timeMs: number) => (timeMs - originMs.value) * scale.value + offset.value
  const xToTime = (x: number) => (x - offset.value) / scale.value + originMs.value

  const visibleRange = (w: number) => {
    const fromMs = xToTime(0)
    const toMs = xToTime(w)
    return fromMs < toMs ? { fromMs, toMs } : { fromMs: toMs, toMs: fromMs }
  }

  const ticks = computed(() => {
    const w = width.value
    if (w <= 0) return []

    const { fromMs, toMs } = visibleRange(w)
    const pxPerDay = scale.value * 24 * 60 * 60 * 1000

    let kind: 'year' | 'month' | 'day' = 'year'
    if (pxPerDay >= 18) kind = 'day'
    else if (pxPerDay >= 2.2) kind = 'month'
    else kind = 'year'

    const approxTargetPx = 110
    const targetCount = Math.max(2, Math.floor(w / approxTargetPx))
    const out: Array<{ x: number; label: string; kind: 'year' | 'month' | 'day' }> = []

    if (kind === 'year') {
      const start = startOfYearUtcMs(new Date(fromMs))
      const yearsSpan =
        Math.max(1, new Date(toMs).getUTCFullYear() - new Date(fromMs).getUTCFullYear() + 1)
      const step = Math.max(1, Math.ceil(yearsSpan / targetCount))
      for (let t = start; t <= toMs + 24 * 60 * 60 * 1000; t = addYearsUtc(t, step)) {
        const x = timeToX(t)
        if (x < -120 || x > w + 120) continue
        out.push({ x, label: formatYear(t), kind })
      }
      return out
    }

    if (kind === 'month') {
      const start = startOfMonthUtcMs(new Date(fromMs))
      const monthsSpan =
        (new Date(toMs).getUTCFullYear() - new Date(fromMs).getUTCFullYear()) * 12 +
        (new Date(toMs).getUTCMonth() - new Date(fromMs).getUTCMonth()) +
        1
      const step = Math.max(1, Math.ceil(monthsSpan / targetCount))

      for (let t = start; t <= toMs + 24 * 60 * 60 * 1000; t = addMonthsUtc(t, step)) {
        const x = timeToX(t)
        if (x < -120 || x > w + 120) continue
        out.push({ x, label: formatMonth(t), kind })
      }
      return out
    }

    const start = toUtcMidnightMs(new Date(fromMs))
    const daysSpan = Math.max(1, Math.ceil((toMs - fromMs) / (24 * 60 * 60 * 1000)))
    const step = Math.max(1, Math.ceil(daysSpan / targetCount))

    for (let t = start; t <= toMs + 24 * 60 * 60 * 1000; t = addDaysUtc(t, step)) {
      const x = timeToX(t)
      if (x < -120 || x > w + 120) continue
      out.push({ x, label: formatDay(t), kind })
    }

    return out
  })

  return { timeToX, xToTime, visibleRange, ticks }
}

