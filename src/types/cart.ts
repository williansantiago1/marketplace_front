import type { Product } from "./catalog";

export type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
};

export type Cart = {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items: CartItem[];
};
