interface BaseEntity{
  id: number,
  createdAt: string,
  updatedAt: string
}

export interface Category extends BaseEntity{
  name:string,
  description: string | null
}

