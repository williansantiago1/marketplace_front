import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { ApiError, type ApiErrorBody } from "../types/api";
import type { LoginResponse } from "../types/auth";
import {
  clearAuth,
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  setUser,
} from "../lib/storage";

const baseURL = import.meta.env.VITE_API_URL ?? "/api";

export const http = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

let onUnauthorized: (() => void) | null = null;
let refreshPromise: Promise<boolean> | null = null;

export function setOnUnauthorized(cb: () => void) {
  onUnauthorized = cb;
}

function toApiError(error: AxiosError<ApiErrorBody>) {
  const status = error.response?.status ?? 500;
  const code = error.response?.data?.error?.code ?? "ERROR";
  const message =
    error.response?.data?.error?.message ?? error.message ?? "Erro na requisição";
  return new ApiError(status, code, message);
}

async function refreshTokens(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const { data } = await axios.post<LoginResponse>(`${baseURL}/auth/refresh`, {
      refreshToken,
    });
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    setUser(data.user);
    return true;
  } catch {
    return false;
  }
}

http.interceptors.request.use((config) => {
  const skipAuth = Boolean(config.headers?.["X-Skip-Auth"]);
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  if (config.headers) {
    delete config.headers["X-Skip-Auth"];
  }
  return config;
});

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    const url = original?.url ?? "";

    const isAuthPath =
      url.includes("/auth/login") ||
      url.includes("/auth/refresh") ||
      url.includes("/auth/register");

    if (status === 401 && original && !original._retry && !isAuthPath) {
      original._retry = true;

      if (!refreshPromise) {
        refreshPromise = refreshTokens().finally(() => {
          refreshPromise = null;
        });
      }

      const ok = await refreshPromise;
      if (ok) {
        return http(original);
      }

      clearAuth();
      onUnauthorized?.();
    }

    throw toApiError(error);
  },
);

async function request<T>(
  method: "get" | "post" | "patch" | "delete",
  path: string,
  body?: unknown,
  auth = true,
): Promise<T> {
  const config: AxiosRequestConfig = {
    method,
    url: path,
    data: body,
    headers: auth ? {} : { "X-Skip-Auth": "1" },
  };

  const response = await http.request<T>(config);
  return response.data;
}

export const api = {
  get: async <T>(path: string, auth = true) => request<T>("get", path, undefined, auth),
  post: async <T>(path: string, body?: unknown, auth = true) =>
    request<T>("post", path, body, auth),
  patch: async <T>(path: string, body?: unknown, auth = true) =>
    request<T>("patch", path, body, auth),
  del: async <T>(path: string, auth = true) =>
    request<T>("delete", path, undefined, auth),
};
