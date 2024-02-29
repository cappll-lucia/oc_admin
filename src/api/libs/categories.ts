import type { Category } from '../entities.js';
import { http } from '../http.js';

const getAll = async () => {
	try {
		const resp = await http.get('/categories');
		return resp.data.data;
	} catch (error) {
		throw error;
	}
};

const add = async (_categ: { name: string; description: string | null }) => {
	try {
		const resp = await http.post('/categories', _categ);
		return resp.data;
	} catch (error: any) {
		throw error.response.data;
	}
};

const update = async (_categ: Category) => {
	try {
		const resp = await http.put(`categories/${_categ.id}`, _categ);
		return resp.data;
	} catch (error: any) {}
};

const remove = async (_id: number) => {
	try {
		await http.delete(`/categories/${_id}`);
	} catch (error: any) {
		throw error.response.data;
	}
};

export const categoriesApi = {
	getAll: () => getAll(),
	add: (_caetg: { name: string; description: string | null }) => add(_caetg),
	update: (_categ: Category) => update(_categ),
	remove: (_id: number) => remove(_id),
};
