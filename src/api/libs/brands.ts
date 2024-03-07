import { http } from '../http.js';
import { http_files } from '../http.files.js';

const getAll = async () => {
	try {
		const resp = await http.get('/brands');
		return resp.data.data;
	} catch (error) {
		throw error;
	}
};

const create = async (_brand: FormData) => {
	try {
		await http_files.post('/brands', _brand);
	} catch (error) {
		throw error;
	}
};

const update = async (_brand: FormData, id: number) => {
	try {
		await http_files.put(`/brands/${id}`, _brand);
	} catch (error) {
		throw error;
	}
};

const remove = async (_id: number) => {
	try {
		await http.delete(`/brands/${_id}`);
	} catch (error: any) {
		console.log(error);
		throw error;
	}
};

export const brandsApi = {
	getAll: () => getAll(),
	create: (_brand: FormData) => create(_brand),
	update: (_brand: FormData, id: number) => update(_brand, id),
	remove: (_id: number) => remove(_id),
};
