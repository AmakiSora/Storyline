import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import App from './views/App.vue'
import './style.css'
createApp(App).use(createPinia()).use(MotionPlugin).mount('#app')
