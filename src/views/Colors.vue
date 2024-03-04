<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { colorsApi } from '@/api/libs/colors.js';
import TableColors from '@/components/Table.Colors.vue';
import Loader from '../components/Loader.vue';
import formRules from 'form-rules';
import NotificationSuccess from '@/components/Notification.Success.vue';
import NotificationError from '@/components/Notification.Error.vue';
import { VueGpickr, LinearGradient } from 'vue-gpickr';
import { type Color } from '@/api/entities.js';

const colors = ref<Color[]>([]);

const pickedColor = ref('#118c1A');
const pickedGradient = ref('');
const isGradient = ref(false);

const loading = ref(true);
const showNewDialog = ref(false);
const showSuccessDialog = ref(false);
const showErrorDialog = ref(false);

const newColor = ref<{ name: string; background: string }>({
	name: '',
	background: '',
});

const result = ref<{ title: string | null; message: string | null }>({
	title: null,
	message: null,
});

const getColors = async () => {
	colors.value = await colorsApi.getAll();
	loading.value = false;
};

const clearNewColor = () => {
	newColor.value.name = '';
	newColor.value.background = '';
};

const isFormValid = () => newColor.value.name.length > 3 && newColor.value;

const handleAddNewColor = async () => {
	try {
		newColor.value.background = isGradient.value
			? JSON.stringify(pickedGradient.value)
			: pickedColor.value;
		if (isFormValid()) {
			showNewDialog.value = false;
			await colorsApi.add(newColor.value);
			result.value.title = 'Color creado con éxito';
			showSuccessDialog.value = true;
			clearNewColor();
			await getColors();
		}
	} catch (error: any) {
		result.value.title = 'Error al crear color';
		result.value.message = error.response.data.message;
		showErrorDialog.value = true;
	}
};

const handleEditColor = async (color: Color) => {
	try {
		await colorsApi.update(color);
		result.value.message = 'Color actualizado con éxito';
		colors.value = await colorsApi.getAll();
		showSuccessDialog.value = true;
	} catch (error: any) {
		result.value.title = 'Error al actualizar color';
		result.value.message = error.response.data.message;
		showErrorDialog.value = true;
	}
};

const handleDeleteColor = async (color: Color) => {
	try {
		await colorsApi.remove(color.id);
		result.value.message = 'Color eliminado con éxito';
		showSuccessDialog.value = true;
		await getColors();
	} catch (error: any) {
		result.value.title = 'Error al eliminar color';
		result.value.message = error.response.data.message;
		showErrorDialog.value = true;
	}
};

onMounted(() => {
	pickedGradient.value = new LinearGradient({
		angle: 0,
		stops: [
			['#0359b5', 0],
			['#f6ce01', 1],
		],
	});
	getColors();
});
</script>

<template>
	<v-layout class="page-layout">
		<v-container class="page-view">
			<v-row class="header">
				<v-col cols="10">
					<v-toolbar-title> COLORES </v-toolbar-title>
				</v-col>
				<v-col cols="2">
					<v-btn
						@click="
							() => {
								clearNewColor();
								showNewDialog = true;
							}
						"
						>CREAR +</v-btn
					>
				</v-col>
			</v-row>
			<v-row>
				<v-col cols="12" v-if="!loading">
					<TableColors
						:colors="colors"
						@handleDelete="handleDeleteColor"
						@handleEdit="handleEditColor"
					/>
				</v-col>
				<Loader v-else :message="'Cargando Colores...'" />
			</v-row>
		</v-container>
		<v-dialog class="new-dialog color-new-dialog" v-model="showNewDialog">
			<v-card class="card">
				<div class="form-card-header">
					<span>Crear Color</span>
				</div>
				<v-form class="form-input-panel" @submit.prevent="handleAddNewColor">
					<v-card-text class="text-field-group">
						<v-text-field
							variant="outlined"
							v-model="newColor.name"
							label="Nombre"
							class="name-color"
							:rules="[formRules.required(), formRules.min(3)]"
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

.color-new-dialog {
	.card {
		padding: 2rem;
		width: 40rem;
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
