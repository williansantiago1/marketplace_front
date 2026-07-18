export type Role = "CUSTOMER" | "SELLER" | "ADMIN";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "SELLER";
};

export type LoginResponse = {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
};
