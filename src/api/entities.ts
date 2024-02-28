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
