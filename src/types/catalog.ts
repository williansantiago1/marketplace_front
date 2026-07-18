export type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type Store = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  description: string | null;
  priceInCents: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  store?: Store;
  category?: Category;
};

export type ProductListResponse = {
  items: Product[];
  total: number;
  page: number;
  limit: number;
};

export type ListProductsParams = {
  page?: number;
  limit?: number;
  categoryId?: string;
  storeId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
};

export type CreateProductInput = {
  storeId: string;
  categoryId: string;
  name: string;
  description?: string;
  priceInCents: number;
  stock: number;
};

export type UpdateProductInput = Partial<{
  categoryId: string;
  name: string;
  description: string | null;
  priceInCents: number;
  stock: number;
  isActive: boolean;
}>;

export type CreateStoreInput = {
  name: string;
  slug: string;
  description?: string;
};

export type UpdateStoreInput = Partial<CreateStoreInput & { isActive: boolean }>;

export type CreateCategoryInput = {
  name: string;
  slug: string;
};

export type UpdateCategoryInput = Partial<CreateCategoryInput>;
