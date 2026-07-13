import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FileText, CheckCircle2, ArrowLeft } from "lucide-react";
import { fetchServiceType } from "@/api/core";
import { Card, CardBody, CardHeader, Spinner, ErrorBanner } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { extractApiErrorMessage } from "@/api/axios";

const JOURNEY_STAGES = [
  "التحقق من توفر اسم المشروع",
  "إنشاء الحساب وحجز الاسم (7 أيام)",
  "تحديد موقع المشروع على الخريطة",
  "رفع الوثائق المطلوبة وإرسال الطلب",
  "المراجعة الإدارية (قبول أو طلب تصحيح)",
  "المعاينة الميدانية لمقر المشروع",
  "دفع الرسوم ورفع المخالصة",
  "الترخيص الأولي ثم النهائي بعد التفتيشات الدورية",
];

export function ServiceDetailPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["service-type", serviceId],
    queryFn: () => fetchServiceType(serviceId!),
    enabled: Boolean(serviceId),
  });

  if (isLoading) return <Spinner label="جارٍ تحميل تفاصيل النشاط..." />;
  if (isError || !data) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <ErrorBanner message={extractApiErrorMessage(error, "تعذّر تحميل تفاصيل النشاط.")} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-sm text-neutral-500">قبل أي التزام — اعرف الطريق كاملاً</p>
      <h1 className="mt-1 text-2xl font-bold text-neutral-900">{data.name}</h1>
      <p className="mt-2 text-sm text-neutral-600">
        {data.requirements.length} وثيقة مطلوبة · {data.required_inspections_count} معاينة ناجحة
        لإصدار الترخيص النهائي · صلاحية الترخيص الأولي {data.provisional_validity_days} يوماً
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary-700" />
            <h2 className="font-semibold text-neutral-900">الوثائق المطلوبة</h2>
          </CardHeader>
          <CardBody>
            <ul className="space-y-2">
              {data.requirements.map((req) => (
                <li key={req.id} className="flex items-start gap-2 text-sm text-neutral-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
                  <span>
                    {req.name}
                    {!req.required && (
                      <span className="mr-1 text-xs text-neutral-400">(اختياري)</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-neutral-900">مراحل الرحلة الثماني</h2>
          </CardHeader>
          <CardBody>
            <ol className="space-y-2">
              {JOURNEY_STAGES.map((stage, i) => (
                <li key={stage} className="flex items-start gap-2 text-sm text-neutral-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-100 text-[11px] font-semibold text-accent-700">
                    {i + 1}
                  </span>
                  {stage}
                </li>
              ))}
            </ol>
          </CardBody>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          size="lg"
          onClick={() =>
            navigate(`${ROUTES.checkName}?service_type=${data.id}&service_name=${encodeURIComponent(data.name)}`)
          }
        >
          تحقق من اسم مشروعك
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
