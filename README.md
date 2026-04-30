# Storyline Timeline（前后端分离）

## 目录结构
- frontend/：Vue 3 + Vite + TS（Canvas 高性能时间线）
- api/：NestJS + GraphQL + PostgreSQL

## 本地启动

### 1) 启动数据库（PostgreSQL）
```bash
docker compose up -d
```

### 2) 启动后端
```bash
cd api
cp .env.example .env
npm install
npm run start:dev
```

GraphQL Playground / Studio（默认）：
- http://localhost:4000/graphql

### 3) 启动前端
```bash
cd frontend
npm install
npm run dev
```

前端：
- http://localhost:5173
