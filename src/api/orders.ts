import type { CheckoutInput, Order } from "../types/order";
import { api } from "./client";

export const ordersApi = {
  checkout(data: CheckoutInput = {}) {
    return api.post<Order[]>("/orders/checkout", data);
  },
  listMine() {
    return api.get<Order[]>("/orders");
  },
  getById(id: string) {
    return api.get<Order>(`/orders/${id}`);
  },
  listByStore(storeId: string) {
    return api.get<Order[]>(`/orders/store/${storeId}`);
  },
  cancel(id: string) {
    return api.post<Order>(`/orders/${id}/cancel`);
  },
};
