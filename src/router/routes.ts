export const routes = [
	{
		path: '/login',
		name: 'login',
		component: () => import('../views/Login.vue'),
		meta: {
			auth: false,
		},
	},
	{
		path: '/',
		name: 'home',
		component: () => import('../views/Products.vue'),
		meta: {
			auth: true,
		},
	},
	{
		path: '/productos',
		name: 'products',
		component: () => import('../views/Products.vue'),
		meta: {
			auth: true,
		},
	},
	{
		path: '/colores',
		name: 'colors',
		component: () => import('../views/Colors.vue'),
		meta: {
			auth: true,
		},
	},
	{
		path: '/promociones',
		name: 'promotions',
		component: () => import('../views/Promotions.vue'),
		meta: {
			auth: true,
		},
	},
	{
		path: '/marcas',
		name: 'brands',
		component: () => import('../views/Brands.vue'),
		meta: {
			auth: true,
		},
	},
	{
		path: '/categorias',
		name: 'categories',
		component: () => import('../views/Categories.vue'),
		meta: {
			auth: true,
		},
	},
];
