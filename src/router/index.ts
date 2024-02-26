import { createRouter, createWebHistory } from 'vue-router';
import Products from '../views/Products.vue';
import { routes } from './routes';
const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes
});

export default router;
