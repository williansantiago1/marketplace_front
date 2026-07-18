import type { Cart } from "../types/cart";
import { api } from "./client";

export const cartApi = {
  get() {
    return api.get<Cart>("/cart");
  },
  addItem(productId: string, quantity: number) {
    return api.post<Cart>("/cart/items", { productId, quantity });
  },
  updateItem(itemId: string, quantity: number) {
    return api.patch<Cart>(`/cart/items/${itemId}`, { quantity });
  },
  removeItem(itemId: string) {
    return api.del<Cart>(`/cart/items/${itemId}`);
  },
};
