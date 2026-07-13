import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ShieldAlert, LockKeyhole, SearchX, ServerCrash } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

function ErrorPageLayout({
  icon: Icon,
  code,
  title,
  description,
}: {
  icon: LucideIcon;
  code: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3 px-4 text-center">
      <Icon className="h-12 w-12 text-primary-600" />
      <p className="text-sm font-semibold text-gold-600">{code}</p>
      <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
      <p className="max-w-sm text-sm text-neutral-500">{description}</p>
      <Link to={ROUTES.home} className="mt-4">
        <Button>العودة إلى الصفحة الرئيسية</Button>
      </Link>
    </div>
  );
}

export function UnauthorizedPage() {
  return (
    <ErrorPageLayout
      icon={LockKeyhole}
      code="401"
      title="يلزم تسجيل الدخول"
      description="انتهت جلستك أو لم تسجّل الدخول بعد. يرجى تسجيل الدخول للمتابعة."
    />
  );
}

export function ForbiddenPage() {
  return (
    <ErrorPageLayout
      icon={ShieldAlert}
      code="403"
      title="غير مصرّح لك بالوصول"
      description="لا تملك الصلاحيات اللازمة لعرض هذه الصفحة."
    />
  );
}

export function NotFoundPage() {
  return (
    <ErrorPageLayout
      icon={SearchX}
      code="404"
      title="الصفحة غير موجودة"
      description="الرابط الذي حاولت الوصول إليه غير موجود أو تم نقله."
    />
  );
}

export function ServerErrorPage() {
  return (
    <ErrorPageLayout
      icon={ServerCrash}
      code="500"
      title="خطأ في الخادم"
      description="حدث خطأ غير متوقع من جانب الخادم. يرجى المحاولة لاحقاً."
    />
  );
}
