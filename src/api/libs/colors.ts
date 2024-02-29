import type { Color } from '../entities.js';
import { http } from '../http.js';

const getAll = async () => {
	try {
		const resp = await http.get('/colors');
		return resp.data.data;
	} catch (error) {
		throw error;
	}
};

const add = async (_color: { name: string; background: string }) => {
	try {
		const resp = await http.post('/colors', _color);
		return resp.data;
	} catch (error: any) {
		throw error.response.data;
	}
};

const update = async (_color: Color) => {
	try {
		const resp = await http.put(`colors/${_color.id}`, _color);
		return resp.data;
	} catch (error: any) {
		throw error.response.data;
	}
};

const remove = async (_id: number) => {
	try {
		await http.delete(`/colors/${_id}`);
	} catch (error: any) {
		throw error.response.data;
	}
};

export const colorsApi = {
	getAll: () => getAll(),
	add: (_color: { name: string; background: string }) => add(_color),
	update: (_color: Color) => update(_color),
	remove: (_id: number) => remove(_id),
};
