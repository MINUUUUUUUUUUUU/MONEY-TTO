import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import VCalendar from 'v-calendar';
//거래 세부 페이지에 들어가는 vue.js 달력 라이브러리
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap';
import 'v-calendar/style.css';

import './assets/styles/main.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(VCalendar, {});
app.mount('#app');
