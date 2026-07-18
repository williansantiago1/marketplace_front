export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED" | "CANCELLED";

export type Payment = {
  id: string;
  orderId: string;
  provider: string;
  providerPaymentId: string;
  status: PaymentStatus;
  amountInCents: number;
  clientSecret: string | null;
  createdAt: string;
  updatedAt: string;
};
