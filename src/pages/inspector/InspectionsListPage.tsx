import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ClipboardList, ArrowLeft } from "lucide-react";
import { fetchMyInspections } from "@/api/operations";
import { Card, CardBody, CardHeader, Spinner, ErrorBanner, EmptyState } from "@/components/ui/Primitives";
import { Badge } from "@/components/ui/Primitives";
import { ROUTES } from "@/constants/routes";
import { extractApiErrorMessage } from "@/api/axios";
import { format } from "date-fns";

const STATUS_TONE: Record<string, "neutral" | "success" | "info"> = {
  PENDING: "info",
  DONE: "success",
};

export function InspectionsListPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-inspections"],
    queryFn: fetchMyInspections,
  });

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6 flex items-center gap-2">
        <ClipboardList className="h-5 w-5 text-primary-700" />
        <h1 className="text-xl font-bold text-neutral-900">مهام المعاينة الميدانية</h1>
      </div>

      {isLoading && <Spinner label="جارٍ تحميل مهامك..." />}
      {isError && <ErrorBanner message={extractApiErrorMessage(error, "تعذّر تحميل المهام.")} />}
      {data && data.length === 0 && (
        <EmptyState title="لا توجد مهام معاينة مسندة إليك حالياً" icon={<ClipboardList className="h-8 w-8" />} />
      )}

      <div className="space-y-3">
        {data?.map((inspection) => (
          <Card key={inspection.id}>
            <CardHeader className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-900">مشروع #{inspection.project}</p>
                <p className="text-xs text-neutral-400">
                  {format(new Date(inspection.created_at), "dd/MM/yyyy — HH:mm")}
                </p>
              </div>
              <Badge tone={STATUS_TONE[inspection.status] ?? "neutral"}>{inspection.status}</Badge>
            </CardHeader>
            <CardBody className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">
                {inspection.result ? `النتيجة: ${inspection.result}` : "بانتظار المعاينة"}
              </p>
              {inspection.status !== "DONE" && (
                <Link
                  to={ROUTES.inspectorReport(inspection.id)}
                  className="flex items-center gap-1 text-sm font-medium text-primary-700 hover:underline"
                >
                  إرسال التقرير
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
