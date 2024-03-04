import { mdiCarLightAlert } from '@mdi/js';
import type { Product } from '../entities.js';
import { http } from '../http.js';

const getAll = async () => {
	try {
		const resp = await http.get('/products');
		return resp.data.data;
	} catch (error) {
		throw error;
	}
};

const add = async (_product: {
	name: string;
	description: string | null;
	price: number;
	category: number;
	brand: number;
	colors: number[];
}) => {
	try {
		await http.post('/products', _product);
	} catch (error: any) {
		console.log(error);
		throw error.response.data;
	}
};

const update = async (
	_prod: {
		name: string;
		description: string | null;
		price: number;
		category: number;
		brand: number;
		colors: number[];
	},
	_id: number
) => {
	try {
		const resp = await http.put(`products/${_id}`, _prod);
		return resp.data;
	} catch (error: any) {
		throw error.response.data;
	}
};

const remove = async (_id: number) => {
	try {
		await http.delete(`/products/${_id}`);
		console.log('delll');
	} catch (error: any) {
		console.log(error);
		throw error.response.data;
	}
};

export const productsApi = {
	getAll: () => getAll(),
	add: (_product: {
		name: string;
		description: string | null;
		price: number;
		category: number;
		brand: number;
		colors: number[];
	}) => add(_product),
	update: (
		_product: {
			name: string;
			description: string | null;
			price: number;
			category: number;
			brand: number;
			colors: number[];
		},
		_id: number
	) => update(_product, _id),
	remove: (_id: number) => remove(_id),
};
