interface BaseEntity {
	id: number;
	createdAt: string;
	updatedAt: string;
}

export interface JwtUser extends BaseEntity {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role: string;
}

export interface Category extends BaseEntity {
	name: string;
	description: string | null;
}

export interface Product extends BaseEntity {
	name: string;
	description: string | null;
	price: number;
	category: Category;
	brand: Brand;
	promotions: [];
	colors: Color[];
}

export interface Category extends BaseEntity {
	name: string;
	description: string | null;
}

export interface Brand extends BaseEntity {
	name: string;
	logo: string | null;
}

export interface Color extends BaseEntity {
	name: string;
	background: string;
}
