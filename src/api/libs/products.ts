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
const getProducMetadata = async (_prodId: number) => {
	try {
		const resp = await http.get(`products/data/${_prodId}`);
		return resp.data.data;
	} catch (error: any) {
		throw error.response.data;
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

const updateStock = async (_prodId: number, _colorId: number, stock: number) => {
	try {
		const resp = await http.put(`products/update-stock/${_prodId}/${_colorId}`, {
			stock,
		});
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

const deleteImage = async (_prodId: number, _colorId: number, _imageName: string) => {
	try {
		console.log(_prodId);
		await http.put(`/products/delete-image/${_prodId}/${_colorId}/${_imageName}`);
	} catch (error: any) {
		console.log(error);
		throw error.response.data;
	}
};

export const productsApi = {
	getAll: () => getAll(),
	getProducMetadata: (_prodId: number) => getProducMetadata(_prodId),
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
	updateStock: (_prodId: number, _colorId: number, _stock: number) =>
		updateStock(_prodId, _colorId, _stock),
	remove: (_id: number) => remove(_id),
	deleteImage: (_prodId: number, _colorId: number, _imageName: string) =>
		deleteImage(_prodId, _colorId, _imageName),
};
