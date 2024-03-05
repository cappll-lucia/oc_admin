<script setup lang="ts">
import { onMounted, ref, defineEmits } from 'vue';
import { type DataTableHeader } from '../utils/types.js';
import type { Product, Color } from '../api/entities.js';
import formRules from 'form-rules';
import NotificationConfirmation from './Notification.Confirmation.vue';
import NotificationSuccess from './Notification.Success.vue';
import { validator } from '@/utils/validator.js';
import { productsApi } from '@/api/libs/products.js';
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
const showDeleteImageDialog = ref(false);
const showManageProductDialog = ref(false);
const showUpdatedMetadataDialog = ref(false);

const result = ref({
	message: '',
	title: '',
});

const editedProduct = ref<{
	name: string;
	description: string | null;
	price: any;
	category: any;
	brand: any;
	colors: any[];
}>({ name: 'fsdfs', description: null, price: 0, category: 0, brand: 0, colors: [] });

const editedProductData = ref<any[]>([]);

const imageToDelete = ref({
	prod: 0,
	color: 0,
	imageName: '',
});

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

const manage = async (prod: any) => {
	editedProduct.value = { ...prod };
	editedProductData.value = await productsApi.getProducMetadata(prod.id);
	editedProductData.value.forEach((dataRow) => {
		dataRow.stockModified = false;
	});
	showManageProductDialog.value = true;
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
const getImageUrl = (imageName: string) =>
	`${import.meta.env.VITE_API_URL}/products/image/${imageName}`;

const updateStock = (dataRow: {
	product: number;
	color: number;
	images_url: string[];
	name: string;
	background: string;
}) => {
	console.log(editedProductData.value);
};

const handleUpdateStock = async (dataRow: {
	product: number;
	color: number;
	stock: number;
	images_url: string[];
	name: string;
	background: string;
	stockModified: boolean;
}) => {
	try {
		await productsApi.updateStock(dataRow.product, dataRow.color, dataRow.stock);
		dataRow.stockModified = false;
		result.value.title = 'Stock Actualizado';
		showUpdatedMetadataDialog.value = true;
	} catch (error: any) {
		result.value.title = 'Error al actualizar el stock del producto';
		result.value.message = error.response.data.message;
		showUpdatedMetadataDialog.value = true;
	}
};

const deleteImage = (prod: number, color: number, imgName: string) => {
	imageToDelete.value.prod = prod;
	imageToDelete.value.color = color;
	imageToDelete.value.imageName = imgName;
	showDeleteImageDialog.value = true;
};

const confirmDeleteImage = async (prod: number, color: number, imgName: string) => {
	try {
		showDeleteImageDialog.value = false;
		await productsApi.deleteImage(
			imageToDelete.value.prod,
			imageToDelete.value.color,
			imageToDelete.value.imageName
		);
		editedProductData.value = await productsApi.getProducMetadata(prod);
		result.value.title = 'Imagen Eliminada';
		showUpdatedMetadataDialog.value = true;
	} catch (error: any) {
		result.value.title = 'Error al al eliminar la imagen';
		result.value.message = error.response.data.message;
		showUpdatedMetadataDialog.value = true;
	}
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
					@click="manage(item)"
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
		<v-dialog v-model="showManageProductDialog">
			<v-card class="card-manage-prod">
				<div class="header">
					<span>Gestionar Producto</span>
					<h1>{{ editedProduct.name }}</h1>
				</div>
				<div v-for="dataRow in editedProductData" class="prod-color-row">
					<div class="color-title">
						<span>{{ dataRow.name }}</span>
					</div>
					<div class="management-section">
						<v-form
							class="product-color-stock"
							@submit.prevent="handleUpdateStock(dataRow)"
						>
							<div>
								<v-text-field v-model="dataRow.stock" variant="outlined"></v-text-field>
								<div class="arrows">
									<v-btn variant="outlined">
										<v-icon
											icon="mdi-chevron-up"
											@click="
												() => {
													dataRow.stock++;
													dataRow.stockModified = true;
												}
											"
										></v-icon
									></v-btn>
									<v-btn variant="outlined" :disabled="dataRow.stock === 0">
										<v-icon
											icon="mdi-chevron-down"
											@click="
												() => {
													if (dataRow.stock > 0) {
														dataRow.stock--;
														dataRow.stockModified = true;
													}
												}
											"
										></v-icon
									></v-btn>
								</div>
							</div>
							<v-btn
								type="submit"
								:disabled="!dataRow.stockModified"
								size="x-large"
								class="save-stock-btn"
								elevation="0"
								><v-icon icon="mdi-content-save"></v-icon>
							</v-btn>
						</v-form>
					</div>
					<div class="product-color-gallery">
						<div class="image-sq-add">
							<v-button class="add-image-btn pointer" @click="deleteImage('jkl')"
								><v-icon icon="mdi-plus" size="large"></v-icon>
							</v-button>
						</div>
						<div class="image-sq" v-for="img in dataRow.images_url">
							<v-img :src="getImageUrl(img)" height="100px" width="100px">
								<v-button
									class="delete-image-btn pointer"
									@click="deleteImage(dataRow.product, dataRow.color, img)"
									><v-icon icon="mdi-delete" size="large"></v-icon>
								</v-button>
							</v-img>
						</div>
					</div>
				</div>
			</v-card>
		</v-dialog>
		<v-dialog v-model="showUpdatedMetadataDialog">
			<NotificationSuccess
				:result="result"
				@close="
					() => {
						showUpdatedMetadataDialog = false;
						result.message = '';
						result.title = '';
					}
				"
			/>
		</v-dialog>
		<v-dialog v-model="showDeleteImageDialog" max-width="290">
			<NotificationConfirmation
				:title="'Eliminar Imagen'"
				:question="`¿Está seguro de eliminar la imagen?`"
				@cancel="() => (showDeleteImageDialog = false)"
				@confirm="confirmDeleteImage"
			/>
		</v-dialog>
	</v-container>
</template>

<style lang="scss">
@import url('../assets/tables.css');

.card-manage-prod {
	display: flex;
	flex-direction: column;
	padding: 0 1rem;
	.header span {
		color: #118c46;
	}
	.prod-color-row {
		display: flex;
		flex-direction: row;
		margin-bottom: 1rem;
		background-color: rgb(241, 241, 241);
		min-height: 110px;
		.color-title {
			text-align: right;
			padding: 1rem 1rem 0 0;
			font-size: 1.5rem;
			width: 200px;
			height: 100%;
			font-style: italic;
			color: #118c46;
			border-right: 10px solid #118c46;
			margin: 0 4rem 4rem 0;
		}
	}
}

.save-stock-btn {
	min-width: 20px;
	// min-height: 54px;
	border-radius: 10px;
	margin-left: 1.5rem;
	color: #deefe7;
	display: flex;
	justify-content: center;
	.v-btn__content {
		padding: 0;
		width: 10px;
	}
	.v-btn__append {
		margin-left: 0;
		padding: 0;
	}
	background-color: #022c66;
}

.management-section {
	display: flex;
	flex-direction: column;
	.product-color-stock {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		width: 350px;
		height: 100px;
		div {
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			border: 1.5px solid #022c66;
			.v-text-field {
				margin: 0;
				display: inherit;
				justify-content: center;
				align-items: center;
				border-radius: 0;
				flex: 0.4;
				* {
					border: unset;
				}
				input {
					width: 60px;
					height: 60px;
					font-size: 1.2rem;
					color: #022c66;
				}
				.v-input__details {
					display: none;
				}
			}
			.arrows {
				display: flex;
				flex-direction: column;
				border-radius: 0;

				background-color: #022c66;
				.v-btn.v-btn--density-default {
					height: 29px;
				}
				.v-btn {
					min-width: 10px;
					border: unset;
					background-color: #022c66;
					color: #deefe7;
					border-radius: 0;
					font-size: 1.2rem;
				}
				.v-btn--size-default {
					padding: 0 10px;
				}
				.v-btn:first-child {
					border-radius: 0;
					margin-bottom: 2px;
				}
				.v-btn:hover {
					background-color: #699be2;

					color: #022c66;
				}
			}
		}
	}
}

.v-data-table-footer__items-per-page {
	display: inline;
}

.card-manage-prod {
	height: 80vh;
	width: 80rem;
	.header {
		line-height: 1.1;
		color: #022c66;
		padding: 2rem;
	}
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

.product-color-gallery {
	display: flex;
	flex-wrap: wrap;
	width: 40rem;
	min-height: 100px;
}

.image-sq,
.image-sq-add {
	position: relative;
	height: 100px;
	width: 100px;
	border: 0.5px solid rgb(197, 197, 197);
	border-radius: 5px;
	margin: 0.5rem 1rem 0.5rem 0;
	background-color: white;
}

.image-sq-add {
	background-color: rgb(241, 241, 241);
	border-color: #022c66;
	overflow: hidden;
}

.delete-image-btn {
	position: absolute;
	bottom: 0px;
	left: 0px;
	background-color: rgba(0, 0, 0, 0.5);
	color: white;
	border: none;
	border-radius: 5px;
	opacity: 0;
	transition: opacity 0.3s ease;
	height: 100px;
	width: 100px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.add-image-btn {
	position: relative;
	position: absolute;
	bottom: 0px;
	left: 0px;
	color: #022c66;
	border-radius: 5px;
	transition: opacity 0.3s ease;
	height: 100px;
	width: 100px;
	font-size: 1.5rem;
	display: flex;
	justify-content: center;
	align-items: center;
}

.image-sq:hover .delete-image-btn {
	opacity: 1;
}

.image-sq-add:hover .add-image-btn {
	font-size: 1.8rem;
	background-color: #699be271;
}
</style>
