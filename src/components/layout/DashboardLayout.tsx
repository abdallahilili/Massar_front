import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FileCheck2,
  LogOut,
  ClipboardList,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/utils/cn";

const NAV_BY_ROLE: Record<string, { to: string; label: string; icon: React.ElementType }[]> = {
  INVESTOR: [
    { to: ROUTES.investorDashboard, label: "ملف مشروعي", icon: FileCheck2 },
    { to: ROUTES.verifyLicense, label: "التحقق من ترخيص", icon: ShieldCheck },
  ],
  INSPECTOR: [
    { to: ROUTES.inspectorInspections, label: "مهام المعاينة", icon: ClipboardList },
  ],
  ADMIN: [
    { to: ROUTES.adminPayments, label: "التحقق من المخالصات", icon: Wallet },
  ],
};

const ROLE_LABEL: Record<string, string> = {
  INVESTOR: "مستثمر",
  INSPECTOR: "مفتش",
  ADMIN: "إدارة",
};

export function DashboardLayout() {
  const navigate = useNavigate();
  const { role, email, logout } = useAuthStore();
  const items = (role && NAV_BY_ROLE[role]) || [];

  return (
    <div className="flex min-h-dvh bg-neutral-50">
      <aside className="hidden w-64 shrink-0 border-l border-neutral-200 bg-white md:flex md:flex-col">
        <div className="border-b border-neutral-100 px-4 py-4">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2.5 rounded-(--radius-md) px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary-50 text-primary-800"
                    : "text-neutral-600 hover:bg-neutral-100"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-neutral-100 p-4">
          <p className="truncate text-xs text-neutral-400">{email}</p>
          <p className="text-xs font-medium text-primary-700">{role && ROLE_LABEL[role]}</p>
          <button
            onClick={() => {
              logout();
              navigate(ROUTES.home);
            }}
            className="mt-3 flex w-full items-center gap-2 rounded-(--radius-md) px-3 py-2 text-sm text-neutral-500 hover:bg-neutral-100"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-neutral-200 bg-white px-4 md:hidden">
          <Logo compact />
          <button
            onClick={() => {
              logout();
              navigate(ROUTES.home);
            }}
            className="text-sm text-neutral-500"
          >
            خروج
          </button>
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
