import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "../types/catalog";
import { api } from "./client";

export const categoriesApi = {
  list() {
    return api.get<Category[]>("/categories", false);
  },
  getById(id: string) {
    return api.get<Category>(`/categories/${id}`, false);
  },
  create(data: CreateCategoryInput) {
    return api.post<Category>("/categories", data);
  },
  update(id: string, data: UpdateCategoryInput) {
    return api.patch<Category>(`/categories/${id}`, data);
  },
};
