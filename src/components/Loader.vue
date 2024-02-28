<script setup lang="ts">
const props = defineProps(['message']);
</script>

<template>
	<div class="loader">
		<v-progress-circular indeterminate> </v-progress-circular>
		<span>{{ `${props.message}` }}</span>
	</div>
</template>
