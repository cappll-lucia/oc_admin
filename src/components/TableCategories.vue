<script setup lang="ts">
import { onMounted, ref, defineEmits } from 'vue';
import { type DataTableHeader } from '../utils/types.js';
import type { Category } from '@/api/entities.js';
const props = defineProps(['categories']);

const headers: DataTableHeader[] = [
	{ title: 'Código', key: 'id', align: 'start' },
	{ title: 'Nombre', key: 'name', align: 'start' },
	{ title: '', key: 'actions', align: 'end', value: 'actions' },
];

const initSort = [{ key: 'name', order: 'asc' }];
</script>

<template>
	<v-container class="categ-table my-table">
		<v-data-table class="elevation-2" :headers="headers" :items="props.categories" v-model:sort-by="(initSort as any)">
			<template v-slot:item.actions="{ item }">
				<v-icon size="small" icon="mdi-pencil" class="mr-4 pointer" @click="console.log('edit')"></v-icon>
				<v-icon size="small" icon="mdi-delete" class="m-0 pointer" @click="console.log('del')"></v-icon>
			</template>
		</v-data-table>
	</v-container>
</template>

<style lang="scss">
@import url('../assets/tables.css');

.categ-table{
  width: 70%;
}

.categ-table .v-data-table-footer__items-per-page {
	display: none;
}

.categ-table .v-data-table-footer {
	padding: 0;
}
</style>
