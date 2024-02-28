import { http } from '../http.js';

const getAll = async () => {
	try {
		const resp = await http.get('/colors');
		return resp.data.data;
	} catch (error) {
		throw error;
	}
};

export const colorsApi = {
	getAll: () => getAll(),
};
