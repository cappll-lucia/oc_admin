<script setup lang="ts">
import { onMounted, ref, defineEmits } from 'vue';
import { type DataTableHeader } from '../utils/types.js';
import NotificationConfirmation from './Notification.Confirmation.vue';
import type { Brand } from '@/api/entities.js';
import formRules from 'form-rules';
const props = defineProps(['brands']);
const emits = defineEmits(['handleDelete', 'handleEdit']);

const headers: DataTableHeader[] = [
	{ title: 'Código', key: 'id', align: 'start' },
	{ title: 'Nombre', key: 'name', align: 'start' },
	{ title: 'Logo', key: 'logo', align: 'start' },
	{ title: '', key: 'actions', align: 'end', value: 'actions' },
];
const initSort = [{ key: 'name', order: 'asc' }];

const getLogoUrl = (item: Brand) =>
	`${import.meta.env.VITE_API_URL}/brands/logo/${item.logo}`;

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);

const editedBrand = ref({});
const newLogo = ref([]);

const edit = (brand: any) => {
	editedBrand.value = {};
	editedBrand.value = { ...brand };
	showEditDialog.value = true;
};
const del = (brand: any) => {
	editedBrand.value = {};
	editedBrand.value = { ...brand };
	console.log(brand);
	showDeleteDialog.value = true;
};

const isFormValid = () =>
	(editedBrand.value as Brand).name.length > 3 && (editedBrand.value as Brand).logo;

const confirmDelete = () => {
	showDeleteDialog.value = false;
	emits('handleDelete', editedBrand.value);
};

const confirmEdition = () => {
	if (isFormValid()) {
		const formData = new FormData();
		if (newLogo.value) {
			formData.append('logo', newLogo.value[0]);
		}
		formData.append('name', (editedBrand.value as Brand).name);
		showEditDialog.value = false;
		emits('handleEdit', formData, (editedBrand.value as Brand).id);
	}
};
</script>

<template>
	<v-container class="brands-table my-table">
		<v-data-table
			class="elevation-2"
			:headers="headers"
			:items="props.brands"
			v-model:sort-by="(initSort as any)"
		>
			<template v-slot:item.logo="{ item }">
				<div class="table-image-container">
					<v-img
						:src="getLogoUrl((item as Brand))"
						class="table-image text-center"
					></v-img>
				</div>
			</template>
			<template v-slot:item.actions="{ item }">
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
				:title="'Eliminar Marca'"
				:question="`¿Estás seguro de eliminar la marca ${(editedBrand as Brand).name.toLocaleUpperCase()}?`"
				@cancel="
					() => {
						showDeleteDialog = false;
					}
				"
				@confirm="confirmDelete"
			/>
		</v-dialog>
		<v-dialog v-model="showEditDialog" max-width="290">
			<v-card class="edit-card card">
				<div class="form-card-header">
					<span>Editar Marca</span>
				</div>
				<v-form class="form-input-panel" @submit.prevent="confirmEdition">
					<v-card-text class="text-field-group">
						<v-text-field
							variant="outlined"
							v-model="(editedBrand as Brand).name"
							label="Nombre"
							:rules="[formRules.required(), formRules.min(3)]"
						/>
						<div class="logo-img">
							<v-label>Logo actual</v-label>
							<img :src="getLogoUrl((editedBrand as Brand))" />
						</div>
						<v-file-input
							v-model="newLogo"
							accept="image/*"
							variant="outlined"
							label="Actualizar Logo"
							name="logo"
							class="mb-4"
							:rules="[formRules.required()]"
						></v-file-input>
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
@import url('../assets//forms.scss');

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

.table-image-container {
	width: 60px;
	height: 50px;
	right: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.text-field-group .logo-img {
	width: 100%;
	height: 200px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	margin-bottom: 2rem;
	img {
		margin-top: 0.5rem;
		height: 150px;
		width: min-content;
	}
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
