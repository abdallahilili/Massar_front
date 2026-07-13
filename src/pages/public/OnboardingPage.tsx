import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { UserRound, Building2, Globe2 } from "lucide-react";
import { fetchServiceTypes } from "@/api/core";
import { submitOnboarding } from "@/api/projects";
import { login as loginRequest } from "@/api/auth";
import { onboardingSchema, type OnboardingFormValues } from "@/utils/schemas";
import type { z } from "zod";
import { Card, CardBody, CardHeader, ErrorBanner } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { Input, Select, Label, FieldError } from "@/components/ui/Field";
import { INVESTOR_TYPE_LABELS } from "@/constants/statusMeta";
import { ROUTES } from "@/constants/routes";
import { extractApiErrorMessage } from "@/api/axios";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

const INVESTOR_TYPE_ICONS = {
  PERSON: UserRound,
  LOCAL_COMPANY: Building2,
  FOREIGN_COMPANY: Globe2,
} as const;

export function OnboardingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const setProjectContext = useAuthStore((s) => s.setProjectContext);

  const { data: serviceTypes } = useQuery({
    queryKey: ["service-types"],
    queryFn: fetchServiceTypes,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<z.input<typeof onboardingSchema>, unknown, z.output<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      investor_type: "PERSON",
      project_name: searchParams.get("project_name") ?? "",
      service_type: Number(searchParams.get("service_type")) || undefined,
    },
  });

  const investorType = watch("investor_type");

  const mutation = useMutation({
    mutationFn: async (values: OnboardingFormValues) => {
      const project = await submitOnboarding(values);
      const tokens = await loginRequest({ username: values.email, password: values.password });
      return { project, tokens, values };
    },
    onSuccess: ({ project, tokens, values }) => {
      const serviceTypeName =
        serviceTypes?.find((st) => st.id === values.service_type)?.name ?? "";
      setSession({ tokens, email: values.email, role: "INVESTOR" });
      setProjectContext({
        projectId: project.id,
        projectName: project.name,
        serviceTypeId: values.service_type,
        serviceTypeName,
      });
      toast.success("تم إنشاء حسابك وحجز اسم مشروعك بنجاح");
      navigate(ROUTES.investorDashboard);
    },
  });

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900">إنشاء الحساب وحجز الاسم</h1>
      <p className="mt-1 text-sm text-neutral-600">
        شاشة واحدة تجمع كل شيء: بيانات الحساب، بيانات المستثمر، ومشروعك — يُحجز اسمك لمدة 7 أيام.
      </p>

      <form
        onSubmit={handleSubmit((values) => mutation.mutate(values))}
        className="mt-6 space-y-6"
      >
        <Card>
          <CardHeader>
            <h2 className="font-semibold text-neutral-900">بيانات الحساب</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <Label htmlFor="email" required>البريد الإلكتروني</Label>
              <Input id="email" type="email" {...register("email")} error={errors.email?.message} />
              <FieldError message={errors.email?.message} />
            </div>
            <div>
              <Label htmlFor="phone" required>الهاتف</Label>
              <Input id="phone" {...register("phone")} error={errors.phone?.message} />
              <FieldError message={errors.phone?.message} />
            </div>
            <div>
              <Label htmlFor="password" required>كلمة المرور</Label>
              <Input id="password" type="password" {...register("password")} error={errors.password?.message} />
              <FieldError message={errors.password?.message} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-neutral-900">نوع المستثمر</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(INVESTOR_TYPE_LABELS) as Array<keyof typeof INVESTOR_TYPE_ICONS>).map((type) => {
                const Icon = INVESTOR_TYPE_ICONS[type];
                const isActive = investorType === type;
                return (
                  <label
                    key={type}
                    className={`flex cursor-pointer flex-col items-center gap-2 rounded-(--radius-md) border p-3 text-center text-xs transition-colors ${
                      isActive
                        ? "border-primary-500 bg-primary-50 text-primary-800"
                        : "border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    <input type="radio" value={type} className="hidden" {...register("investor_type")} />
                    <Icon className="h-5 w-5" />
                    {INVESTOR_TYPE_LABELS[type]}
                  </label>
                );
              })}
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="full_name" required>الاسم الكامل</Label>
                <Input id="full_name" {...register("full_name")} error={errors.full_name?.message} />
                <FieldError message={errors.full_name?.message} />
              </div>
              <div>
                <Label htmlFor="nationality" required>الجنسية</Label>
                <Input id="nationality" {...register("nationality")} error={errors.nationality?.message} />
                <FieldError message={errors.nationality?.message} />
              </div>
              <div>
                <Label htmlFor="national_id" required>رقم الهوية</Label>
                <Input id="national_id" {...register("national_id")} error={errors.national_id?.message} />
                <FieldError message={errors.national_id?.message} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-neutral-900">مشروعك</h2>
          </CardHeader>
          <CardBody className="space-y-4">
            <div>
              <Label htmlFor="service_type" required>نوع النشاط</Label>
              <Select id="service_type" {...register("service_type")} error={errors.service_type?.message}>
                <option value="">اختر نوع النشاط</option>
                {serviceTypes?.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </Select>
              <FieldError message={errors.service_type?.message} />
            </div>
            <div>
              <Label htmlFor="project_name" required>اسم المشروع</Label>
              <Input id="project_name" {...register("project_name")} error={errors.project_name?.message} />
              <FieldError message={errors.project_name?.message} />
            </div>
          </CardBody>
        </Card>

        {mutation.isError && (
          <ErrorBanner
            message={extractApiErrorMessage(
              mutation.error,
              "تعذّر إنشاء الحساب. تأكد من أن الاسم ما يزال متاحاً."
            )}
          />
        )}

        <Button type="submit" size="lg" className="w-full" isLoading={mutation.isPending}>
          إنشاء الحساب وحجز الاسم
        </Button>
      </form>
    </div>
  );
}
