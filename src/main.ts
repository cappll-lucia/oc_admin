import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify.js';

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(createPinia());
app.mount('#app');
