<script setup lang="ts">
import { defineEmits } from 'vue';
const props = defineProps(['title', 'question']);
const emits = defineEmits(['confirm', 'cancel']);
</script>

<template>
	<v-card class="confirm-card" width="23rem">
		<div class="form-card-header-notif">
			<span>{{ props.title }}</span>
		</div>
		<v-form class="form-intup-panel mt-4" @submit.prevent="emits('confirm')">
			<v-card-text class="d-flex">
				<span class="del-alert">{{ props.question }}</span>
			</v-card-text>
			<div class="form-action-panel mt-2">
				<v-btn class="cancel-btn" variant="outlined" @click="emits('cancel')"
					>CANCELAR</v-btn
				>
				<v-btn type="submit" class="submit-btn" variant="outlined">ELIMINAR</v-btn>
			</div>
		</v-form>
	</v-card>
</template>

<style lang="scss">
.form-action-panel {
	display: flex;
	justify-content: space-between;
	.v-btn {
		width: 48%;
	}
}
.form-card-header-notif {
	color: #022c66;
}
</style>
