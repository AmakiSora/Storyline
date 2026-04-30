import { createRouter, createWebHistory } from 'vue-router'
import TimelineView from '@/views/TimelineView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: TimelineView,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
