# Timeline Project - 可交互时间线系统

一个高性能、可交互的时间线可视化与编辑平台。

## 技术栈

### 前端
- Vue 3 + TypeScript + Vite
- Pinia 状态管理
- TailwindCSS 样式
- Canvas 高性能渲染
- Motion One 动画

### 后端
- NestJS
- GraphQL
- PostgreSQL

## 项目结构

```
Storyline/
├── frontend/               # Vue 3 前端
│   ├── src/
│   │   ├── components/     # UI 组件
│   │   ├── composables/    # 核心时间轴逻辑
│   │   ├── stores/         # Pinia 状态管理
│   │   ├── types/          # TypeScript 类型定义
│   │   └── assets/         # 静态资源
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
└── backend/                # NestJS 后端
    ├── src/
    │   ├── events/         # 事件模块
    │   ├── database/       # 数据库配置
    │   └── common/         # 通用工具
    ├── test/
    ├── nest-cli.json
    └── package.json
```

## 快速开始

### 前端
```bash
cd frontend
npm install
npm run dev
```

### 后端
```bash
cd backend
npm install
npm run typeorm migration:run
npm run start:dev
```

## 核心功能

- 🎯 高性能 Canvas 时间轴渲染（支持 1000+ 事件）
- 🖱️ 以鼠标为中心的缩放、拖拽交互
- 📊 多时间线叠加/并列模式切换
- ✏️ 完整的事件增删改查
- 🔍 按人物、类型、时间范围筛选
- 🎨 响应式 UI，深色主题
