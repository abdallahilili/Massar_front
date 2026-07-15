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
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 px-3 sm:h-16 sm:px-4">
          <Logo />
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              to={ROUTES.verifyLicense}
              title="التحقق من ترخيص"
              className="flex items-center gap-1.5 rounded-(--radius-md) p-2 text-sm text-neutral-600 hover:bg-neutral-100 sm:px-3 sm:py-2"
            >
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span className="hidden sm:inline">التحقق من ترخيص</span>
            </Link>
            {authed ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  title="لوحتي"
                  className="px-2 sm:px-3"
                  onClick={() => navigate(role ? dashboardByRole[role] : ROUTES.home)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">لوحتي</span>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  title="خروج"
                  className="px-2 sm:px-3"
                  onClick={() => {
                    logout();
                    navigate(ROUTES.home);
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">خروج</span>
                </Button>
              </>
            ) : (
              <Button size="sm" variant="primary" className="px-3" onClick={() => navigate(ROUTES.login)}>
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
