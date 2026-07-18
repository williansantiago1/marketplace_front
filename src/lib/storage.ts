import type { PublicUser } from "../types/auth";

const ACCESS = "Vitrine_access_token";
const REFRESH = "Vitrine_refresh_token";
const USER = "Vitrine_user";

export function getAccessToken() {
  return localStorage.getItem(ACCESS);
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS, token);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH);
}

export function setRefreshToken(token: string) {
  localStorage.setItem(REFRESH, token);
}

export function getUser(): PublicUser | null {
  const raw = localStorage.getItem(USER);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PublicUser;
  } catch {
    return null;
  }
}

export function setUser(user: PublicUser) {
  localStorage.setItem(USER, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
  localStorage.removeItem(USER);
}

export function setAuth(data: {
  user: PublicUser;
  accessToken: string;
  refreshToken: string;
}) {
  setUser(data.user);
  setAccessToken(data.accessToken);
  setRefreshToken(data.refreshToken);
}
