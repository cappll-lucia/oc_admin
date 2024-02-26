<script setup lang="ts">
import { computed } from 'vue';
import { version } from 'vue';

const footerText = computed(() => {
	const today = new Date().getFullYear();
	return `${today} © Lucía Cappellini`;
});
</script>

<template>
	<v-footer>
		<div class="mx-o py-2 bg-gray-lighten-3 text-right w-100">
			<span class="ml-3" v-text="footerText"></span>
		</div>
	</v-footer>
</template>
