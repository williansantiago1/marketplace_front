import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authApi } from "../api/auth";
import { setOnUnauthorized } from "../api/client";
import {
  clearAuth,
  getAccessToken,
  getRefreshToken,
  getUser,
  setAuth,
} from "../lib/storage";
import { ApiError } from "../types/api";
import type { PublicUser, RegisterInput } from "../types/auth";

type AuthContextValue = {
  user: PublicUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUserState] = useState<PublicUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setOnUnauthorized(() => {
      setUserState(null);
      navigate("/entrar");
    });
  }, [navigate]);

  useEffect(() => {
    async function hydrate() {
      const stored = getUser();
      const token = getAccessToken();
      if (!stored || !token) {
        setIsLoading(false);
        return;
      }
      setUserState(stored);
      try {
        const me = await authApi.me();
        setUserState(me);
      } catch {
        clearAuth();
        setUserState(null);
      } finally {
        setIsLoading(false);
      }
    }
    void hydrate();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await authApi.login({ email, password });
    setAuth(data);
    setUserState(data.user);
    toast.success("Bem-vindo à Vitrine");
  }, []);

  const register = useCallback(async (data: RegisterInput) => {
    await authApi.register(data);
    toast.success("Conta criada. Faça login.");
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // ignore
    }
    clearAuth();
    setUserState(null);
    toast.success("Até logo");
    navigate("/entrar");
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth fora do AuthProvider");
  return ctx;
}

export function getErrorMessage(error: unknown) {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "Algo deu errado";
}
