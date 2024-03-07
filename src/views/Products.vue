<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Color, Product } from '@/api/entities.js';
import { productsApi } from '../api/libs/products.js';
import { brandsApi } from '../api/libs/brands.js';
import { categoriesApi } from '@/api/libs/categories.js';
import { colorsApi } from '../api/libs/colors.js';
import TableProducts from '../components/Table.Products.vue';
import Loader from '../components/Loader.vue';
import formRules from 'form-rules';
import NotificationSuccess from '@/components/Notification.Success.vue';
import NotificationError from '@/components/Notification.Error.vue';
import { validator } from '@/utils/validator.js';

const products = ref<Product[]>([]);
const filteredProducts = ref<Product[]>([]);
const brands = ref([]);
const categories = ref([]);
const colors = ref([]);

const showNewDialog = ref(false);
const showSuccessDialog = ref(false);
const showErrorDialog = ref(false);
const loading = ref(true);

const newProduct = ref<{
	name: string;
	description: string | null;
	price: any;
	category: any;
	brand: any;
	colors: any;
}>({ name: '', description: null, price: 0, category: 0, brand: 0, colors: [] });

const clearNewProduct = () => {
	newProduct.value = {
		name: '',
		description: null,
		price: 0.0,
		category: null,
		brand: null,
		colors: [],
	};
};

const getProducts = async () => {
	products.value = await productsApi.getAll();
	filteredProducts.value = products.value;
};

const getData = async () => {
	await getProducts();
	brands.value = await brandsApi.getAll();
	categories.value = await categoriesApi.getAll();
	colors.value = await colorsApi.getAll();
	loading.value = false;
};

const result = ref<{ title: string | null; message: string | null }>({
	title: null,
	message: null,
});

const isFormValid = () => {
	return (
		newProduct.value.name.length > 3 &&
		newProduct.value.price > 0 &&
		validator.decimal(newProduct.value.price) &&
		newProduct.value.category > 0 &&
		newProduct.value.brand > 0 &&
		newProduct.value.colors.length > 0
	);
};

const saveColorsID = (selectedColors: Color[]) => {
	newProduct.value.colors = selectedColors.map((col: Color) => col.id);
};

const handleAddNewProduct = async () => {
	try {
		if (isFormValid()) {
			showNewDialog.value = false;
			newProduct.value.price = Number.parseFloat(newProduct.value.price);
			await productsApi.add(newProduct.value);
			result.value.title = 'Producto registrado con éxito';
			showSuccessDialog.value = true;
			clearNewProduct();
			await getProducts();
		}
	} catch (error: any) {
		result.value.title = 'Error al registrar el producto';
		result.value.message = error.response.data.message;
		showErrorDialog.value = true;
	}
};

const handleDeleteProduct = async (prod: Product) => {
	try {
		await productsApi.remove(prod.id);
		result.value.message = 'Producto eliminado con éxito';
		showSuccessDialog.value = true;
		await getProducts();
	} catch (error: any) {
		result.value.title = 'Error al eliminar producto';
		result.value.message = error.response.data.message;
		showErrorDialog.value = true;
	}
};

const handleEditProduct = async (prod: any) => {
	try {
		const prodToEdit = {
			name: prod.name,
			description: prod.description,
			price: prod.price,
			category: prod.category,
			brand: prod.brand,
			colors: (prod.colors as Color[]).map((col) => col.id),
		};
		await productsApi.update(prodToEdit, prod.id);
		result.value.message = 'Producto actualizado con éxito';
		showSuccessDialog.value = true;
		await getProducts();
	} catch (error: any) {
		result.value.title = 'Error al actualizar producto';
		result.value.message = error.response.data.message;
		showErrorDialog.value = true;
	}
};

onMounted(() => {
	getData();
});
</script>

<template>
	<v-layout class="page-layout">
		<v-container class="page-view">
			<v-row class="header">
				<v-col cols="10">
					<v-toolbar-title> PRODCUTOS </v-toolbar-title>
				</v-col>
				<v-col cols="2">
					<v-btn
						@click="
							() => {
								clearNewProduct();
								showNewDialog = true;
							}
						"
						>CREAR +</v-btn
					>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12" v-if="!loading">
					<TableProducts
						:products="filteredProducts"
						:brands="brands"
						:categories="categories"
						:colors="colors"
						@handleEdit="handleEditProduct"
						@handleDelete="handleDeleteProduct"
						@getProducts="getProducts"
					/>
				</v-col>
				<Loader v-else :message="'Cargando Productos...'" />
			</v-row>
		</v-container>
		<v-dialog class="new-dialog" v-model="showNewDialog">
			<v-card class="card">
				<div class="form-card-header">
					<span>Crear Producto</span>
				</div>
				<v-form class="form-input-panel" @submit.prevent="handleAddNewProduct">
					<v-card-text class="text-field-group">
						<v-text-field
							variant="outlined"
							v-model="newProduct.name"
							label="Nombre"
							:rules="[formRules.required(), formRules.min(3)]"
						>
						</v-text-field>
						<v-textarea
							variant="outlined"
							v-model="newProduct.description"
							label="Descripción"
							:rules="[formRules.max(225)]"
							class="desc-input"
						>
						</v-textarea>
						<div class="price-row">
							<span>$</span>
							<v-text-field
								variant="outlined"
								v-model="newProduct.price"
								label="Precio"
								:rules="[formRules.decimal()]"
							>
							</v-text-field>
						</div>

						<v-select
							v-model="newProduct.category"
							:items="categories"
							item-title="name"
							item-value="id"
							label="Categoría"
							variant="outlined"
							name="category"
							:rules="[formRules.required()]"
						>
						</v-select>
						<v-select
							v-model="newProduct.brand"
							:items="brands"
							item-title="name"
							item-value="id"
							label="Marca"
							variant="outlined"
							name="brand"
							:rules="[formRules.required()]"
						>
						</v-select>
						<v-combobox
							v-model="newProduct.colors"
							:items="colors"
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
						<v-btn class="cancel-btn" variant="outlined" @click="showNewDialog = false"
							>CANCELAR</v-btn
						>
						<v-btn class="submit-btn" variant="outlined" type="submit">GUARDAR</v-btn>
					</div>
				</v-form>
			</v-card>
		</v-dialog>
		<v-dialog v-model="showSuccessDialog">
			<NotificationSuccess
				:result="result"
				@close="
					() => {
						showSuccessDialog = false;
						(result.title = null), (result.message = null);
					}
				"
			/>
		</v-dialog>
		<v-dialog v-model="showErrorDialog">
			<NotificationError
				:error="result"
				@close="
					() => {
						showErrorDialog = false;
						(result.title = null), (result.message = null);
					}
				"
			/>
		</v-dialog>
	</v-layout>
</template>

<style lang="scss">
@import '../assets/main.css';
@import '../assets/forms.scss';

.price-row {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	span {
		margin-bottom: 35px;
		font-size: 1.2rem;
		padding-right: 1.2rem;
		font-style: italic;
	}
}

.form-card-header {
	position: relative;
	margin-bottom: 5rem;
	padding: 1rem 0;
	top: 6rem;
}

.card .form-input-panel .text-field-group .desc-input .v-field__input {
	padding-top: 20px;
}
</style>
