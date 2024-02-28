<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { categoriesApi } from '@/api/libs/categories.js';
import TableCategories from '@/components/TableCategories.vue'
import Loader from '../components/Loader.vue';
import { type Category } from '@/api/entities.js';

const categories = ref<Category[]>([]);

const loading = ref(true);

const getCategories = async () => {
	categories.value = await categoriesApi.getAll();
	loading.value = false;
};

onMounted(() => {
	getCategories();
});
</script>

<template>
	<v-layout class="page-layout">
		<v-container class="page-view">
			<v-row class="header">
				<v-toolbar-title> CATEGORÍAS </v-toolbar-title>
			</v-row>
			<v-row>
				<v-col cols="12" v-if="!loading">
					<TableCategories :categories="categories"/>
				</v-col>
				<Loader v-else :message="'Cargando Categorías...'" />
			</v-row>
		</v-container>
	</v-layout>
</template>

<style>

</style>
