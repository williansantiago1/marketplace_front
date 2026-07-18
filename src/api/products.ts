import type {
  CreateProductInput,
  ListProductsParams,
  Product,
  ProductListResponse,
  UpdateProductInput,
} from "../types/catalog";
import { api } from "./client";

function toQuery(params: ListProductsParams) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      q.set(key, String(value));
    }
  });
  const s = q.toString();
  return s ? `?${s}` : "";
}

export const productsApi = {
  list(params: ListProductsParams = {}) {
    return api.get<ProductListResponse>(`/products${toQuery(params)}`, false);
  },
  getById(id: string) {
    return api.get<Product>(`/products/${id}`, false);
  },
  create(data: CreateProductInput) {
    return api.post<Product>("/products", data);
  },
  update(id: string, data: UpdateProductInput) {
    return api.patch<Product>(`/products/${id}`, data);
  },
};
