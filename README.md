# Storyline Timeline（可编辑交互时间线）

一个用于展示“故事 / 人物 / 事件”时间线的网站，前后端分离架构。前端使用 Canvas 高性能渲染时间轴与事件点，支持以鼠标为中心缩放、拖拽平移、动态刻度（年/月/日），并提供事件的增删改查与筛选搜索。

本项目支持 **多数据库**：
- **SQLite（默认）**：无需 Docker，开箱即用，数据保存在本地文件
- **PostgreSQL（可选）**：适用于多环境部署与更强查询能力

## 功能概览
- **时间线渲染（Canvas）**：横向时间轴 + 事件点绘制，支持大量数据（1000+）不卡顿
- **交互能力（重点）**：滚轮缩放（以鼠标位置为中心）、拖拽平移（Pan）、时间↔像素映射、动态刻度
- **多时间线模式**：叠加（overlay）/ 并列（lane）
- **事件信息展示**：hover tooltip、点击打开详情抽屉
- **编辑能力**：新增 / 编辑 / 删除事件（抽屉表单）
- **搜索与筛选**：人物、事件类型、时间范围、关键字
- **示例数据**：内置“周杰伦：专辑发布/演唱会历程”时间线；后端数据库为空时自动写入

## 技术栈
### 前端
- Vue 3 + TypeScript + Vite
- Pinia
- TailwindCSS
- VueUse Motion（动效）
- Canvas 2D（requestAnimationFrame 优化 + 可视区渲染裁剪）

### 后端
- Node.js + NestJS
- GraphQL（code-first）
- TypeORM
- SQLite（默认）/ PostgreSQL（可选）

## 目录结构
```text
/workspace
  ├─ frontend/   # Vue3 前端（Canvas 时间线）
  ├─ api/        # NestJS GraphQL 后端
  ├─ docker-compose.yml  # 可选：本地 PostgreSQL
  └─ README.md
```

## 快速开始（开发环境）

### 方式 A（推荐）：SQLite 本地数据库（默认）
后端默认使用 SQLite，并把数据存到 `api/data/storyline.sqlite`（可通过环境变量修改）。

```bash
cd api
cp .env.example .env
npm install
npm run start:dev
```

### 方式 B：PostgreSQL（可选）
1) 启动 PostgreSQL（需要 Docker）：
```bash
docker compose up -d
```

2) 配置后端改用 PostgreSQL（修改 api/.env）：
```env
DB_TYPE=postgres
DATABASE_URL=postgresql://storyline:storyline@localhost:5432/storyline
```

3) 启动后端：
```bash
cd api
npm install
npm run start:dev
```

### 启动前端
```bash
cd frontend
npm install
npm run dev
```

访问页面：
- http://localhost:5173

访问 GraphQL：
- http://localhost:4000/graphql

说明：
- 数据库表使用 TypeORM `synchronize: true` 自动创建（开发用）
- 当数据库中 `event` 表为空时，会自动插入示例数据

## 使用说明
### 浏览与交互
- **拖拽平移**：在画布区域按住鼠标拖动
- **滚轮缩放**：鼠标悬停画布滚轮缩放（以鼠标位置为中心）
- **Hover**：悬浮在事件点上显示 tooltip
- **点击事件点**：打开右侧详情面板

### 多时间线模式
- **叠加**：多人物/类别叠加在同一时间轴（overlay）
- **并列**：按人物分 lane 展示（lane）

### 筛选与搜索
- 顶部支持：关键字搜索、人物筛选、类型筛选、时间范围筛选

### 编辑（增删改查）
- 点击“新增事件”打开表单抽屉
- 在事件详情抽屉中可“编辑/删除”

## 接口说明（GraphQL）
后端 schema 为 code-first 自动生成，核心接口：
- Query: `events(filter)`：支持 persons、types、dateFrom、dateTo、search
- Mutation: `createEvent(input)`
- Mutation: `updateEvent(id, input)`
- Mutation: `deleteEvent(id)`

## 常见问题
### 1) 前端提示“后端未连接”
前端会自动回退到内置示例数据，仍可浏览与编辑（离线模式）。如需联调：
- 确保后端已启动并可访问 `http://localhost:4000/graphql`

### 2) SQLite 文件路径如何修改
修改 `api/.env`：
```env
DB_TYPE=sqlite
SQLITE_PATH=./data/storyline.sqlite
```
