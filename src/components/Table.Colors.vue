<script setup lang="ts">
import { onMounted, ref, defineEmits } from 'vue';
import { type DataTableHeader } from '../utils/types.js';
import type { Color } from '@/api/entities.js';
import formRules from 'form-rules';
import NotificationConfirmation from './Notification.Confirmation.vue';
import { VueGpickr, LinearGradient } from 'vue-gpickr';

const props = defineProps(['colors']);
const emits = defineEmits(['handleDelete', 'handleEdit']);

const headers: DataTableHeader[] = [
	{ title: 'Código', key: 'id', align: 'start' },
	{ title: 'Nombre', key: 'name', align: 'start' },
	{ title: 'Icono', key: 'background', align: 'start' },
	{ title: '', key: 'actions', align: 'end', value: 'actions' },
];
const initSort = [{ key: 'name', order: 'asc' }];

const getBackgroundStyle = (background: any) => {
	if (background.startsWith('#')) {
		return { backgroundColor: background };
	} else {
		try {
			const gradient = JSON.parse(background);
			if (gradient && gradient._type === 'linear') {
				return {
					backgroundImage: `linear-gradient(${gradient._angle}deg, ${gradient._stops
						.map(([color, position]: [string, number]) => `${color} ${position * 100}%`)
						.join(', ')})`,
				};
			}
		} catch (error) {
			return {};
		}
	}
};

const pickedColor = ref('#118c1A');
const pickedGradient = ref('');
const isGradient = ref(false);

const isFormValid = () =>
	(editedColor.value as Color).name.length > 3 && editedColor.value;

const showEditDialog = ref(false);
const showDeleteDialog = ref(false);

const editedColor = ref({});

const clearEditedColor = () => {
	editedColor.value = {};
};

const edit = (color: any) => {
	if (color.background.startsWith('#')) {
		isGradient.value = false;
		pickedColor.value = color.background;
		pickedGradient.value = new LinearGradient({
			angle: 0,
			stops: [
				['#0359b5', 0],
				['#f6ce01', 1],
			],
		});
	} else {
		isGradient.value = true;
		const parsedGradient = JSON.parse(color.background);
		pickedGradient.value = new LinearGradient(parsedGradient);
	}
	editedColor.value = color;
	showEditDialog.value = true;
};

const del = (color: any) => {
	editedColor.value = color;
	showDeleteDialog.value = true;
};

const confirmDelete = () => {
	showDeleteDialog.value = false;

	emits('handleDelete', editedColor.value);
	clearEditedColor();
	showDeleteDialog.value = false;
};

const confirmEdition = () => {
	(editedColor.value as Color).background = isGradient.value
		? JSON.stringify(pickedGradient.value)
		: pickedColor.value;
	if (isFormValid()) {
		showEditDialog.value = false;
		emits('handleEdit', editedColor.value);
		clearEditedColor();
	}
};
</script>

<template>
	<v-container class="colors-table my-table">
		<v-data-table
			class="elevation-2"
			:headers="headers"
			:items="props.colors"
			v-model:sort-by="(initSort as any)"
		>
			<template v-slot:item.background="{ item }">
				<div
					class="color-bkg-icon"
					:style="getBackgroundStyle((item as Color).background)"
				></div>
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
		<v-dialog v-model="showEditDialog" class="edit-dialog color-edit-dialog">
			<v-card class="card">
				<div class="form-card-header">
					<span>Editar Color</span>
				</div>
				<v-form class="form-input-panel" @submit.prevent="confirmEdition">
					<v-card-text class="text-field-group">
						<v-text-field
							variant="outlined"
							v-model="(editedColor as Color).name"
							label="Nombre"
							:rules="[formRules.required(), formRules.min(3)]"
							class="name-color"
						/>
						<div class="select-bg-mode">
							<span :class="isGradient ? 'not-selected' : 'selected'">Color sólido</span>
							<v-switch v-model="isGradient"></v-switch>
							<span :class="isGradient ? 'selected' : 'not-selected'">Gradiente</span>
						</div>
						<div class="picker">
							<vue-gpickr v-if="isGradient" v-model="pickedGradient" />
							<v-color-picker v-else v-model="pickedColor" mode="hexa"></v-color-picker>
						</div>
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
		<v-dialog v-model="showDeleteDialog" max-width="290">
			<NotificationConfirmation
				:title="'Eliminar Color'"
				:question="`¿Está seguro de eliminar el color ${(editedColor as Color).name}`"
				@cancel="showDeleteDialog = false"
				@confirm="confirmDelete"
			/>
		</v-dialog>
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
.color-edit-dialog {
	.card {
		padding: 2rem;
		width: 40rem;
		color: #022c66;
		.form-input-panel {
			.text-field-group {
				margin-bottom: 2rem;
				display: flex;
				flex-direction: column;
				align-items: center;
			}
		}
	}
}
.v-color-picker-edit .v-btn {
	display: none;
}
.name-color {
	width: 16rem;
}

.select-bg-mode {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	height: 40px;
	width: 60%;
	margin-bottom: 1rem;
	span {
		font-size: 16px;
		height: 40px;
		display: flex;
		align-items: center;
		padding: 0;
	}
	.v-switch {
		display: flex;
		justify-content: center;
		align-items: center;
		.v-switch__track {
			background-color: #022c66;
		}
	}
	.selected {
		color: #022c66;
		font-weight: 600;
	}
	.not-selected {
		color: gray;
	}
}

.picker {
	height: 16rem;
	width: 100%;
	display: flex;
	justify-content: center;
	.vue-gpickr {
		height: 16rem;
		width: 30rem;
		.vc-sketch-field--single {
			display: none;
		}
	}
	.v-color-picker {
		height: 16rem;
		width: 30rem !important;
		.v-color-picker-canvas {
			canvas {
				height: 6rem;
			}
		}
		.v-color-picker__controls {
			padding: 0 16px;
		}
	}
}
</style>
