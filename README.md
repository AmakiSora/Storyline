# Storyline 全栈项目

## 结构
- `frontend`: Vue3 + TS + Vite + Pinia + Tailwind + Canvas 渲染
- `backend`: NestJS + GraphQL + PostgreSQL

## 启动
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
npm run start:dev
```

## 关键能力
- Canvas 高性能时间轴渲染，支持缩放、拖拽、动态刻度、虚拟化可视区域。
- 多模式展示（叠加/并列）、CRUD 编辑、搜索筛选。
- GraphQL 接口：`events/createEvent/updateEvent/deleteEvent`。
