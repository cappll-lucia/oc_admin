<script setup lang="ts">
import Menu from './Menu.vue';
</script>

<template>
	<v-app-bar>
		<span class="header-title">ADMINISTRACIÓN</span>
		<img src="../assets/logo.gif" class="header-logo" alt="OPTICA CRIADO" />
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
	box-shadow: 0 5px 5px -1px rgba(0, 0, 0, 0.2) !important;

	padding: 2px 20px;
	position: relative;
	margin-bottom: 1px;
	img {
		height: 40px;
		margin-top: 5px;
	}
}

@media (max-width: 500px) {
	.header-title {
		display: none;
	}
	.header-logo {
		width: 80%;
		height: auto;
	}
	.v-toolbar .v-toolbar__content {
		display: flex;
		justify-content: center;
	}
}
</style>
