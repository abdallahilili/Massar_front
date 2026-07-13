import { Link, Outlet, useNavigate } from "react-router-dom";
import { ShieldCheck, LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { useAuthStore } from "@/stores/authStore";

const dashboardByRole: Record<string, string> = {
  INVESTOR: ROUTES.investorDashboard,
  INSPECTOR: ROUTES.inspectorInspections,
  ADMIN: ROUTES.adminPayments,
};

export function PublicLayout() {
  const navigate = useNavigate();
  const { role, isAuthenticated, logout } = useAuthStore();
  const authed = isAuthenticated();

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Logo />
          <nav className="flex items-center gap-2">
            <Link
              to={ROUTES.verifyLicense}
              className="hidden items-center gap-1.5 rounded-(--radius-md) px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100 sm:flex"
            >
              <ShieldCheck className="h-4 w-4" />
              التحقق من ترخيص
            </Link>
            {authed ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate(role ? dashboardByRole[role] : ROUTES.home)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  لوحتي
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    logout();
                    navigate(ROUTES.home);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  خروج
                </Button>
              </>
            ) : (
              <Button size="sm" variant="primary" onClick={() => navigate(ROUTES.login)}>
                <LogIn className="h-4 w-4" />
                تسجيل الدخول
              </Button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-neutral-200 bg-neutral-900 py-8 text-neutral-300">
        <div className="mx-auto max-w-6xl px-4 text-sm">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row">
            <div>
              <p className="font-semibold text-white">منصة مسار</p>
              <p className="mt-1 text-neutral-400">
                وزارة التجارة والسياحة — الجمهورية الإسلامية الموريتانية
              </p>
            </div>
            <a
              href="https://www.commerce.gov.mr/"
              target="_blank"
              rel="noreferrer"
              className="text-gold-400 hover:underline"
            >
              commerce.gov.mr
            </a>
          </div>
          <p className="mt-6 border-t border-neutral-800 pt-4 text-xs text-neutral-500">
            © {new Date().getFullYear()} الجمهورية الإسلامية الموريتانية. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
}
