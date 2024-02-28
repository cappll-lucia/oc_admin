<script setup lang="ts">
import { onMounted, ref, defineEmits } from 'vue';
import { type DataTableHeader } from '../utils/types.js';
import { type Product } from '../api/entities.js';
const props = defineProps(['products', 'categories', 'brands']);

const headers: DataTableHeader[] = [
	{ title: 'Código', key: 'id', align: 'start' },
	{ title: 'Nombre', key: 'name', align: 'start' },
	{ title: 'Categoría', key: 'category', align: 'start' },
	{ title: 'Marca', key: 'brand', align: 'start' },
	{ title: 'Precio', key: 'price', align: 'start' },
	{ title: 'Colores', key: 'colors', align: 'start' },
	{ title: '', key: 'actions', align: 'end', value: 'actions' },
];

const initSort = [{ key: 'name', order: 'asc' }];
</script>

<template>
	<v-container class="products-table my-table">
		<v-data-table class="elevation-2" :headers="headers" :items="props.products" v-model:sort-by="(initSort as any)">
			<template v-slot:item.category="{ item }">
				<td>{{ (item as Product).category.name }}</td>
			</template>
			<template v-slot:item.brand="{ item }">
				<td>{{ (item as Product).brand.name }}</td>
			</template>
			<template v-slot:item.colors="{ item }">
				<td>{{ (item as Product).colors.map((c) => c.name).join(', ') }}</td>
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



.v-data-table-footer__items-per-page {
	display: inline;
}
</style>
