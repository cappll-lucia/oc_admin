<script setup lang="ts">
import router from '../router';
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/UsersStore.js';
import { type JwtUser } from '@/api/entities.js';

const userStore = useUserStore();

const currentUser = computed(() => userStore.getMe);

const showMenu = ref(false);
const showUsrMenu = ref(false);
const showUsrMenuResponsive = ref(false);

const MenuItems = [
	{ label: 'Productos', icon: 'mdi-list-box-outline', routerPath: '/productos' },
	{ label: 'Categorías', icon: 'mdi-shape-outline', routerPath: 'categorias' },
	{ label: 'Marcas', icon: 'mdi-tag-outline', routerPath: 'marcas' },
	{ label: 'Colores', icon: 'mdi-palette', routerPath: 'colores' },
	{ label: 'Promociones', icon: 'mdi-sale-outline', routerPath: 'promociones' },
];
</script>

<template>
	<div class="menu-section" v-if="userStore.isSignedIn">
		<template class="menu d-none d-sm-flex d-md-flex d-lg-flex d-xl-flex">
			<v-tabs>
				<v-tab v-for="(item, $index) in MenuItems" :key="$index" class="menu-item-label" :to="item.routerPath">
					<v-icon :icon="item.icon" class="menu-item-icon"></v-icon>
					{{ item.label }}
				</v-tab>
			</v-tabs>
			<v-spacer />
			<v-icon icon="mdi-account-circle-outline" class="menu-item-icon mr-3"></v-icon>
			<span class="user-data-tag pointer" v-if="currentUser" @click="showUsrMenu = !showUsrMenu">{{
				`${currentUser?.firstName ? currentUser.firstName : ''} ${currentUser?.lastName ?? ''}`
			}}</span>
		</template>
		<div class="menuUsr" v-if="showUsrMenu">
			<span class="pointer" @click="userStore.signOut()">
				<v-icon icon="mdi-logout" class="menu-item-icon mr-1"></v-icon>
				Cerrar Sesión</span
			>
		</div>
	</div>
</template>

<style lang="scss">
.menu {
	position: relative;
	right: 0;
	top: 65px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	box-shadow: 0 3px 3px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12) !important;
	color: #deefe7;
	background-color: #022c66;
	height: 48px;
	padding-top: 5px;
	z-index: 100;
	.menu-item-icon {
		margin-right: 5px;
	}
	.menu-item-label {
		text-align: left;
	}
	.user-data-tag {
		padding-right: 1.8rem;
	}
}

.menuUsr {
	position: absolute;
	top: 7rem;
	right: 0;
	height: min-content;
	background-color: none;
	z-index: 0;
	width: 193px;
	background-color: #022c66;
	display: block;
	span {
		display: block;
		padding: 10px 10px 10px 15px;
		box-shadow: 0 3px 3px -1px rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 1px 3px 0 rgba(0, 0, 0, 0.12) !important;
		width: 100%;
		color: #deefe7;
	}
}
</style>
