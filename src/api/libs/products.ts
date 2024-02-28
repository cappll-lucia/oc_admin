import { http } from '../http.js';

const getAll = async () => {
	try {
		const resp = await http.get('/products');
		console.log(resp);
		return resp.data.data;
	} catch (error) {
		throw error;
	}
};

export const productsApi = {
	getAll: () => getAll(),
};
