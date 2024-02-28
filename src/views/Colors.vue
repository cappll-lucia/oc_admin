<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { colorsApi } from '@/api/libs/colors.js';
import TableColors from '@/components/TableColors.vue';
import Loader from '../components/Loader.vue';
import { type Color } from '@/api/entities.js';

const colors = ref<Color[]>([]);

const loading = ref(true);

const getColors = async () => {
	colors.value = await colorsApi.getAll();
	loading.value = false;
};

onMounted(() => {
	getColors();
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
					<TableColors :colors="colors" />
				</v-col>
				<Loader v-else :message="'Cargando Marcas...'" />
			</v-row>
		</v-container>
	</v-layout>
</template>

<style></style>
