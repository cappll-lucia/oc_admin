import { http } from '@/api/http.js';
import token from '@/api/token.js';
import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';
import { type JwtUser } from '@/api/entities.js';

export const useUserStore = defineStore('UserStore', {
	state: () => ({
		user: {} as JwtUser,
	}),

	actions: {
		async login(email: string, password: string) {
			try {
				const res = await http.post('/users/login', { email, password });
				token.set(res.data.token);
				this.user = jwtDecode(res.data.token);
			} catch (error: any) {
				throw new Error(error.response.data.message);
			}
		},

		async signOut() {
			token.delete();
			window.location.reload();
		},
	},

	getters: {
		isSignedIn: () => token.get(),
		// getMe: () => token.get() ? jwtDecode(token.get()!) : null,
		getMe: () => {
			const decodedToken = token.get();
			if (decodedToken) {
				return jwtDecode(decodedToken) as JwtUser; // Explicitly cast to JwtUser
			} else {
				return null;
			}
		},
	},
});
