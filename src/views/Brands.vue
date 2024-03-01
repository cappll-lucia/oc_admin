<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { brandsApi } from '@/api/libs/brands.js';
import TableBrands from '@/components/Table.Brands.vue';
import Loader from '../components/Loader.vue';
import { type Brand } from '@/api/entities.js';
import formRules from 'form-rules';
import NotificationSuccess from '@/components/Notification.Success.vue';
import NotificationError from '@/components/Notification.Error.vue';

const brands = ref<Brand[]>([]);

const loading = ref(true);
const showNewDialog = ref(false);
const showSuccessDialog = ref(false);
const showErrorDialog = ref(false);

const newBrand = ref<{ name: string; logo: any }>({
	name: '',
	logo: '',
});
const clearNewBrand = () => {
	newBrand.value.name = '';
	newBrand.value.logo = '';
};

const result = ref<{ title: string | null; message: string | null }>({
	title: null,
	message: null,
});

const getBrands = async () => {
	brands.value = await brandsApi.getAll();
	loading.value = false;
};

const isFormValid = () => newBrand.value.name.length > 3 && newBrand.value.logo;

const handleAddNewBrand = async () => {
	try {
		if (isFormValid()) {
			const formData = new FormData();
			formData.append('name', newBrand.value.name);
			formData.append('logo', newBrand.value.logo[0]);
			showNewDialog.value = false;
			await brandsApi.create(formData);
			result.value.title = 'Marca registrada con éxito.';
			showSuccessDialog.value = true;
			clearNewBrand();
			await getBrands();
		}
	} catch (error: any) {
		result.value.title = 'Error al crear Marca';
		result.value.message = error.response.data.message;
		showErrorDialog.value = true;
	}
};

const handleEditBrand = async (brand: FormData, id: number) => {
	try {
		await brandsApi.update(brand, id);
		result.value.message = 'Marca actualizada con éxito';
		showSuccessDialog.value = true;
		await getBrands();
	} catch (error: any) {
		result.value.title = 'Error al actualizar categoría';
		result.value.message = error.response.data.message;
		showErrorDialog.value = true;
	}
};

const handleDeleteBrand = async (brand: Brand) => {
	try {
		await brandsApi.remove(brand.id);
		result.value.message = 'Marca eliminada con éxito';
		showSuccessDialog.value = true;
		await getBrands();
	} catch (error: any) {
		result.value.title = 'Error al eliminar marca';
		result.value.message = error.response.data.message;
		showErrorDialog.value = true;
	}
};

onMounted(() => {
	getBrands();
});
</script>

<template>
	<v-layout class="page-layout">
		<v-container class="page-view">
			<v-row class="header">
				<v-col cols="10">
					<v-toolbar-title> MARCAS </v-toolbar-title>
				</v-col>
				<v-col cols="2">
					<v-btn
						@click="
							() => {
								clearNewBrand();
								showNewDialog = true;
							}
						"
						>CREAR +</v-btn
					>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12" v-if="!loading">
					<TableBrands
						:brands="brands"
						@handleEdit="handleEditBrand"
						@handleDelete="handleDeleteBrand"
					/>
				</v-col>
				<Loader v-else :message="'Cargando Marcas...'" />
			</v-row>
		</v-container>
		<v-dialog class="new-dialog" v-model="showNewDialog">
			<v-card class="card">
				<div class="for-card-header">
					<span>Crear Marca</span>
				</div>
				<v-form class="form-input-panel" @submit.prevent="handleAddNewBrand">
					<v-card-text class="text-field-group">
						<v-text-field
							variant="outlined"
							v-model="newBrand.name"
							label="Nombre"
							:rules="[formRules.required(), formRules.min(3)]"
						/>
						<v-file-input
							v-model="newBrand.logo"
							accept="image/*"
							variant="outlined"
							label="Subir Logo"
							name="logo"
							:rules="[formRules.required()]"
						></v-file-input>
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
</style>
