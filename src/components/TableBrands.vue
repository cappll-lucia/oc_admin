<script setup lang="ts">
import { onMounted, ref, defineEmits } from 'vue';
import { type DataTableHeader } from '../utils/types.js';
import type { Brand } from '@/api/entities.js';
const props = defineProps(['brands']);
import genericBrand from '../assets/generic-brand.jpg';

const headers: DataTableHeader[] = [
	{ title: 'Código', key: 'id', align: 'start' },
	{ title: 'Nombre', key: 'name', align: 'start' },
	{ title: 'Logo', key: 'logo', align: 'start' },
	{ title: '', key: 'actions', align: 'end', value: 'actions' },
];

const initSort = [{ key: 'name', order: 'asc' }];

const getLogoUrl = (item: Brand) =>
	item.logo ? item.logo : genericBrand;
</script>

<template>
	<v-container class="brands-table my-table">
		<v-data-table class="elevation-2" :headers="headers" :items="props.brands" v-model:sort-by="(initSort as any)">
			<template v-slot:item.logo="{ item }">
				<div class="table-image-container">
					<v-img :src="getLogoUrl((item as Brand))" class="table-image text-center"></v-img>
				</div>
			</template>
			<template v-slot:item.actions="{ item }">
				<v-icon size="small" icon="mdi-pencil" class="mr-4 pointer" @click="console.log('edit')"></v-icon>
				<v-icon size="small" icon="mdi-delete" class="m-0 pointer" @click="console.log('del')"></v-icon>
			</template>
		</v-data-table>
	</v-container>
</template>

<style lang="scss">
@import url('../assets/tables.css');

.brands-table .v-data-table-footer__items-per-page {
	display: none;
}

.brands-table .v-data-table-footer {
	padding: 0;
}

.brands-table .v-table .v-table__wrapper .v-data-table__tr .v-data-table__td {
	width: 1px;
}

.v-img__img--contain {
	display: inline-table !important;
}

.table-image {
	width: 60px;
	right: 10px;
}

.imagen {
	display: flex;
	justify-content: center;
	flex-direction: column;
	// margin: 1rem 0;
	span {
		width: 100%;
		text-align: left;
	}
	img {
		height: 100px;
		width: 100px;
	}
}
</style>
