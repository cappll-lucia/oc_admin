<script setup lang="ts">
import Menu from './Menu.vue';
</script>

<template>
	<v-app-bar>
		<span class="header-title">ADMINISTRACIÓN</span>
		<RouterLink to="/productos">
			<img src="../assets/logo.gif" alt="OPTICA CRIADO" class="pointer" />
		</RouterLink>
	</v-app-bar>
	<Menu />
</template>

<style lang="scss">
.v-toolbar {
	z-index: 2000;
}
.header-title {
	color: #022c66;
}

.v-toolbar__content {
	justify-content: space-between;
	align-items: center;
	padding: 2px 20px;
	position: relative;
	margin-bottom: 1px;
	img {
		height: 40px;
		margin-top: 5px;
	}
}
</style>
