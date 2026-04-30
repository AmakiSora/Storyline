import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './views/App.vue';
import './style.css';

createApp(App).use(createPinia()).mount('#app');
