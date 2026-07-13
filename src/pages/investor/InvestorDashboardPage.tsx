import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, MapPin, Calendar, ListChecks, Award, RefreshCw } from "lucide-react";
import { fetchApplicationStatus, submitApplication } from "@/api/workflow";
import { fetchServiceType } from "@/api/core";
import { fetchProjectLicenses } from "@/api/operations";
import { useAuthStore } from "@/stores/authStore";
import { LinkProjectCard } from "@/pages/investor/LinkProjectCard";
import { DocumentUploadItem } from "@/pages/investor/DocumentUploadItem";
import { PaymentUploadForm } from "@/pages/investor/PaymentUploadForm";
import { Card, CardBody, CardHeader, Spinner, ErrorBanner, ProgressBar, EmptyState } from "@/components/ui/Primitives";
import { StatusBadge, StatusTimeline } from "@/components/common/StatusDisplay";
import { StatCard } from "@/components/cards/Cards";
import { Button } from "@/components/ui/Button";
import { extractApiErrorMessage } from "@/api/axios";
import { format } from "date-fns";
import { toast } from "sonner";

export function InvestorDashboardPage() {
  const project = useAuthStore((s) => s.project);
  const setProjectContext = useAuthStore((s) => s.setProjectContext);
  const queryClient = useQueryClient();

  const statusQuery = useQuery({
    queryKey: ["application-status", project?.projectId],
    queryFn: () => fetchApplicationStatus(project!.projectId),
    enabled: Boolean(project),
    retry: false,
  });

  const serviceTypeQuery = useQuery({
    queryKey: ["service-type", project?.serviceTypeId],
    queryFn: () => fetchServiceType(project!.serviceTypeId),
    enabled: Boolean(project),
  });

  const licensesQuery = useQuery({
    queryKey: ["project-licenses", project?.projectId],
    queryFn: () => fetchProjectLicenses(project!.projectId),
    enabled: Boolean(project),
  });

  const submitMutation = useMutation({
    mutationFn: () => submitApplication(project!.projectId),
    onSuccess: () => {
      toast.success("تم إرسال طلبك للمراجعة الإدارية");
      queryClient.invalidateQueries({ queryKey: ["application-status", project?.projectId] });
    },
    onError: (error) => toast.error(extractApiErrorMessage(error, "تعذّر إرسال الطلب.")),
  });

  if (!project) return <LinkProjectCard />;

  const status = statusQuery.data;

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-neutral-500">{project.serviceTypeName}</p>
          <h1 className="text-xl font-bold text-neutral-900">{project.projectName}</h1>
        </div>
        <div className="flex items-center gap-2">
          {status && <StatusBadge status={status.status} />}
          <Button size="sm" variant="ghost" onClick={() => statusQuery.refetch()}>
            <RefreshCw className="h-4 w-4" />
            تحديث
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setProjectContext(null);
              toast.info("يمكنك ربط مشروع آخر بهذا الجهاز");
            }}
          >
            تغيير المشروع
          </Button>
        </div>
      </div>

      {statusQuery.isLoading && <Spinner label="جارٍ تحميل حالة الملف..." />}
      {statusQuery.isError && (
        <ErrorBanner
          message={extractApiErrorMessage(
            statusQuery.error,
            "تعذّر تحميل حالة الملف. تأكد أن معرّف المشروع صحيح وأنك مالكه."
          )}
        />
      )}

      {status && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard icon={ListChecks} label="نسبة اكتمال الوثائق" value={`${status.progress_percentage}٪`} />
            <StatCard
              icon={Calendar}
              label="عدد المعاينات الناجحة"
              value={`${status.completed_inspections_count} / ${status.required_inspections_count}`}
            />
            <StatCard
              icon={Send}
              label="تاريخ الإرسال"
              value={status.submitted_at ? format(new Date(status.submitted_at), "dd/MM/yyyy") : "لم يُرسل بعد"}
            />
          </div>

          <Card>
            <CardHeader>
              <h2 className="font-semibold text-neutral-900">تقدّم الملف</h2>
            </CardHeader>
            <CardBody>
              <ProgressBar value={status.progress_percentage} />
              {status.rejection_reason && (
                <div className="mt-3">
                  <ErrorBanner message={`ملاحظة: ${status.rejection_reason}`} />
                </div>
              )}
            </CardBody>
          </Card>

          {status.status === "DRAFT" && serviceTypeQuery.data && (
            <Card>
              <CardHeader className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-700" />
                <h2 className="font-semibold text-neutral-900">الوثائق المطلوبة</h2>
              </CardHeader>
              <CardBody className="space-y-2">
                {serviceTypeQuery.data.requirements.map((req) => (
                  <DocumentUploadItem key={req.id} requirement={req} projectId={project.projectId} />
                ))}
                <Button className="mt-4 w-full" isLoading={submitMutation.isPending} onClick={() => submitMutation.mutate()}>
                  <Send className="h-4 w-4" />
                  إرسال الطلب
                </Button>
              </CardBody>
            </Card>
          )}

          {status.status === "PAYMENT_PENDING" && (
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-neutral-900">رفع مخالصة الدفع</h2>
              </CardHeader>
              <CardBody>
                <PaymentUploadForm projectId={project.projectId} />
              </CardBody>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-neutral-900">الخط الزمني</h2>
              </CardHeader>
              <CardBody>
                <StatusTimeline history={status.history} />
              </CardBody>
            </Card>

            <Card>
              <CardHeader className="flex items-center gap-2">
                <Award className="h-4 w-4 text-gold-600" />
                <h2 className="font-semibold text-neutral-900">تراخيصك</h2>
              </CardHeader>
              <CardBody>
                {licensesQuery.isLoading && <Spinner />}
                {licensesQuery.data && licensesQuery.data.length === 0 && (
                  <EmptyState title="لا يوجد ترخيص صادر بعد" />
                )}
                {licensesQuery.data && licensesQuery.data.length > 0 && (
                  <ul className="space-y-3">
                    {licensesQuery.data.map((lic) => (
                      <li key={lic.id} className="rounded-(--radius-md) border border-neutral-200 p-3 text-sm">
                        <p className="font-medium text-neutral-900">{lic.type_display}</p>
                        <p className="text-neutral-500">{lic.license_number}</p>
                        <p className="text-xs text-neutral-400">
                          صادر: {format(new Date(lic.issued_at), "dd/MM/yyyy")} — ينتهي:{" "}
                          {format(new Date(lic.expires_at), "dd/MM/yyyy")}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
