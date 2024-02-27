<script setup lang="ts">
import { ref, reactive } from 'vue';
import formRules from 'form-rules';
import { useUserStore } from '../stores/UsersStore.js';
import router from '@/router/index.js';
import { validator } from '../utils/validator.js';
import { mdiCarLightAlert } from '@mdi/js';
import { http } from '@/api/http.js';

const userStore = useUserStore();

const loginData = reactive({
	email: null,
	password: null,
});

const loginErr = ref(false);
const emailRules = ref([formRules.required(), formRules.email()]);
const pswRules = ref([formRules.required()]);

const showPass = ref(false);

const handleLogin = async () => {
	try {
		if (loginData.password && validator.email(loginData.email)) {
			await userStore.login(loginData.email || '', loginData.password || '');
			router.replace('/');
			location.reload();
			location.replace('/');
		}
	} catch (error: any) {
		loginErr.value = error.message;
	}
};
</script>

<template>
	<div class="form-sheet">
		<v-card class="form-card form-card-login">
			<div class="form-card-header">
				<span>INICIAR SESIÓN</span>
			</div>
			<v-form class="form-input-panel" @submit.prevent="handleLogin()">
				<v-card-text class="text-field-group">
					<v-text-field
						v-model="loginData.email"
						label="Email"
						variant="outlined"
						:rules="emailRules"
						@focus="emailRules = []"
						@blur="emailRules = [formRules.email(), formRules.required()]"
					>
					</v-text-field>
					<v-text-field
						class="password"
						v-model="loginData.password"
						label="Contraseña"
						variant="outlined"
						:rules="pswRules"
						@focus="pswRules = []"
						@blur="pswRules = [formRules.required()]"
						:append-icon="showPass ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
						:type="showPass ? 'text' : 'password'"
						@click:append="showPass = !showPass"
					>
					</v-text-field>
					<div class="login-form-notes">
						<span class="error-msj" v-if="loginErr">{{ loginErr }}</span>
					</div>
				</v-card-text>
				<v-card-actions class="form-action-panel">
					<v-btn type="submit" class="submit-btn" width="100">INGRESAR</v-btn>
				</v-card-actions>
			</v-form>
		</v-card>
	</div>
</template>

<style lang="scss">
@import url('../assets/forms.scss');

.form-sheet {
	align-items: flex-start;
}

.form-card-login {
	margin-top: 4rem;
	padding: 2rem 0.5rem !important;
	box-shadow: 0px 15px 20px rgba(0, 0, 0, 0.2) !important;

	.form-input-panel {
		width: 80% !important;
		.text-field-group .v-field__input {
			height: 5px;
		}
	}
}
.form-sheet .form-card-login .form-card-header {
	font-size: 1.5rem;
}
.form-sheet .form-card .form-input-panel {
	margin: 1rem 0 0 0;
	height: min-content;
}

.form-sheet .form-card .form-input-panel .text-field-group .v-field__input {
	height: 5px;
	padding-top: 5px;
	color: #022c66;
}
.v-messages__message {
	line-height: 1rem;
	margin-bottom: 1rem;
}

.password {
	color: #022c66;
}

.error-msj {
	color: #b0002b;
}

.form-sheet .form-card .form-input-panel .v-input--density-default .v-field--variant-outlined,
.v-input--density-default .v-field--single-line,
.v-input--density-default .v-field--no-label {
	color: #022c66;
}

.form-card-login {
	box-shadow: 0px 2px 1px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
		0px 1px 1px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
		0px 1px 3px 0px var(--v-shadow-key-ambient-opacity, rgba(0, 0, 0, 0.12));
}

.form-card-login .form-input-panel .form-action-panel {
	width: 100%;
	margin-top: 0;
	.v-btn {
		width: 100% !important;
	}
}

.login-form-notes {
	display: flex;
	justify-content: space-between;
	align-items: self-start;
	flex-direction: column;
}

.btn-google {
	display: none;
}
</style>
