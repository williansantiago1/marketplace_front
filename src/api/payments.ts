import type { Payment } from "../types/payment";
import { api } from "./client";

export const paymentsApi = {
  create(orderId: string) {
    return api.post<Payment>("/payments", { orderId });
  },
};
