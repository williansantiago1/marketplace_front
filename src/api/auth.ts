import type {
  LoginInput,
  LoginResponse,
  PublicUser,
  RegisterInput,
} from "../types/auth";
import { api } from "./client";

export const authApi = {
  register(data: RegisterInput) {
    return api.post<PublicUser>("/auth/register", data, false);
  },
  login(data: LoginInput) {
    return api.post<LoginResponse>("/auth/login", data, false);
  },
  refresh(refreshToken: string) {
    return api.post<LoginResponse>(
      "/auth/refresh",
      { refreshToken },
      false,
    );
  },
  logout(refreshToken: string) {
    return api.post<void>("/auth/logout", { refreshToken });
  },
  me() {
    return api.get<PublicUser>("/auth/me");
  },
  becomeSeller() {
    return api.post<LoginResponse>("/auth/become-seller");
  },
};
