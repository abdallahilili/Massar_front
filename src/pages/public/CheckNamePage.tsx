import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { z } from "zod";
import { Search, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { fetchServiceTypes } from "@/api/core";
import { checkNameAvailability } from "@/api/projects";
import { checkNameSchema } from "@/utils/schemas";
import { Card, CardBody, ErrorBanner } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { Input, Select, Label, FieldError } from "@/components/ui/Field";
import { ROUTES } from "@/constants/routes";
import { extractApiErrorMessage } from "@/api/axios";
import type { CheckNameResult } from "@/types/models";

export function CheckNamePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<CheckNameResult | null>(null);

  const { data: serviceTypes } = useQuery({
    queryKey: ["service-types"],
    queryFn: fetchServiceTypes,
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof checkNameSchema>, unknown, z.output<typeof checkNameSchema>>({
    resolver: zodResolver(checkNameSchema),
    defaultValues: {
      name: "",
      service_type: Number(searchParams.get("service_type")) || undefined,
    },
  });

  useEffect(() => {
    const st = searchParams.get("service_type");
    if (st) setValue("service_type", Number(st));
  }, [searchParams, setValue]);

  const mutation = useMutation({
    mutationFn: checkNameAvailability,
    onSuccess: (data) => setResult(data),
  });

  const currentName = watch("name");
  const currentServiceType = watch("service_type");

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900">تحقق من توفر اسم مشروعك</h1>
      <p className="mt-1 text-sm text-neutral-600">
        يمكن تكرار الاسم في نشاط مختلف — الاسم مرتبط بنوع النشاط المحدد.
      </p>

      <Card className="mt-6">
        <CardBody>
          <form
            onSubmit={handleSubmit((values) => {
              setResult(null);
              mutation.mutate(values);
            })}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="service_type" required>
                نوع النشاط
              </Label>
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
              <Label htmlFor="name" required>
                اسم المشروع المقترح
              </Label>
              <Input id="name" placeholder="مثال: رحلات الصحراء" {...register("name")} error={errors.name?.message} />
              <FieldError message={errors.name?.message} />
            </div>

            <Button type="submit" className="w-full" isLoading={mutation.isPending}>
              <Search className="h-4 w-4" />
              تحقق من الاسم
            </Button>

            {mutation.isError && (
              <ErrorBanner message={extractApiErrorMessage(mutation.error, "تعذّر التحقق من الاسم.")} />
            )}
          </form>

          {result && (
            <div
              className={`mt-5 flex items-center gap-3 rounded-(--radius-md) border p-4 ${
                result.available
                  ? "border-primary-200 bg-primary-50 text-primary-800"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {result.available ? (
                <CheckCircle2 className="h-5 w-5 shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {result.available
                    ? `الاسم متاح لـ ${result.service_type}`
                    : `الاسم مستخدَم بالفعل لـ ${result.service_type}`}
                </p>
              </div>
            </div>
          )}

          {result?.available && (
            <Button
              className="mt-4 w-full"
              variant="secondary"
              onClick={() =>
                navigate(
                  `${ROUTES.onboarding}?service_type=${currentServiceType}&project_name=${encodeURIComponent(
                    currentName
                  )}`
                )
              }
            >
              ابدأ بهذا الاسم
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
