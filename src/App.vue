<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import Header from './components/Header.vue';
</script>

<template>
	<v-app id="app">
		<Header />
		<RouterView />
	</v-app>
</template>

<style>
@import url('./assets/main.css');
</style>
