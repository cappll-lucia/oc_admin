import { http } from '../http.js';

const getAll = async () => {
	try {
		const resp = await http.get('/brands');
		return resp.data.data;
	} catch (error) {
		throw error;
	}
};

export const brandsApi = {
	getAll: () => getAll(),
};
