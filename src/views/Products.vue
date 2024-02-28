<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Product } from '@/api/entities.js';
import { productsApi } from '../api/libs/products.js';
import { brandsApi } from '../api/libs/brands.js';
import { categoriesApi } from '@/api/libs/categories.js';
import { colorsApi } from '../api/libs/colors.js';
import TableProducts from '../components/TableProducts.vue';
import Loader from '../components/Loader.vue';

const products = ref<Product[]>([]);
const filteredProducts = ref<Product[]>([]);
const brands = ref([]);
const categories = ref([]);

const loading = ref(true);

const getProducts = async () => {
	products.value = await productsApi.getAll();
	filteredProducts.value = products.value;
};

const getData = async () => {
	await getProducts();
	brands.value = await brandsApi.getAll();
	categories.value = await categoriesApi.getAll();
	loading.value = false;
};

onMounted(() => {
	getData();
});
</script>

<template>
	<v-layout class="page-layout">
		<v-container class="page-view">
			<v-row class="header">
				<v-toolbar-title> PRODCUTOS </v-toolbar-title>
			</v-row>
			<v-row>
				<v-col cols="12" v-if="!loading">
					<TableProducts :products="filteredProducts" :brands="brands" :categories="categories" />
				</v-col>
				<Loader v-else :message="'Cargando Productos...'" />
			</v-row>
		</v-container>
	</v-layout>
</template>

<style></style>
