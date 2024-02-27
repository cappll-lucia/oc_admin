import { http } from '@/api/http.js';
import token from '@/api/token.js';
import { defineStore } from 'pinia';
import { jwtDecode } from 'jwt-decode';

export const useUserStore = defineStore('UserStore', {
	state: () => ({
		user: {},
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
  getMe(): any { return this.user; }
},
});
