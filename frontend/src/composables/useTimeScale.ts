import { ref, computed, type Ref } from 'vue';
import { clamp } from '../utils/dateUtils';
import type { TimeScale, ZoomLevel } from '../types/timeline';

const MIN_PIXELS_PER_MS = 0.0001;
const MAX_PIXELS_PER_MS = 0.1;
const ZOOM_FACTOR = 0.001;

interface UseTimeScaleOptions {
  initialViewStart?: Date;
  initialViewEnd?: Date;
  initialPpm?: number;
}

interface UseTimeScaleReturn {
  timeScale: Ref<TimeScale>;
  timeToX: (date: Date) => number;
  xToTime: (x: number) => Date;
  zoomAtPoint: (delta: number, mouseX: number) => void;
  setZoomLevel: (level: ZoomLevel) => void;
  pan: (deltaX: number) => void;
  resetView: () => void;
  setViewRange: (start: Date, end: Date) => void;
}

const ZOOM_LEVEL_CONFIG: Record<ZoomLevel, { ppm: number; label: string }> = {
  year: { ppm: 0.0000064, label: '年' },
  halfyear: { ppm: 0.0000128, label: '半年' },
  quarter: { ppm: 0.0000256, label: '季度' },
  month: { ppm: 0.0001, label: '月' },
  week: { ppm: 0.0004, label: '周' },
  day: { ppm: 0.0028, label: '日' },
};

export function useTimeScale(
  canvasWidth: Ref<number>,
  options: UseTimeScaleOptions = {}
): UseTimeScaleReturn {
  const today = new Date();
  const defaultViewStart = options.initialViewStart || new Date(today.getFullYear() - 5, 0, 1);
  const defaultViewEnd = options.initialViewEnd || new Date(today.getFullYear() + 2, 0, 1);
  const defaultPpm = options.initialPpm || ZOOM_LEVEL_CONFIG.year.ppm;

  const viewStart = ref(defaultViewStart);
  const viewEnd = ref(defaultViewEnd);
  const pixelsPerMs = ref(defaultPpm);
  const offsetX = ref(canvasWidth.value / 2);

  const timeScale = computed<TimeScale>(() => ({
    pixelsPerMs: pixelsPerMs.value,
    viewStart: viewStart.value,
    viewEnd: viewEnd.value,
    offsetX: offsetX.value,
    zoomLevel: getCurrentZoomLevel(),
  }));

  function getCurrentZoomLevel(): ZoomLevel {
    const ppm = pixelsPerMs.value;
    if (ppm <= ZOOM_LEVEL_CONFIG.year.ppm * 1.5) return 'year';
    if (ppm <= ZOOM_LEVEL_CONFIG.halfyear.ppm * 1.5) return 'halfyear';
    if (ppm <= ZOOM_LEVEL_CONFIG.quarter.ppm * 1.5) return 'quarter';
    if (ppm <= ZOOM_LEVEL_CONFIG.month.ppm * 1.5) return 'month';
    if (ppm <= ZOOM_LEVEL_CONFIG.week.ppm * 1.5) return 'week';
    return 'day';
  }

  function timeToX(date: Date): number {
    return (date.getTime() - viewStart.value.getTime()) * pixelsPerMs.value + offsetX.value;
  }

  function xToTime(x: number): Date {
    return new Date((x - offsetX.value) / pixelsPerMs.value + viewStart.value.getTime());
  }

  function zoomAtPoint(delta: number, mouseX: number): void {
    const timeAtMouse = xToTime(mouseX);
    const newPpm = clamp(
      pixelsPerMs.value * (1 - delta * ZOOM_FACTOR),
      MIN_PIXELS_PER_MS,
      MAX_PIXELS_PER_MS
    );

    const newOffsetX = mouseX - (timeAtMouse.getTime() - viewStart.value.getTime()) * newPpm;

    pixelsPerMs.value = newPpm;
    offsetX.value = newOffsetX;
  }

  function setZoomLevel(level: ZoomLevel): void {
    const config = ZOOM_LEVEL_CONFIG[level];
    const centerTime = xToTime(canvasWidth.value / 2);
    pixelsPerMs.value = config.ppm;
    offsetX.value = canvasWidth.value / 2 - (centerTime.getTime() - viewStart.value.getTime()) * config.ppm;
  }

  function pan(deltaX: number): void {
    offsetX.value += deltaX;
  }

  function resetView(): void {
    viewStart.value = defaultViewStart;
    viewEnd.value = defaultViewEnd;
    pixelsPerMs.value = defaultPpm;
    offsetX.value = canvasWidth.value / 2;
  }

  function setViewRange(start: Date, end: Date): void {
    viewStart.value = start;
    viewEnd.value = end;
  }

  return {
    timeScale,
    timeToX,
    xToTime,
    zoomAtPoint,
    setZoomLevel,
    pan,
    resetView,
    setViewRange,
  };
}
