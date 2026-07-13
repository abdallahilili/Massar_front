import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { MapPin, Send } from "lucide-react";
import { submitInspectionReport } from "@/api/operations";
import { inspectionReportSchema } from "@/utils/schemas";
import type { z } from "zod";
import { Card, CardBody, CardHeader, ErrorBanner } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea, Label, FieldError } from "@/components/ui/Field";
import { extractApiErrorMessage } from "@/api/axios";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";

export function InspectionReportPage() {
  const { inspectionId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.input<typeof inspectionReportSchema>, unknown, z.output<typeof inspectionReportSchema>>({
    resolver: zodResolver(inspectionReportSchema),
    defaultValues: { result: "PASSED", checklist_completed: false },
  });

  const mutation = useMutation({
    mutationFn: (values: z.output<typeof inspectionReportSchema>) =>
      submitInspectionReport(Number(inspectionId), {
        result: values.result,
        notes: values.notes,
        latitude: values.latitude,
        longitude: values.longitude,
        checklist_completed: values.checklist_completed,
        photo: values.photo?.[0] ?? null,
      }),
    onSuccess: () => {
      toast.success("تم إرسال تقرير المعاينة");
      navigate(ROUTES.inspectorInspections);
    },
  });

  function useCurrentLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setValue("latitude", pos.coords.latitude);
      setValue("longitude", pos.coords.longitude);
      toast.success("تم تسجيل الموقع الحالي");
    });
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-xl font-bold text-neutral-900">تقرير المعاينة الميدانية</h1>
      <p className="mt-1 text-sm text-neutral-600">مهمة رقم #{inspectionId}</p>

      <Card className="mt-6">
        <CardHeader>
          <h2 className="font-semibold text-neutral-900">نتيجة المعاينة</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
            <div>
              <Label htmlFor="result" required>النتيجة</Label>
              <Select id="result" {...register("result")}>
                <option value="PASSED">مطابقة</option>
                <option value="FAILED">غير مطابقة</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea id="notes" {...register("notes")} placeholder="أضف أي ملاحظات ميدانية..." />
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" size="sm" variant="outline" onClick={useCurrentLocation}>
                <MapPin className="h-4 w-4" />
                تسجيل الموقع الحالي
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="latitude" required>خط العرض</Label>
                <Input id="latitude" type="number" step="any" {...register("latitude")} error={errors.latitude?.message} />
                <FieldError message={errors.latitude?.message} />
              </div>
              <div>
                <Label htmlFor="longitude" required>خط الطول</Label>
                <Input id="longitude" type="number" step="any" {...register("longitude")} error={errors.longitude?.message} />
                <FieldError message={errors.longitude?.message} />
              </div>
            </div>

            <div>
              <Label htmlFor="photo">صورة المعاينة</Label>
              <input id="photo" type="file" accept="image/*" className="block w-full text-sm text-neutral-600" {...register("photo")} />
            </div>

            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input type="checkbox" {...register("checklist_completed")} className="h-4 w-4 rounded border-neutral-300" />
              أؤكد إكمال قائمة التحقق الخاصة بالمعاينة
            </label>
            <FieldError message={errors.checklist_completed?.message} />

            {mutation.isError && (
              <ErrorBanner message={extractApiErrorMessage(mutation.error, "تعذّر إرسال التقرير.")} />
            )}

            <Button type="submit" className="w-full" isLoading={mutation.isPending}>
              <Send className="h-4 w-4" />
              إرسال التقرير
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
