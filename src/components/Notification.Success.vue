<script setup>
import { defineEmits } from 'vue';
const props = defineProps(['result']);
const emit = defineEmits(['close']);
</script>

<template>
	<v-card class="form-card p-2" width="26rem">
		<v-card-text class="d-flex flex-column">
			<div class="form-card-header-notif" v-if="props.result.title">
				<span>{{ props.result.title }}</span>
			</div>
			<span class="alert-body mt-2 mb-2">{{ props.result.message }}</span>
		</v-card-text>
		<div class="form-action-panel pb-4">
			<v-btn
				type="submit"
				class="submit-btn"
				@click="
					() => {
						emit('close');
					}
				"
				width="40%"
			>
				ACEPTAR
			</v-btn>
		</div>
	</v-card>
</template>

<style lang="scss">
@import '../assets/main.css';
@import '../assets/forms.scss';
.form-card-header-notif {
	font-size: 1.3rem !important;
}
</style>
