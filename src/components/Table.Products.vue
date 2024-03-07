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
const showUploadImageInput = ref(false);
const showAddProductColorInput = ref(false);
const showDeleteDataRowDialog = ref(false);

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

const colorsToAdd = ref([...props.colors]);
const addedColors = ref([]);

const dataRowToDelete = ref<any>(undefined);

const imageToDelete = ref({
	prod: 0,
	color: 0,
	imageName: '',
});
const newImage = ref({
	prod: 0,
	color: 0,
	imageFile: undefined,
});
const clearNewImage = () => {
	newImage.value.prod = 0;
	newImage.value.color = 0;
	newImage.value.imageFile = undefined;
};
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

const addNewProductColor = () => {
	const registeredColorsId = editedProductData.value.map((rowData) => rowData.color);
	colorsToAdd.value = props.colors.filter(
		(color: Color) => !registeredColorsId.includes(color.id)
	);
	showAddProductColorInput.value = true;
};

const confirmAddProductColor = () => {
	if (addedColors.value.length > 0) {
		editedProduct.value.colors.push(...addedColors.value);
	}
	emits('handleEdit', editedProduct.value);
	showAddProductColorInput.value = false;
	colorsToAdd.value = props.colors;
	addedColors.value = [];
};
const saveColorsID = (selectedColors: Color[]) => {
	(editedProduct as any).colors = selectedColors.map((col) => col.id);
};
const getImageUrl = (imageName: string) =>
	`${import.meta.env.VITE_API_URL}/products/image/${imageName}`;

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
		result.value.title = 'Imagen Eliminada';
		showUpdatedMetadataDialog.value = true;
		editedProductData.value = await productsApi.getProducMetadata(
			imageToDelete.value.prod
		);
	} catch (error: any) {
		result.value.title = 'Error al al eliminar la imagen';
		result.value.message = error.response.data.message;
		showUpdatedMetadataDialog.value = true;
	}
};

const uploadImage = (prod: number, color: number) => {
	newImage.value.prod = prod;
	newImage.value.color = color;
	showUploadImageInput.value = true;
};

const confirmUploadImage = async () => {
	try {
		if (newImage.value.imageFile) {
			const formData = new FormData();
			formData.append('image', newImage.value.imageFile[0]);
			showUploadImageInput.value = false;
			await productsApi.uploadImage(newImage.value.prod, newImage.value.color, formData);
			editedProductData.value = await productsApi.getProducMetadata(newImage.value.prod);
			result.value.title = 'Imagen Guardada';
			showUpdatedMetadataDialog.value = true;
			clearNewImage();
		}
	} catch (error: any) {
		result.value.title = 'Error al al guardar la imagen';
		result.value.message = error.response.data.message;
		showUpdatedMetadataDialog.value = true;
	}
};

const deleteProductColorRow = async (dataRow: any) => {
	dataRowToDelete.value = dataRow;
	showDeleteDataRowDialog.value = true;
};

const confirmDeleteDataRow = async () => {
	try {
		showDeleteDataRowDialog.value = false;
		await productsApi.removeDataRow(
			dataRowToDelete.value.product,
			dataRowToDelete.value.color
		);
		result.value.title = 'Color eliminado para el producto';
		showUpdatedMetadataDialog.value = true;
		editedProductData.value = await productsApi.getProducMetadata(
			dataRowToDelete.value.product
		);
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
						<v-textarea
							variant="outlined"
							v-model="editedProduct.description"
							label="Descripción"
							:rules="[formRules.max(225)]"
							class="desc-input"
						>
						</v-textarea>
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
					<div class="header-txt">
						<span>Gestionar Producto</span>
						<h1>{{ editedProduct.name }}</h1>
					</div>
					<div class="header-btn">
						<v-btn
							class="close-btn"
							elevation="0"
							density="compact"
							icon="mdi-close-thick"
							@click="showManageProductDialog = false"
						></v-btn>
						<v-btn
							class="add-color"
							variant="outlined"
							append-icon="mdi-plus"
							@click="addNewProductColor"
							>AGREGAR COLOR</v-btn
						>
					</div>
				</div>
				<div v-for="dataRow in editedProductData" class="prod-color-row">
					<div class="color-title">
						<span class="title">{{ dataRow.name }}</span>
						<v-btn
							v-if="editedProductData.length > 1"
							density="compact"
							elevation="0"
							icon="mdi-delete"
							@click="deleteProductColorRow(dataRow)"
						></v-btn>
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
							<v-button
								class="add-image-btn pointer"
								@click="uploadImage(dataRow.product, dataRow.color)"
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
		<v-dialog v-model="showUploadImageInput">
			<v-card class="upload-image-card">
				<v-form @submit.prevent="confirmUploadImage">
					<v-file-input
						v-model="newImage.imageFile"
						accept="image/*"
						variant="outlined"
						label="Subir Nueva Imagen"
						name="logo"
						:rules="[formRules.required()]"
					></v-file-input>
					<div class="form-action-panel mt-6">
						<v-btn
							class="cancel-btn"
							variant="outlined"
							@click="showUploadImageInput = false"
							>CANCELAR</v-btn
						>
						<v-btn class="submit-btn" variant="outlined" type="submit">GUARDAR</v-btn>
					</div>
				</v-form>
			</v-card>
		</v-dialog>
		<v-dialog v-model="showAddProductColorInput">
			<v-card class="upload-image-card">
				<v-form @submit.prevent="confirmAddProductColor">
					<v-combobox
						v-model="addedColors"
						:items="colorsToAdd"
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
					<div class="form-action-panel mt-6">
						<v-btn
							class="cancel-btn"
							variant="outlined"
							@click="
								() => {
									showAddProductColorInput = false;
									addedColors = [];
									colorsToAdd = props.colors;
								}
							"
							>CANCELAR</v-btn
						>
						<v-btn class="submit-btn" variant="outlined" type="submit">GUARDAR</v-btn>
					</div>
				</v-form>
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
		<v-dialog v-model="showDeleteDataRowDialog" max-width="290">
			<NotificationConfirmation
				:title="'Eliminar Imagen'"
				:question="`¿Está seguro de eliminar color ${dataRowToDelete.name} para el producto? Todas las imagenes producto-color serán también eliminadas`"
				@cancel="() => (showDeleteImageDialog = false)"
				@confirm="confirmDeleteDataRow"
			/>
		</v-dialog>
	</v-container>
</template>

<style lang="scss">
@import url('../assets/tables.css');
@import url('../assets/manageProdPanel.scss');

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

.upload-image-card {
	width: 25rem;
	padding: 3rem;
}

.desc-input .v-input__control {
	.v_field {
		.v-field__field {
			textarea {
				padding-top: 20px;
			}
		}
	}
}
element.style {
	padding-top: 20px;
}
.form-card .form-input-panel .text-field-group .v-field__input,
.card .form-input-panel .text-field-group .desc-input .v-field__input {
	padding-top: 20px;
}
</style>
