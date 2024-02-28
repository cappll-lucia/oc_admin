<script setup lang="ts">
import { onMounted, ref, defineEmits } from 'vue';
import { type DataTableHeader } from '../utils/types.js';
import type { Color } from '@/api/entities.js';
const props = defineProps(['colors']);

const headers: DataTableHeader[] = [
	{ title: 'Código', key: 'id', align: 'start' },
	{ title: 'Nombre', key: 'name', align: 'start' },
	{ title: 'Icono', key: 'background', align: 'start' },
	{ title: '', key: 'actions', align: 'end', value: 'actions' },
];

const initSort = [{ key: 'name', order: 'asc' }];
</script>

<template>
	<v-container class="colors-table my-table">
		<v-data-table class="elevation-2" :headers="headers" :items="props.colors" v-model:sort-by="(initSort as any)">
			<template v-slot:item.background="{ item }">
				<div class="color-bkg-icon" :style="{background: (item as Color).background}"></div>
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

.colors-table .v-data-table-footer__items-per-page {
	display: none;
}

.colors-table .v-data-table-footer {
	padding: 0;
}

.colors-table .v-table .v-table__wrapper .v-data-table__tr .v-data-table__td {
	width: 1px;
}

.color-bkg-icon {
	width: 60px;
	margin-left: 5px;
	height: 40px;
	width: 40px;
	border-radius: 50%;
	border: solid 1px gray;
}
</style>
