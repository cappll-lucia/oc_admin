<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { categoriesApi } from '@/api/libs/categories.js';
import TableCategories from '@/components/Table.Categories.vue';
import Loader from '../components/Loader.vue';
import formRules from 'form-rules';
import NotificationSuccess from '@/components/Notification.Success.vue';
import NotificationError from '@/components/Notification.Error.vue';
import { type Category } from '@/api/entities.js';
import { fa } from 'vuetify/locale';

const categories = ref<Category[]>([]);

const loading = ref(true);
const showNewDialog = ref(false);
const showSuccessDialog = ref(false);
const showErrorDialog = ref(false);

const newCategory = ref<{ name: string; description: string | null }>({
	name: '',
	description: null,
});
const result = ref<{ title: string | null; message: string | null }>({
	title: null,
	message: null,
});

const getCategories = async () => {
	categories.value = await categoriesApi.getAll();
	loading.value = false;
};

const clearNewCateg = () => {
	newCategory.value.name = '';
	newCategory.value.description = null;
};

const isFormValid = () => newCategory.value.name.length > 3;

const handleAddNewCategory = async () => {
	try {
		if (isFormValid()) {
			showNewDialog.value = false;
			await categoriesApi.add(newCategory.value);
			result.value.title = 'Categoría creada con éxito.';
			showSuccessDialog.value = true;
			clearNewCateg();
			await getCategories();
		}
	} catch (error: any) {
		console.log(error);
		result.value.title = 'Error al crear categoría';
		result.value.message = error.message;
		showErrorDialog.value = true;
	}
};

const handleEditCategory = async (categ: Category) => {
	try {
		await categoriesApi.update(categ);
		result.value.message = 'Categoría actualizada con éxito';
		showSuccessDialog.value = true;
		await getCategories();
	} catch (error: any) {
		console.log(error);
		result.value.title = 'Error al actualizar categoría';
		result.value.message = error.message;
		showErrorDialog.value = true;
	}
};

const handleDeleteCategory = async (categ: Category) => {
	try {
		await categoriesApi.remove(categ.id);
		result.value.message = 'Categoría eliminada con éxito';
		showSuccessDialog.value = true;
		await getCategories();
	} catch (error: any) {
		result.value.title = 'Error al eliminar categoría';
		result.value.message = error.message;
		showErrorDialog.value = true;
	}
};

onMounted(() => {
	getCategories();
});
</script>

<template>
	<v-layout class="page-layout">
		<v-container class="page-view">
			<v-row class="header">
				<v-col cols="10">
					<v-toolbar-title> CATEGORÍAS </v-toolbar-title>
				</v-col>
				<v-col cols="2">
					<v-btn
						@click="
							() => {
								clearNewCateg();
								showNewDialog = true;
							}
						"
						>CREAR +</v-btn
					>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12" v-if="!loading">
					<TableCategories
						:categories="categories"
						@handleEdit="handleEditCategory"
						@handleDelete="handleDeleteCategory"
					/>
				</v-col>
				<Loader v-else :message="'Cargando Categorías...'" />
			</v-row>
		</v-container>
		<v-dialog class="new-dialog" v-model="showNewDialog">
			<v-card class="card">
				<div class="form-card-header">
					<span>Crear Categoría</span>
				</div>
				<v-form class="form-input-panel" @submit.prevent="handleAddNewCategory">
					<v-card-text class="text-field-group">
						<v-text-field
							variant="outlined"
							v-model="newCategory.name"
							label="Nombre"
							:rules="[formRules.required(), formRules.min(3)]"
						/>
						<v-text-field
							variant="outlined"
							v-model="newCategory.description"
							label="Descripción"
						/>
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
