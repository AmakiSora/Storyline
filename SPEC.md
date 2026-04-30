# Timeline Explorer - 高性能可编辑时间轴系统

## 1. 概念与愿景

一款以"叙事美学"为核心的时间线可视化工具。它不仅是数据的展示，更是一种讲故事的媒介。整体风格借鉴高端杂志的编辑美学与博物馆展览设计，让用户感受历史的流动与生命的轨迹。交互流畅如丝绸，视觉呈现精致而不喧哗。

## 2. 设计语言

### 美学方向
参考《纽约时报》的交互式专题、博物馆时间线展览、以及高端音乐流媒体的艺术化专辑介绍页。

### 色彩系统
```css
:root {
  /* 主色调 - 深邃午夜蓝 */
  --color-primary: #1a1a2e;
  --color-primary-light: #25253d;

  /* 强调色 - 暖光金 */
  --color-accent: #e8b86d;
  --color-accent-hover: #f0c97a;

  /* 时间轴线条 */
  --color-axis: #3d3d5c;
  --color-axis-highlight: #5d5d8c;

  /* 人物/事件分类色板 */
  --color-person-1: #e8b86d;  /* 金色 */
  --color-person-2: #7eb8da;  /* 天蓝 */
  --color-person-3: #c490bc;  /* 紫罗兰 */
  --color-person-4: #8fd9a8;  /* 薄荷绿 */
  --color-person-5: #f0a8a8;  /* 珊瑚粉 */

  /* 背景层次 */
  --bg-deep: #0f0f1a;
  --bg-main: #16162a;
  --bg-card: #1e1e35;
  --bg-elevated: #2a2a45;

  /* 文字 */
  --text-primary: #f5f5f7;
  --text-secondary: #a0a0b8;
  --text-muted: #6d6d85;

  /* 功能色 */
  --color-success: #6dd9a8;
  --color-warning: #e8b86d;
  --color-error: #e87d7d;
}
```

### 字体系统
- 标题：`Playfair Display`（衬线，高端杂志感）
- 正文：`Inter`（清晰易读）
- 时间/数据：`JetBrains Mono`（等宽，技术感）

### 空间系统
- 基础单位：8px
- 间距递进：8, 16, 24, 32, 48, 64, 96px
- 圆角：小元素 4px，卡片 12px，模态框 16px

### 动效哲学
- 所有过渡使用 `cubic-bezier(0.4, 0, 0.2, 1)`，时长 200-400ms
- 时间轴缩放：弹性感强，轻微过冲
- 事件点 hover：发光效果渐显，150ms
- 面板展开：slide + fade，时长 300ms
- 滚动虚拟化：确保60fps流畅度

### 视觉资产
- 图标：Lucide Icons（线条简洁，与整体风格匹配）
- 装饰元素：细线条、微妙渐变、光晕效果
- 空状态：优雅的SVG插画

## 3. 布局与结构

### 页面架构
```
┌─────────────────────────────────────────────────────────┐
│  Header: Logo + 标题 + 视图切换 + 主题色                 │
├─────────────────────────────────────────────────────────┤
│  ControlPanel: 缩放控制 + 筛选器 + 搜索 + 模式切换      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│                   TimelineCanvas                        │
│         (Canvas 渲染层 - 核心可视化区域)                  │
│                                                         │
│    ═══════════●──────●──────●──────●══════════════      │
│              │      │      │      │                     │
│              ▼      ▼      ▼      ▼                     │
│           [卡片] [卡片] [卡片] [卡片]                     │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  MiniMap: 缩略导航（可选）                               │
└─────────────────────────────────────────────────────────┘

[EditorPanel: 侧边抽屉 - 编辑表单]
[TooltipCard: 悬浮卡片 - 事件详情]
```

### 响应式策略
- 桌面端（>1200px）：完整布局，支持所有功能
- 平板端（768-1200px）：ControlPanel 折叠为下拉
- 移动端（<768px）：纵向时间轴模式，简化交互

## 4. 功能与交互

### 4.1 时间轴核心功能

#### 时间→像素映射
```
x = (timestamp - viewStartTimestamp) * pixelsPerMillisecond + offsetX
```
- `pixelsPerMillisecond` 随缩放级别变化
- 基准缩放：1年 = 200px

#### 缩放（Zoom）
- 鼠标滚轮缩放，以鼠标位置为中心
- 缩放级别：年 → 半年 → 季度 → 月 → 周 → 日
- 动态刻度标签随之变化
- 使用 `requestAnimationFrame` 节流，16ms间隔

#### 拖拽（Pan）
- 鼠标拖拽横向移动时间轴
- 支持惯性滑动（velocity-based）
- 边界限制：不能拖出数据范围太远

#### 动态刻度
| 缩放级别 | 主刻度 | 次刻度 | 标签格式 |
|---------|-------|-------|---------|
| 年视图   | 年     | 季度   | "2024"  |
| 半年视图 | 月     | 周     | "Jun"   |
| 月视图   | 周     | 日     | "15"    |
| 周视图   | 日     | 小时   | "Mon 15"|

### 4.2 事件点交互

#### Hover 行为
- 延迟 100ms 显示 tooltip（避免频繁触发）
- 事件点发光效果增强
- tooltip 智能定位（不超出视口）

#### Click 行为
- 打开详情面板（EditorPanel）
- 面板从右侧滑入
- 背景添加半透明遮罩

#### 事件分类视觉
- 每个分类/人物有独立颜色
- 图例显示在 ControlPanel
- 叠加模式下用透明度区分

### 4.3 多时间线模式

#### 叠加模式（Overlay）
- 所有事件叠加在同一时间轴
- 不同分类用颜色区分
- 透明度：0.6（重叠时可见）

#### 并列模式（Lane）
- 每个人物/分类占独立行
- 行之间有明确分隔
- 中间主轴为时间参考线

### 4.4 编辑功能

#### 新增事件
- 点击时间轴空白区域或点击 "+" 按钮
- 弹出表单，默认时间 = 点击位置对应时间
- 支持拖拽调整时间

#### 编辑事件
- 点击事件 → 右侧面板打开
- 表单预填充当前数据
- 保存时实时预览更新

#### 删除事件
- 编辑面板中有删除按钮（危险操作红色）
- 需二次确认

### 4.5 搜索与筛选

#### 筛选维度
- 人物/分类（多选）
- 事件类型（多选）
- 时间范围（日期区间选择器）

#### 搜索
- 实时搜索（300ms debounce）
- 搜索标题和描述
- 匹配项高亮

### 4.6 键盘快捷键
- `+/-`: 缩放
- `←/→`: 拖拽移动
- `Home`: 回到起始点
- `End`: 跳转到结束点
- `Escape`: 关闭面板/tooltip

## 5. 组件清单

### TimelineCanvas.vue（核心）
- **外观**：深色背景网格，中心水平轴线
- **状态**：默认/缩放中/拖拽中/选中事件
- **Canvas 绘制内容**：
  - 背景网格（依缩放级别）
  - 主时间轴线
  - 时间刻度（主 + 次）
  - 事件节点（圆形/方形/图标）
  - 缩放/拖拽时的视觉反馈

### TimelineAxis.vue
- **外观**：刻度线和标签，与 Canvas 同步
- **状态**：随缩放级别变化刻度格式

### TimelineEvent.vue（事件节点DOM封装）
- **外观**：圆点/卡片，根据分类着色
- **状态**：默认/hover/selected
- **Motion**：hover时scale 1.2 + 发光

### TooltipCard.vue
- **外观**：磨砂玻璃效果，圆角，内容包括标题/时间/描述/图片
- **状态**：显示/隐藏/加载中
- **定位**：智能定位，动画淡入

### ControlPanel.vue
- **外观**：顶部工具栏，深色半透明背景
- **包含**：
  - 缩放控制（滑块 + 按钮）
  - 模式切换（叠加/并列）
  - 分类筛选器
  - 时间范围选择器
  - 搜索框

### EditorPanel.vue
- **外观**：右侧抽屉，表单布局
- **状态**：创建/编辑/只读
- **动画**：slide-in from right, 300ms

### ConfirmModal.vue
- **外观**：居中模态框，磨砂背景
- **用途**：删除确认等危险操作

## 6. 技术实现

### 前端架构

```
frontend/
├── src/
│   ├── components/
│   │   ├── timeline/
│   │   │   ├── TimelineCanvas.vue    # Canvas 主渲染
│   │   │   ├── TimelineAxis.vue      # 刻度渲染
│   │   │   └── EventNode.vue         # 事件节点
│   │   ├── ui/
│   │   │   ├── TooltipCard.vue
│   │   │   ├── ControlPanel.vue
│   │   │   ├── EditorPanel.vue
│   │   │   └── ConfirmModal.vue
│   │   └── layout/
│   │       └── AppHeader.vue
│   ├── composables/
│   │   ├── useTimelineZoom.ts        # 缩放逻辑
│   │   ├── useTimelinePan.ts         # 拖拽逻辑
│   │   ├── useTimeScale.ts           # 时间-像素映射
│   │   ├── useTimelineRenderer.ts    # Canvas 渲染器
│   │   └── useEventInteraction.ts    # 事件交互处理
│   ├── stores/
│   │   ├── timelineStore.ts          # 时间轴状态
│   │   └── editorStore.ts            # 编辑器状态
│   ├── views/
│   │   └── TimelineView.vue
│   ├── types/
│   │   └── timeline.ts
│   ├── utils/
│   │   └── dateUtils.ts
│   └── App.vue
```

### 核心算法

#### 时间→像素映射
```typescript
function timeToX(
  date: Date,
  viewStart: Date,
  pixelsPerMs: number,
  offsetX: number
): number {
  return (date.getTime() - viewStart.getTime()) * pixelsPerMs + offsetX;
}

function xToTime(
  x: number,
  viewStart: Date,
  pixelsPerMs: number,
  offsetX: number
): Date {
  return new Date((x - offsetX) / pixelsPerMs + viewStart.getTime());
}
```

#### 缩放算法（以鼠标为中心）
```typescript
function zoomAtPoint(
  delta: number,
  mouseX: number,
  currentPpm: number,
  viewStart: Date,
  offsetX: number
): { newPpm: number; newOffsetX: number } {
  const timeAtMouse = xToTime(mouseX, viewStart, currentPpm, offsetX);
  const newPpm = clamp(currentPpm * (1 + delta * 0.001), minPpm, maxPpm);
  const newOffsetX = mouseX - (timeAtMouse.getTime() - viewStart.getTime()) * newPpm;
  return { newPpm, newOffsetX };
}
```

#### 虚拟化渲染
```typescript
function getVisibleEvents(
  events: TimelineEvent[],
  viewStart: Date,
  viewEnd: Date,
  ppm: number,
  offsetX: number
): TimelineEvent[] {
  const minX = -offsetX / ppm + viewStart.getTime();
  const maxX = (canvasWidth - offsetX) / ppm + viewStart.getTime();

  return events.filter(e =>
    e.date.getTime() >= minX && e.date.getTime() <= maxX
  );
}
```

### 后端架构

```
backend/
├── src/
│   ├── modules/
│   │   └── events/
│   │       ├── events.module.ts
│   │       ├── events.service.ts
│   │       ├── events.resolver.ts   # GraphQL resolver
│   │       └── entities/
│   │           └── event.entity.ts
│   ├── app.module.ts
│   └── main.ts
```

### GraphQL Schema
```graphql
type Event {
  id: ID!
  title: String!
  date: String!
  content: String
  image: String
  person: String!
  type: String!
}

type Query {
  events(person: String, type: String, startDate: String, endDate: String): [Event!]!
  event(id: ID!): Event
}

type Mutation {
  createEvent(input: CreateEventInput!): Event!
  updateEvent(id: ID!, input: UpdateEventInput!): Event!
  deleteEvent(id: ID!): Boolean!
}
```

### 数据模型
```typescript
interface TimelineEvent {
  id: string;
  title: string;
  date: Date;
  content: string;
  image?: string;
  person: string;    // 人物/角色
  type: string;      // 事件类型：专辑/演唱会/奖项/生活
}
```

### 示例数据（音乐人物 - 周杰伦）
```json
[
  {
    "id": "1",
    "title": "Jay同名专辑",
    "date": "2000-11-07",
    "content": "首张专辑《Jay》，开创华语乐坛新风格",
    "image": "https://...",
    "person": "周杰伦",
    "type": "专辑"
  },
  {
    "id": "2",
    "title": "范特西专辑",
    "date": "2001-09-14",
    "content": "第二张专辑《范特西》，包含《双截棍》《简单爱》等经典",
    "person": "周杰伦",
    "type": "专辑"
  },
  // ... 更多事件
]
```

## 7. 性能优化

### Canvas 渲染优化
- 使用离屏 Canvas 预渲染静态元素
- 事件节点批量绘制
- 使用 `requestAnimationFrame` 同步重绘
- 只渲染可视区域内的元素（虚拟化）

### 交互优化
- 缩放/拖拽使用 `requestAnimationFrame` 节流（16ms）
- 搜索使用 `debounce`（300ms）
- Tooltip 显示延迟（100ms）

### 内存优化
- 事件数据使用 ` shallowRef`
- 避免在渲染中创建新对象

## 8. 代码质量

- 所有组件使用 `<script setup lang="ts">`
- 类型定义完整，无 `any`
- 关键算法有注释
- 错误边界处理
- 加载状态和空状态处理
