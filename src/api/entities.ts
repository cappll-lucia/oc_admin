interface BaseEntity{
  id: number,
  createdAt: string,
  updatedAt: string
}

export interface User extends BaseEntity{
  email: string,
  password: string,
  firstName: string,
  lastName: string,
  role:string
}


export interface Category extends BaseEntity{
  name:string,
  description: string | null
}



