import type { Store } from "./catalog";
import type { Payment } from "./payment";

export type OrderStatus =
  | "PENDING_PAYMENT"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "FAILED";

export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  unitPriceInCents: number;
  quantity: number;
  lineTotalInCents: number;
};

export type Order = {
  id: string;
  userId: string;
  storeId: string;
  couponId: string | null;
  status: OrderStatus;
  subtotalInCents: number;
  discountInCents: number;
  totalInCents: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  store?: Store;
  payment?: Payment | null;
};

export type CheckoutInput = {
  couponCode?: string;
};
