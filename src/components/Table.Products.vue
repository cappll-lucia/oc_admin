<script setup lang="ts">
import { onMounted, ref, defineEmits } from 'vue';
import { type DataTableHeader } from '../utils/types.js';
import type { Product, Color } from '../api/entities.js';
import formRules from 'form-rules';
import NotificationConfirmation from './Notification.Confirmation.vue';
import { validator } from '@/utils/validator.js';
const props = defineProps(['products', 'categories', 'brands', 'colors']);
const emits = defineEmits(['handleDelete', 'handleEdit']);

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

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);

const editedProduct = ref<{
	name: string;
	description: string | null;
	price: any;
	category: any;
	brand: any;
	colors: any;
}>({ name: '', description: null, price: 0, category: 0, brand: 0, colors: [] });

const clearEditedProduct = () => {
	editedProduct.value = {
		name: '',
		description: null,
		price: 0.0,
		category: null,
		brand: null,
		colors: [],
	};
};
const edit = (prod: any) => {
	editedProduct.value = { ...prod };
	editedProduct.value.category = prod.category.id;
	editedProduct.value.brand = prod.brand.id;
	showEditDialog.value = true;
};
const del = (prod: any) => {
	editedProduct.value = prod;
	showDeleteDialog.value = true;
};

const isFormValid = () => {
	return (
		editedProduct.value.name.length > 3 &&
		editedProduct.value.price > 0 &&
		validator.decimal(editedProduct.value.price) &&
		editedProduct.value.category &&
		editedProduct.value.brand &&
		editedProduct.value.colors.length > 0
	);
};

const confirmDelete = () => {
	showDeleteDialog.value = false;
	emits('handleDelete', editedProduct.value);
	clearEditedProduct();
};

const confirmEdition = () => {
	if (isFormValid()) {
		showEditDialog.value = false;
		(editedProduct.value as Product).price = Number.parseFloat(
			(editedProduct.value as any).price
		);
		emits('handleEdit', editedProduct.value);
		clearEditedProduct();
	}
};

const saveColorsID = (selectedColors: Color[]) => {
	(editedProduct as any).colors = selectedColors.map((col) => col.id);
};
</script>

<template>
	<v-container class="products-table my-table">
		<v-data-table
			class="elevation-2"
			:headers="headers"
			:items="props.products"
			v-model:sort-by="(initSort as any)"
		>
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
				<v-icon
					size="small"
					icon="mdi-application-cog"
					class="mr-4 pointer"
					@click="console.log('manage')"
				></v-icon>
				<v-icon
					size="small"
					icon="mdi-pencil"
					class="mr-4 pointer"
					@click="edit(item)"
				></v-icon>
				<v-icon
					size="small"
					icon="mdi-delete"
					class="m-0 pointer"
					@click="del(item)"
				></v-icon>
			</template>
		</v-data-table>
		<v-dialog v-model="showDeleteDialog" max-width="290">
			<NotificationConfirmation
				:title="'Eliminar Producto'"
				:question="`¿Está seguro de eliminar el producto ${editedProduct.name.toLocaleUpperCase()}?`"
				@cancel="() => (showDeleteDialog = false)"
				@confirm="confirmDelete"
			/>
		</v-dialog>
		<v-dialog v-model="showEditDialog" max-width="290">
			<v-card class="edit-card card">
				<div class="form-card-header">
					<span>Editar Producto</span>
				</div>
				<v-form class="form-input-panel" @submit.prevent="confirmEdition">
					<v-card-text class="text-field-group">
						<v-text-field
							variant="outlined"
							v-model="editedProduct.name"
							label="Nombre"
							:rules="[formRules.required(), formRules.min(3)]"
						>
						</v-text-field>
						<v-text-field
							variant="outlined"
							v-model="editedProduct.description"
							label="Descripción"
							:rules="[formRules.max(225)]"
						>
						</v-text-field>
						<div class="price-row">
							<span>$</span>
							<v-text-field
								variant="outlined"
								v-model="editedProduct.price"
								label="Precio"
								:rules="[formRules.decimal()]"
							>
							</v-text-field>
						</div>
						<v-select
							v-model="editedProduct.brand"
							:items="brands"
							item-title="name"
							item-value="id"
							label="Marca"
							variant="outlined"
							name="brand"
							:rules="[formRules.required()]"
						>
						</v-select>
						<v-select
							v-model="editedProduct.category"
							:items="categories"
							item-title="name"
							item-value="id"
							label="Categoría"
							variant="outlined"
							name="category"
							:rules="[formRules.required()]"
						>
						</v-select>
						<v-combobox
							v-model="editedProduct.colors"
							:items="props.colors"
							label="Colores"
							item-title="name"
							item-value="id"
							variant="outlined"
							multiple
							:rules="[formRules.required()]"
							class="color-combo"
							@update:model-value="saveColorsID"
						>
						</v-combobox>
					</v-card-text>
					<div class="form-action-panel">
						<v-btn class="cancel-btn" variant="outlined" @click="showEditDialog = false"
							>CANCELAR</v-btn
						>
						<v-btn class="submit-btn" variant="outlined" type="submit">GUARDAR</v-btn>
					</div>
				</v-form>
			</v-card>
		</v-dialog>
	</v-container>
</template>

<style lang="scss">
@import url('../assets/tables.css');

.v-data-table-footer__items-per-page {
	display: inline;
}

@media (max-width: 1192px) {
	.products-table .v-table .v-data-table-column--align-end {
		.mdi {
			padding: 20px;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
}
</style>
