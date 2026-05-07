// ==================== 核心类型定义 ====================

/** 事件类型分类 */
export type EventType = 'album' | 'concert' | 'award' | 'milestone' | 'custom'

/** 人物/类别 */
export interface Person {
  id: string
  name: string
  color: string
  icon?: string
}

/** 时间线事件 */
export interface TimelineEvent {
  id: string
  title: string
  date: string        // ISO 8601 日期字符串
  content: string     // 描述正文
  image?: string      // 图片 URL
  personId: string    // 关联人物
  type: EventType     // 事件类型
  createdAt: string
  updatedAt: string
}

/** 时间轴显示模式 */
export type TimelineMode = 'overlay' | 'lane'

/** 时间范围 */
export interface TimeRange {
  start: Date
  end: Date
}

/** 筛选条件 */
export interface FilterCriteria {
  personIds: string[]      // 选中的人物ID列表
  types: EventType[]       // 选中的事件类型
  timeRange?: TimeRange    // 时间范围
  searchQuery?: string     // 搜索关键词
}

/** Canvas 渲染配置 */
export interface RenderConfig {
  zoom: number             // 缩放级别 (0.1 ~ 10)
  offsetX: number          // 水平偏移量（像素）
  laneHeight: number       // 每条时间线的高度
  eventDotRadius: number   // 事件点半径
  showGrid: boolean        // 是否显示网格
  showLabels: boolean      // 是否显示标签
}

/** 时间刻度级别 */
export type TimeScaleLevel = 'year' | 'month' | 'day'

/** 可视化事件（经过筛选和映射） */
export interface VisibleEvent extends TimelineEvent {
  x: number                // 在 Canvas 中的 X 坐标
  laneIndex: number        // 所在轨道索引
}

/** API 响应基础结构 */
export interface ApiResponse<T = any> {
  data: T
  message?: string
  error?: string
}

/** GraphQL 分页参数 */
export interface PaginationInput {
  page?: number
  pageSize?: number
}

/** GraphQL 事件输入 */
export interface CreateEventInput {
  title: string
  date: string
  content: string
  image?: string
  personId: string
  type: EventType
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: string
}
