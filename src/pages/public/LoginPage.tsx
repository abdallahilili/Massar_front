import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { LogIn } from "lucide-react";
import { login as loginRequest } from "@/api/auth";
import { loginSchema, type LoginFormValues } from "@/utils/schemas";
import { Card, CardBody, ErrorBanner } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { Input, Select, Label, FieldError } from "@/components/ui/Field";
import { extractApiErrorMessage } from "@/api/axios";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/constants/routes";
import type { UserRole } from "@/types/models";

const DASHBOARD_BY_ROLE: Record<UserRole, string> = {
  INVESTOR: ROUTES.investorDashboard,
  INSPECTOR: ROUTES.inspectorInspections,
  ADMIN: ROUTES.adminPayments,
};

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setSession = useAuthStore((s) => s.setSession);
  const storedProject = useAuthStore((s) => s.project);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { role: "INVESTOR" },
  });

  const mutation = useMutation({
    mutationFn: (values: LoginFormValues) =>
      loginRequest({ username: values.username, password: values.password }),
    onSuccess: (tokens, variables) => {
      setSession({ tokens, email: variables.username, role: variables.role });
      const from = (location.state as { from?: Location })?.from?.pathname;
      navigate(from || DASHBOARD_BY_ROLE[variables.role]);
    },
  });

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-neutral-900">تسجيل الدخول</h1>
      <p className="mt-1 text-sm text-neutral-600">
        استخدم البريد الإلكتروني وكلمة المرور اللذين أنشأتهما عند التسجيل.
      </p>

      <Card className="mt-6">
        <CardBody>
          <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
            <div>
              <Label htmlFor="username" required>البريد الإلكتروني</Label>
              <Input id="username" type="email" {...register("username")} error={errors.username?.message} />
              <FieldError message={errors.username?.message} />
            </div>
            <div>
              <Label htmlFor="password" required>كلمة المرور</Label>
              <Input id="password" type="password" {...register("password")} error={errors.password?.message} />
              <FieldError message={errors.password?.message} />
            </div>
            <div>
              <Label htmlFor="role" required>الدخول بصفة</Label>
              <Select id="role" {...register("role")}>
                <option value="INVESTOR">مستثمر</option>
                <option value="INSPECTOR">مفتش</option>
                <option value="ADMIN">إدارة</option>
              </Select>
              <p className="mt-1 text-xs text-neutral-400">
                يحدّد هذا الاختيار الواجهة المعروضة فقط؛ الصلاحيات الفعلية يتحقق منها الخادم عند كل طلب.
              </p>
            </div>

            {mutation.isError && (
              <ErrorBanner
                message={extractApiErrorMessage(mutation.error, "البريد الإلكتروني أو كلمة المرور غير صحيحة.")}
              />
            )}

            <Button type="submit" className="w-full" size="lg" isLoading={mutation.isPending}>
              <LogIn className="h-4 w-4" />
              دخول
            </Button>

            {storedProject && (
              <p className="text-center text-xs text-neutral-400">
                يوجد مشروع محفوظ على هذا الجهاز: {storedProject.projectName}
              </p>
            )}
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
