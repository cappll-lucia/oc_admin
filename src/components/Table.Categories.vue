<script setup lang="ts">
import { onMounted, ref, defineEmits } from 'vue';
import { type DataTableHeader } from '../utils/types.js';
import type { Category } from '@/api/entities.js';
import NotificationConfirmation from './Notification.Confirmation.vue';
import formRules from 'form-rules';
const props = defineProps(['categories']);
const emits = defineEmits(['handleDelete', 'handleEdit']);

const headers: DataTableHeader[] = [
	{ title: 'Código', key: 'id', align: 'start' },
	{ title: 'Nombre', key: 'name', align: 'start' },
	{ title: '', key: 'actions', align: 'end', value: 'actions' },
];
const initSort = [{ key: 'name', order: 'asc' }];

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);

const editedCategory = ref({});

const clearEditedCategory = () => {
	editedCategory.value = {};
};

const edit = (categ: any) => {
	editedCategory.value = { ...categ };
	showEditDialog.value = true;
};
const del = (categ: any) => {
	editedCategory.value = categ;
	showDeleteDialog.value = true;
};
const isFormValid = () => (editedCategory.value as Category).name.length > 3;

const confirmEdition = () => {
	if (isFormValid()) {
		showEditDialog.value = false;
		emits('handleEdit', editedCategory.value);
		clearEditedCategory();
	}
};
const confirmDelete = () => {
	showDeleteDialog.value = false;
	emits('handleDelete', editedCategory.value);
	clearEditedCategory();
};
</script>

<template>
	<v-container class="categ-table my-table">
		<v-data-table
			class="elevation-2"
			:headers="headers"
			:items="props.categories"
			v-model:sort-by="(initSort as any)"
		>
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
				:title="'Eliminar Categoría'"
				:question="`¿Está seguro de eliminar la categoría ${(editedCategory as Category).name.toLocaleUpperCase()}?`"
				@cancel="() => (showDeleteDialog = false)"
				@confirm="confirmDelete"
			/>
		</v-dialog>
		<v-dialog v-model="showEditDialog" max-width="290">
			<v-card class="edit-card card">
				<div class="form-card-header">
					<span>Editar Categoría</span>
				</div>
				<v-form class="form-input-panel" @submit.prevent="confirmEdition">
					<v-card-text class="text-field-group">
						<v-text-field
							variant="outlined"
							v-model="(editedCategory as Category).name"
							label="Nombre"
							:rules="[formRules.required(), formRules.min(3)]"
						/>
						<v-text-field
							variant="outlined"
							v-model="(editedCategory as Category).description"
							label="Descripción"
						/>
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

.edit-card {
	color: #022c66;
}

.categ-table .v-data-table-footer__items-per-page {
	display: none;
}

.categ-table .v-data-table-footer {
	padding: 0;
}
</style>
