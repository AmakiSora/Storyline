export interface TimelineEvent {
  id: string;
  title: string;
  date: Date;
  content: string;
  image?: string;
  person: string;
  type: string;
}

export interface TimelineEventInput {
  title: string;
  date: string;
  content?: string;
  image?: string;
  person: string;
  type: string;
}

export type ViewMode = 'overlay' | 'lane';

export type ZoomLevel = 'year' | 'halfyear' | 'quarter' | 'month' | 'week' | 'day';

export interface TimeScale {
  pixelsPerMs: number;
  viewStart: Date;
  viewEnd: Date;
  offsetX: number;
  zoomLevel: ZoomLevel;
}

export interface ViewportBounds {
  startTime: number;
  endTime: number;
  startX: number;
  endX: number;
}

export interface ScaleTick {
  x: number;
  label: string;
  isPrimary: boolean;
  date: Date;
}

export interface EventPosition {
  event: TimelineEvent;
  x: number;
  y: number;
  lane: number;
}

export interface FilterOptions {
  persons: string[];
  types: string[];
  startDate?: Date;
  endDate?: Date;
  searchQuery: string;
}

export const PERSON_COLORS: Record<string, string> = {
  '周杰伦': '#e8b86d',
  'Artists': '#7eb8da',
  'default': '#c490bc',
};

export const TYPE_COLORS: Record<string, string> = {
  '专辑': '#e8b86d',
  '演唱会': '#7eb8da',
  '奖项': '#c490bc',
  '生活': '#8fd9a8',
  'default': '#f0a8a8',
};

export function getPersonColor(person: string): string {
  return PERSON_COLORS[person] || PERSON_COLORS.default;
}

export function getTypeColor(type: string): string {
  return TYPE_COLORS[type] || TYPE_COLORS.default;
}
