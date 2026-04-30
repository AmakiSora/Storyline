import { ref, watch, onMounted, onUnmounted, type Ref } from 'vue';
import type { TimelineEvent, ScaleTick, EventPosition, TimeScale, FilterOptions, ViewMode } from '../types/timeline';
import { getPersonColor } from '../types/timeline';
import { formatDate } from '../utils/dateUtils';

interface UseTimelineRendererOptions {
  canvasRef: Ref<HTMLCanvasElement | null>;
  timeScale: Ref<TimeScale>;
  events: Ref<TimelineEvent[]>;
  filterOptions: Ref<FilterOptions>;
  viewMode: Ref<ViewMode>;
  lanes: Ref<number>;
  height?: number;
}

interface UseTimelineRendererReturn {
  canvasWidth: Ref<number>;
  canvasHeight: Ref<number>;
  eventPositions: Ref<EventPosition[]>;
  ticks: Ref<ScaleTick[]>;
  hoveredEvent: Ref<TimelineEvent | null>;
  selectedEvent: Ref<TimelineEvent | null>;
  handleClick: (event: MouseEvent) => void;
  handleMouseMove: (event: MouseEvent) => void;
  handleMouseLeave: () => void;
}

const AXIS_HEIGHT = 60;
const EVENT_SIZE = 12;
const LANE_HEIGHT = 80;

export function useTimelineRenderer(options: UseTimelineRendererOptions): UseTimelineRendererReturn {
  const {
    canvasRef,
    timeScale,
    events,
    filterOptions,
    viewMode,
    lanes,
    height = 400,
  } = options;

  const canvasWidth = ref(800);
  const canvasHeight = ref(height);
  const eventPositions = ref<EventPosition[]>([]);
  const ticks = ref<ScaleTick[]>([]);
  const hoveredEvent = ref<TimelineEvent | null>(null);
  const selectedEvent = ref<TimelineEvent | null>(null);

  let animationFrameId: number | null = null;
  let ctx: CanvasRenderingContext2D | null = null;

  function getFilteredEvents(): TimelineEvent[] {
    return events.value.filter(event => {
      if (filterOptions.value.persons.length > 0 && !filterOptions.value.persons.includes(event.person)) {
        return false;
      }
      if (filterOptions.value.types.length > 0 && !filterOptions.value.types.includes(event.type)) {
        return false;
      }
      if (filterOptions.value.startDate && event.date < filterOptions.value.startDate) {
        return false;
      }
      if (filterOptions.value.endDate && event.date > filterOptions.value.endDate) {
        return false;
      }
      if (filterOptions.value.searchQuery) {
        const query = filterOptions.value.searchQuery.toLowerCase();
        return event.title.toLowerCase().includes(query) || event.content.toLowerCase().includes(query);
      }
      return true;
    });
  }

  function calculateTicks(): ScaleTick[] {
    const result: ScaleTick[] = [];
    const { pixelsPerMs, viewStart, offsetX } = timeScale.value;

    const visibleStartMs = (-offsetX / pixelsPerMs) + viewStart.getTime();
    const visibleEndMs = ((canvasWidth.value - offsetX) / pixelsPerMs) + viewStart.getTime();

    const visibleStart = new Date(visibleStartMs);
    const visibleEnd = new Date(visibleEndMs);

    let tickInterval: number;
    let labelFormat: string;

    if (pixelsPerMs < 0.00002) {
      tickInterval = 365.25 * 24 * 60 * 60 * 1000;
      labelFormat = 'year';
    } else if (pixelsPerMs < 0.00005) {
      tickInterval = 365.25 * 24 * 60 * 60 * 1000 / 2;
      labelFormat = 'halfyear';
    } else if (pixelsPerMs < 0.00015) {
      tickInterval = 365.25 * 24 * 60 * 60 * 1000 / 4;
      labelFormat = 'quarter';
    } else if (pixelsPerMs < 0.0005) {
      tickInterval = 30 * 24 * 60 * 60 * 1000;
      labelFormat = 'month';
    } else if (pixelsPerMs < 0.002) {
      tickInterval = 7 * 24 * 60 * 60 * 1000;
      labelFormat = 'week';
    } else {
      tickInterval = 24 * 60 * 60 * 1000;
      labelFormat = 'day';
    }

    const firstTick = new Date(Math.ceil(visibleStart.getTime() / tickInterval) * tickInterval);

    for (let date = new Date(firstTick); date.getTime() <= visibleEnd.getTime(); date = new Date(date.getTime() + tickInterval)) {
      const x = (date.getTime() - viewStart.getTime()) * pixelsPerMs + offsetX;
      if (x >= -50 && x <= canvasWidth.value + 50) {
        const isPrimary = date.getMonth() % (labelFormat === 'year' ? 4 : 1) === 0;
        result.push({
          x,
          label: formatDate(date, labelFormat),
          isPrimary,
          date: new Date(date),
        });
      }
    }

    return result;
  }

  function calculateEventPositions(): EventPosition[] {
    const positions: EventPosition[] = [];
    const filtered = getFilteredEvents();
    const { pixelsPerMs, viewStart, offsetX } = timeScale.value;

    if (viewMode.value === 'lane') {
      const personMap = new Map<string, number>();
      const uniquePersons = [...new Set(filtered.map(e => e.person))];

      uniquePersons.forEach((person, index) => {
        personMap.set(person, index);
      });

      filtered.forEach(event => {
        const lane = personMap.get(event.person) || 0;
        const x = (event.date.getTime() - viewStart.getTime()) * pixelsPerMs + offsetX;
        const y = AXIS_HEIGHT + LANE_HEIGHT * lane + LANE_HEIGHT / 2;

        if (x >= -50 && x <= canvasWidth.value + 50) {
          positions.push({ event, x, y, lane });
        }
      });
    } else {
      filtered.forEach(event => {
        const x = (event.date.getTime() - viewStart.getTime()) * pixelsPerMs + offsetX;
        const y = canvasHeight.value / 2;

        if (x >= -50 && x <= canvasWidth.value + 50) {
          positions.push({ event, x, y, lane: 0 });
        }
      });
    }

    return positions;
  }

  function drawBackground(): void {
    if (!ctx) return;
    ctx.fillStyle = '#0f0f1a';
    ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);

    ctx.strokeStyle = '#1e1e35';
    ctx.lineWidth = 1;

    const gridSize = 50;
    for (let x = 0; x <= canvasWidth.value; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasHeight.value);
      ctx.stroke();
    }
    for (let y = 0; y <= canvasHeight.value; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasWidth.value, y);
      ctx.stroke();
    }
  }

  function drawAxis(): void {
    if (!ctx) return;

    const axisY = AXIS_HEIGHT - 10;

    ctx.strokeStyle = '#3d3d5c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, axisY);
    ctx.lineTo(canvasWidth.value, axisY);
    ctx.stroke();

    ticks.value.forEach(tick => {
      ctx!.strokeStyle = tick.isPrimary ? '#5d5d8c' : '#3d3d5c';
      ctx!.lineWidth = tick.isPrimary ? 2 : 1;
      ctx!.beginPath();
      ctx!.moveTo(tick.x, axisY);
      ctx!.lineTo(tick.x, axisY + (tick.isPrimary ? 15 : 10));
      ctx!.stroke();

      ctx!.fillStyle = tick.isPrimary ? '#f5f5f7' : '#6d6d85';
      ctx!.font = tick.isPrimary ? '14px Inter' : '12px Inter';
      ctx!.textAlign = 'center';
      ctx!.fillText(tick.label, tick.x, axisY + 35);
    });
  }

  function drawEventNodes(): void {
    if (!ctx) return;

    eventPositions.value.forEach(pos => {
      const { event, x, y } = pos;
      const color = getPersonColor(event.person);
      const isHovered = hoveredEvent.value?.id === event.id;
      const isSelected = selectedEvent.value?.id === event.id;

      const size = EVENT_SIZE * (isHovered ? 1.3 : 1) * (isSelected ? 1.2 : 1);

      ctx!.beginPath();
      ctx!.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx!.fillStyle = color;
      ctx!.fill();

      if (isHovered || isSelected) {
        ctx!.shadowColor = color;
        ctx!.shadowBlur = 20;
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }

      ctx!.strokeStyle = isSelected ? '#fff' : 'rgba(0,0,0,0.3)';
      ctx!.lineWidth = isSelected ? 2 : 1;
      ctx!.stroke();

      if (viewMode.value === 'lane') {
        ctx!.fillStyle = '#a0a0b8';
        ctx!.font = '11px Inter';
        ctx!.textAlign = 'center';
        ctx!.fillText(event.person, x, y + LANE_HEIGHT / 2 - 10);
      }
    });
  }

  function drawConnectionLines(): void {
    if (!ctx || viewMode.value !== 'lane') return;

    const laneGroups = new Map<number, EventPosition[]>();

    eventPositions.value.forEach(pos => {
      if (!laneGroups.has(pos.lane)) {
        laneGroups.set(pos.lane, []);
      }
      laneGroups.get(pos.lane)!.push(pos);
    });

    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;

    laneGroups.forEach((positions) => {
      positions.sort((a, b) => a.x - b.x);

      for (let i = 0; i < positions.length - 1; i++) {
        const current = positions[i];
        const next = positions[i + 1];

        if (next.x - current.x < 150) {
          ctx!.beginPath();
          ctx!.moveTo(current.x, current.y);
          ctx!.lineTo(next.x, next.y);
          ctx!.stroke();
        }
      }
    });
  }

  function render(): void {
    if (!ctx || !canvasRef.value) return;

    ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);

    drawBackground();
    drawAxis();
    drawConnectionLines();
    drawEventNodes();

    animationFrameId = requestAnimationFrame(render);
  }

  function updateCanvasSize(): void {
    const canvas = canvasRef.value;
    if (!canvas) return;

    const rect = canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      canvasWidth.value = rect.width;
      canvasHeight.value = height;

      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${height}px`;

      ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    }
  }

  function getEventAtPosition(clientX: number, clientY: number): TimelineEvent | null {
    const canvas = canvasRef.value;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    for (const pos of eventPositions.value) {
      const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
      if (distance <= EVENT_SIZE) {
        return pos.event;
      }
    }

    return null;
  }

  function handleClick(event: MouseEvent): void {
    const clickedEvent = getEventAtPosition(event.clientX, event.clientY);
    selectedEvent.value = clickedEvent;
  }

  function handleMouseMove(event: MouseEvent): void {
    const hovered = getEventAtPosition(event.clientX, event.clientY);
    hoveredEvent.value = hovered;

    const canvas = canvasRef.value;
    if (canvas) {
      canvas.style.cursor = hovered ? 'pointer' : 'grab';
    }
  }

  function handleMouseLeave(): void {
    hoveredEvent.value = null;
  }

  watch([timeScale, events, filterOptions, viewMode, lanes], () => {
    ticks.value = calculateTicks();
    eventPositions.value = calculateEventPositions();
  }, { deep: true, immediate: true });

  watch(canvasWidth, () => {
    ticks.value = calculateTicks();
    eventPositions.value = calculateEventPositions();
  });

  onMounted(() => {
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    render();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', updateCanvasSize);
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
  });

  return {
    canvasWidth,
    canvasHeight,
    eventPositions,
    ticks,
    hoveredEvent,
    selectedEvent,
    handleClick,
    handleMouseMove,
    handleMouseLeave,
  };
}
