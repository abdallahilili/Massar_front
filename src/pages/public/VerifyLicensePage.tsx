import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ShieldCheck, ShieldX, Search } from "lucide-react";
import { verifyLicensePublic } from "@/api/operations";
import { Card, CardBody, ErrorBanner } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { extractApiErrorMessage } from "@/api/axios";
import { format } from "date-fns";

export function VerifyLicensePage() {
  const [licenseNumber, setLicenseNumber] = useState("");

  const mutation = useMutation({
    mutationFn: verifyLicensePublic,
  });

  return (
    <div className="mx-auto max-w-lg px-4 py-14">
      <div className="text-center">
        <ShieldCheck className="mx-auto h-10 w-10 text-primary-600" />
        <h1 className="mt-3 text-2xl font-bold text-neutral-900">التحقق من صحة الترخيص</h1>
        <p className="mt-1 text-sm text-neutral-600">
          أدخل رقم الترخيص للتأكد من سريانه — متاح للجميع بلا تسجيل دخول.
        </p>
      </div>

      <Card className="mt-6">
        <CardBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (licenseNumber.trim()) mutation.mutate(licenseNumber.trim());
            }}
            className="flex gap-2"
          >
            <div className="flex-1">
              <Label htmlFor="license_number">رقم الترخيص</Label>
              <Input
                id="license_number"
                placeholder="MSR-2026-1-A1B2C3"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
              />
            </div>
            <Button type="submit" className="mt-6 self-start" isLoading={mutation.isPending}>
              <Search className="h-4 w-4" />
              تحقق
            </Button>
          </form>

          {mutation.isError && (
            <div className="mt-4">
              <ErrorBanner message={extractApiErrorMessage(mutation.error, "تعذّر التحقق من الترخيص.")} />
            </div>
          )}

          {mutation.data && (
            <div
              className={`mt-5 rounded-(--radius-md) border p-4 ${
                mutation.data.valid
                  ? "border-primary-200 bg-primary-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              {mutation.data.valid ? (
                <div className="space-y-1.5 text-sm">
                  <p className="flex items-center gap-2 font-semibold text-primary-800">
                    <ShieldCheck className="h-4 w-4" /> ترخيص ساري المفعول
                  </p>
                  <p><span className="text-neutral-500">المشروع:</span> {mutation.data.project_name}</p>
                  <p><span className="text-neutral-500">النشاط:</span> {mutation.data.service_type}</p>
                  <p><span className="text-neutral-500">النوع:</span> {mutation.data.type}</p>
                  <p><span className="text-neutral-500">رقم الترخيص:</span> {mutation.data.license_number}</p>
                  {mutation.data.issued_at && (
                    <p><span className="text-neutral-500">تاريخ الإصدار:</span> {format(new Date(mutation.data.issued_at), "dd/MM/yyyy")}</p>
                  )}
                  {mutation.data.expires_at && (
                    <p><span className="text-neutral-500">تاريخ الانتهاء:</span> {format(new Date(mutation.data.expires_at), "dd/MM/yyyy")}</p>
                  )}
                </div>
              ) : (
                <p className="flex items-center gap-2 text-sm font-medium text-red-700">
                  <ShieldX className="h-4 w-4" /> {mutation.data.detail ?? "رقم الترخيص غير موجود."}
                </p>
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
