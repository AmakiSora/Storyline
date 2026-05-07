# Timeline Project - 完整项目结构

## 目录结构

```
Storyline/
├── README.md                          # 项目说明
├── PROJECT_STRUCTURE.md               # 本文件
│
├── frontend/                          # Vue 3 前端
│   ├── package.json                   # 依赖配置
│   ├── vite.config.ts                 # Vite 配置
│   ├── tsconfig.json                  # TypeScript 配置
│   ├── tsconfig.node.json
│   ├── tailwind.config.js             # TailwindCSS 配置
│   ├── postcss.config.js              # PostCSS 配置
│   ├── index.html                     # HTML 入口
│   ├── .env.example                   # 环境变量示例
│   │
│   └── src/
│       ├── main.ts                    # 应用入口
│       ├── App.vue                    # 根组件
│       │
│       ├── api/
│       │   └── index.ts               # GraphQL API 客户端
│       │
│       ├── assets/
│       │   └── main.css               # 全局样式
│       │
│       ├── components/
│       │   ├── TimelineCanvas.vue     # Canvas 渲染层（核心）
│       │   ├── ControlPanel.vue       # 控制面板（缩放/筛选/模式）
│       │   ├── EditorPanel.vue        # 编辑表单面板
│       │   └── TooltipCard.vue        # 悬浮卡片
│       │
│       ├── composables/               # 核心逻辑（重点实现）
│       │   ├── useTimeScale.ts        # 时间-像素映射 + 动态刻度
│       │   ├── useTimelineZoom.ts     # 以鼠标为中心的缩放算法
│       │   ├── useTimelinePan.ts      # 拖拽（平移）算法 + 惯性
│       │   └── useTimelineFilters.ts  # 筛选逻辑
│       │
│       ├── stores/
│       │   └── timeline.ts            # Pinia 状态管理
│       │
│       └── types/
│           └── index.ts               # TypeScript 类型定义
│
└── backend/                           # NestJS 后端
    ├── package.json
    ├── tsconfig.json
    ├── nest-cli.json
    ├── .env.example
    │
    └── src/
        ├── main.ts                    # 后端入口
        ├── app.module.ts              # 根模块
        ├── schema.gql                 # GraphQL Schema
        │
        ├── database/
        │   ├── data-source.ts         # TypeORM 数据源
        │   ├── migrations/
        │   │   └── 1717500000000-InitialSchema.ts  # 数据库迁移
        │   └── seeds/
        │       └── seed.ts            # 示例数据种子
        │
        └── events/
            ├── events.module.ts       # 事件模块
            ├── events.resolver.ts     # GraphQL Resolver
            ├── events.service.ts      # 业务逻辑服务
            │
            ├── entities/
            │   ├── event.entity.ts    # 事件实体
            │   └── person.entity.ts   # 人物实体
            │
            └── dto/
                ├── create-event.input.ts  # 创建事件输入
                └── update-event.input.ts  # 更新事件输入
```

## 核心算法说明

### 1. 时间-像素映射（useTimeScale.ts）

```typescript
// 时间 → 像素
const timeToX = (date: Date): number => {
  const { start } = viewRange.value
  const startMs = start.getTime()
  const dateMs = date.getTime()
  const rangeMs = viewRange.value.end.getTime() - startMs
  const pixelsPerMs = canvasWidth.value / rangeMs
  return (dateMs - startMs) * pixelsPerMs * zoom + offsetX
}

// 像素 → 时间
const xToTime = (x: number): Date => {
  const { start, end } = viewRange.value
  const rangeMs = end.getTime() - start.getTime()
  const pixelsPerMs = canvasWidth.value / rangeMs
  const dateMs = startMs + (x - offsetX) / (pixelsPerMs * zoom)
  return new Date(dateMs)
}
```

### 2. 以鼠标为中心的缩放（useTimelineZoom.ts）

```typescript
const zoomAt = (mouseX: number, delta: number): void => {
  const oldZoom = renderConfig.value.zoom
  const newZoom = clampZoom(oldZoom * (1 + delta * SENSITIVITY))

  // 计算鼠标指向的时间点（缩放前）
  const timeUnderMouse = range.start.getTime() +
    (mouseX - offsetX) / (pixelsPerMs * oldZoom)

  // 应用新缩放
  renderConfig.value.zoom = newZoom

  // 调整偏移，使鼠标指向的时间保持不变
  renderConfig.value.offsetX = mouseX -
    (timeUnderMouse - startMs) * newPixelsPerMs * newZoom
}
```

### 3. 动态刻度生成

根据缩放级别自动选择显示粒度：
- zoom < 0.3 → 年刻度（每年一个，每5年大刻度）
- 0.3 ≤ zoom < 2 → 月刻度（每月一个，每季度大刻度）
- zoom ≥ 2 → 日刻度（每天一个，每周大刻度）

### 4. 虚拟化渲染

只渲染可视区域内的元素：
```typescript
const visibleEvents = computed(() => {
  return events.filter(event => {
    const x = timeToX(new Date(event.date))
    return x >= -padding && x <= canvasWidth + padding
  })
})
```

## 示例数据

内置三位音乐人物的时间线数据：

| 人物 | 颜色 | 事件数量 |
|------|------|----------|
| 周杰伦 | 紫色 (#8b5cf6) | 19 个事件 |
| 邓丽君 | 粉色 (#ec4899) | 8 个事件 |
| 陈奕迅 | 蓝色 (#0ea5e9) | 11 个事件 |

事件类型包括：专辑、演唱会、奖项、里程碑

## 启动说明

### 1. 启动 PostgreSQL 数据库

```bash
# 使用 Docker 快速启动
docker run -d --name timeline-db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=timeline \
  -p 5432:5432 \
  postgres:15
```

### 2. 启动后端

```bash
cd Storyline/backend
npm install
cp .env.example .env  # 根据需要修改配置
npm run seed          # 运行种子数据（可选）
npm run start:dev     # 启动开发服务器
```

后端运行在 `http://localhost:4000/graphql`

### 3. 启动前端

```bash
cd Storyline/frontend
npm install
cp .env.example .env.local
npm run dev
```

前端运行在 `http://localhost:3000`

## GraphQL API 使用示例

### 查询所有事件
```graphql
query {
  events {
    id
    title
    date
    content
    type
    person { name color }
  }
}
```

### 创建事件
```graphql
mutation {
  createEvent(input: {
    title: "新歌发布"
    date: "2024-06-01"
    content: "发布全新单曲"
    personId: "..."
    type: ALBUM
  }) {
    id
    title
  }
}
```

### 查询人物
```graphql
query {
  persons {
    id
    name
    color
    events { title date }
  }
}
```
