import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/constants/routes";
import type { UserRole } from "@/types/models";

/** Redirige vers la connexion si aucun jeton n'est présent. */
export function RequireAuth() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} replace state={{ from: location }} />;
  }
  return <Outlet />;
}

/** Restreint l'accès à un ou plusieurs rôles ; sinon renvoie vers la page 403. */
export function RequireRole({ roles }: { roles: UserRole[] }) {
  const role = useAuthStore((s) => s.role);

  if (!role || !roles.includes(role)) {
    return <Navigate to={ROUTES.forbidden} replace />;
  }
  return <Outlet />;
}
