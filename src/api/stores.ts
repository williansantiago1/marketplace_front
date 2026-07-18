import type {
  CreateStoreInput,
  Store,
  UpdateStoreInput,
} from "../types/catalog";
import { api } from "./client";

export const storesApi = {
  getById(id: string) {
    return api.get<Store>(`/stores/${id}`, false);
  },
  getBySlug(slug: string) {
    return api.get<Store>(`/stores/slug/${slug}`, false);
  },
  listMine() {
    return api.get<Store[]>("/stores/mine");
  },
  create(data: CreateStoreInput) {
    return api.post<Store>("/stores", data);
  },
  update(id: string, data: UpdateStoreInput) {
    return api.patch<Store>(`/stores/${id}`, data);
  },
};
