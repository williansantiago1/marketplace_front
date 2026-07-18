import type { CreateReviewInput, Review } from "../types/review";
import { api } from "./client";

export const reviewsApi = {
  listByProduct(productId: string) {
    return api.get<Review[]>(`/reviews/product/${productId}`, false);
  },
  create(data: CreateReviewInput) {
    return api.post<Review>("/reviews", data);
  },
};
