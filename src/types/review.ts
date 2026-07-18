export type Review = {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string };
};

export type CreateReviewInput = {
  productId: string;
  orderId: string;
  rating: number;
  comment?: string;
};
