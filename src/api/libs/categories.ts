import { http } from '../http.js';

const getAll = async () => {
	try {
		const resp = await http.get('/categories');
		return resp.data.data;
	} catch (error) {
		throw error;
	}
};

export const categoriesApi = {
	getAll: () => getAll(),
};
