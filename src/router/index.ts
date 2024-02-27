import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { type RouteLocationNormalized, type NavigationGuardNext } from 'vue-router';
import { useUserStore } from '@/stores/UsersStore.js';
import { mdiCarLightAlert } from '@mdi/js';

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes,
});

router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
	const auth: boolean = to.meta.auth as boolean;
	const userStore = useUserStore();
	if (auth && !userStore.isSignedIn) {
		next('/login');
	} else if (to.fullPath === '/login' && userStore.isSignedIn) {
		next('/');
	} else {
		next();
	}
});

export default router;
