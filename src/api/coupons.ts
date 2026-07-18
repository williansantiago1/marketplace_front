import type {
  Coupon,
  CreateCouponInput,
  ValidateCouponInput,
  ValidateCouponResponse,
} from "../types/coupon";
import { api } from "./client";

export const couponsApi = {
  validate(data: ValidateCouponInput) {
    return api.post<ValidateCouponResponse>("/coupons/validate", data);
  },
  create(data: CreateCouponInput) {
    return api.post<Coupon>("/coupons", data);
  },
  listByStore(storeId: string) {
    return api.get<Coupon[]>(`/coupons/store/${storeId}`);
  },
};
