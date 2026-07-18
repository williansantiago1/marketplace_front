export type CouponType = "PERCENT" | "FIXED";

export type Coupon = {
  id: string;
  code: string;
  storeId: string | null;
  type: CouponType;
  value: number;
  minOrderInCents: number | null;
  maxUses: number | null;
  usedCount: number;
  startsAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCouponInput = {
  code: string;
  type: CouponType;
  value: number;
  storeId?: string | null;
  minOrderInCents?: number | null;
  maxUses?: number | null;
};

export type ValidateCouponInput = {
  code: string;
  storeId?: string;
  subtotalInCents?: number;
};

export type ValidateCouponResponse = {
  coupon: Coupon;
  discountInCents: number;
};
