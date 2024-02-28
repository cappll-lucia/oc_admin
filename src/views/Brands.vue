<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { brandsApi } from '@/api/libs/brands.js';
import TableBrands from '@/components/TableBrands.vue';
import Loader from '../components/Loader.vue';
import { type Brand } from '@/api/entities.js';

const brands = ref<Brand[]>([]);

const loading = ref(true);

const getBrands = async () => {
	brands.value = await brandsApi.getAll();
	loading.value = false;
};

onMounted(() => {
	getBrands();
});
</script>

<template>
	<v-layout class="page-layout">
		<v-container class="page-view">
			<v-row class="header">
				<v-toolbar-title> MARCAS </v-toolbar-title>
			</v-row>
			<v-row>
				<v-col cols="12" v-if="!loading">
					<TableBrands :brands="brands" />
				</v-col>
				<Loader v-else :message="'Cargando Marcas...'" />
			</v-row>
		</v-container>
	</v-layout>
</template>

<style></style>
