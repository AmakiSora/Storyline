# Timeline Explorer

高性能可编辑时间轴系统 - 用于可视化展示故事、人物或事件的时间线。

## 项目介绍

Timeline Explorer 是一款以"叙事美学"为核心的时间线可视化工具。它不仅是数据的展示，更是一种讲故事的媒介。整体风格借鉴高端杂志的编辑美学与博物馆展览设计，让用户感受历史的流动与生命的轨迹。

### 核心特性

- **高性能 Canvas 渲染** - 支持 1000+ 事件流畅渲染
- **以鼠标为中心的缩放** - 滚轮缩放以鼠标位置为中心点
- **拖拽平移** - 支持惯性滑动
- **动态刻度** - 根据缩放级别自动调整（年/季度/月/周/日）
- **多时间线模式** - 叠加模式与并列模式切换
- **虚拟化渲染** - 只渲染可视区域内事件
- **CRUD 操作** - 完整的事件增删改查功能
- **搜索筛选** - 按人物、类型、时间范围筛选

## 技术栈

### 前端
- Vue 3 + TypeScript
- Vite (构建工具)
- Pinia (状态管理)
- TailwindCSS (样式)
- Canvas API (高性能渲染)

### 后端
- Node.js
- NestJS (框架)
- GraphQL (API)
- TypeScript

## 快速开始

### 前端运行

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:5173

### 后端运行

```bash
cd backend
npm install
npm run start:dev
```

API 服务运行在 http://localhost:4000/graphql

### 构建生产版本

```bash
# 前端
cd frontend
npm run build

# 后端
cd backend
npm run build
npm start
```

## 功能说明

### 时间轴交互

| 操作 | 方式 |
|------|------|
| 缩放 | 鼠标滚轮 |
| 平移 | 鼠标拖拽 |
| 查看详情 | 点击事件点 |
| 添加事件 | 双击时间轴空白区域或点击"添加事件"按钮 |
| 重置视图 | 点击"重置视图"按钮 |

### 视图模式

- **叠加模式**：所有事件叠加在同一时间轴，不同分类用颜色区分
- **并列模式**：每个人物/分类占独立行

### 筛选功能

- 按人物筛选（多选）
- 按事件类型筛选（多选）
- 按时间范围筛选
- 实时搜索（标题和描述）

### 键盘快捷键

| 按键 | 功能 |
|------|------|
| `+` | 放大 |
| `-` | 缩小 |
| `←` `→` | 左右平移 |

## 项目结构

```
timeline-explorer/
├── frontend/                    # 前端项目
│   ├── src/
│   │   ├── components/          # Vue 组件
│   │   │   ├── timeline/        # 时间轴相关组件
│   │   │   │   └── TimelineCanvas.vue   # Canvas 主渲染
│   │   │   └── ui/             # UI 组件
│   │   │       ├── TooltipCard.vue      # 悬浮卡片
│   │   │       ├── ControlPanel.vue     # 控制面板
│   │   │       ├── EditorPanel.vue      # 编辑面板
│   │   │       └── ConfirmModal.vue    # 确认弹窗
│   │   ├── composables/         # 组合式函数（核心逻辑）
│   │   │   ├── useTimeScale.ts         # 时间-像素映射
│   │   │   ├── useTimelineZoom.ts      # 缩放逻辑
│   │   │   ├── useTimelinePan.ts       # 拖拽逻辑
│   │   │   └── useTimelineRenderer.ts  # Canvas 渲染器
│   │   ├── stores/              # Pinia 状态管理
│   │   │   ├── timelineStore.ts        # 时间轴状态
│   │   │   └── editorStore.ts         # 编辑器状态
│   │   ├── types/               # TypeScript 类型定义
│   │   │   └── timeline.ts
│   │   ├── utils/               # 工具函数
│   │   │   └── dateUtils.ts
│   │   └── views/
│   │       └── TimelineView.vue       # 主页面
│   └── SPEC.md                 # 设计规格文档
│
└── backend/                     # 后端项目
    └── src/
        ├── modules/
        │   └── events/          # 事件模块
        │       ├── events.module.ts
        │       ├── events.service.ts  # 业务逻辑
        │       ├── events.resolver.ts  # GraphQL resolvers
        │       ├── entities/
        │       │   └── event.entity.ts
        │       └── dto/
        │           └── event.input.ts
        └── app.module.ts
```

## API 文档

### GraphQL Endpoint

```
POST http://localhost:4000/graphql
```

### Queries

```graphql
# 获取所有事件（支持筛选）
query {
  events(person: "周杰伦", type: "专辑") {
    id
    title
    date
    content
    image
    person
    type
  }
}

# 获取单个事件
query {
  event(id: "1") {
    id
    title
    date
    content
  }
}
```

### Mutations

```graphql
# 创建事件
mutation {
  createEvent(input: {
    title: "新专辑发布"
    date: "2025-06-01"
    content: "新专辑描述"
    person: "周杰伦"
    type: "专辑"
  }) {
    id
    title
  }
}

# 更新事件
mutation {
  updateEvent(id: "1", input: {
    title: "更新后的标题"
  }) {
    id
    title
  }
}

# 删除事件
mutation {
  deleteEvent(id: "1")
}
```

### 筛选参数

| 参数 | 类型 | 说明 |
|------|------|------|
| person | String | 按人物筛选 |
| type | String | 按事件类型筛选 |
| startDate | String | 开始日期 (YYYY-MM-DD) |
| endDate | String | 结束日期 (YYYY-MM-DD) |

## 数据结构

### TimelineEvent

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| id | ID | 是 | 唯一标识 |
| title | String | 是 | 事件标题 |
| date | String | 是 | 日期 (YYYY-MM-DD) |
| content | String | 否 | 详细描述 |
| image | String | 否 | 图片 URL |
| person | String | 是 | 关联人物 |
| type | String | 是 | 事件类型 |

## 示例数据

系统内置周杰伦音乐生涯时间线作为示例数据，包括：

- **专辑发布** (11张专辑)
- **演唱会** (6场大型巡演)
- **奖项** (重要获奖记录)
- **生活** (重要里程碑)

时间跨度从 2000 年至今。

## 性能优化

- **Canvas 虚拟化**：只渲染可视区域内的节点
- **requestAnimationFrame**：动画与渲染同步优化
- **节流处理**：缩放/拖拽 16ms 节流
- **搜索防抖**：300ms 延迟搜索

## 设计参考

- 配色方案：深邃午夜蓝 + 暖光金
- 字体：Playfair Display (标题) + Inter (正文) + JetBrains Mono (数据)
- 动效：cubic-bezier(0.4, 0, 0.2, 1)，200-400ms

## License

MIT
