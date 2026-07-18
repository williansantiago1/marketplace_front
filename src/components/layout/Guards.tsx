import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import type { Role } from "../../types/auth";
import { Spinner } from "../ui/Spinner";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/entrar" replace />;
  return children;
}

export function RoleRoute({
  roles,
  children,
}: {
  roles: Role[];
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Navigate to="/entrar" replace />;
  if (!user || !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
