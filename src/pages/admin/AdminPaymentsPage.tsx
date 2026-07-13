import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Wallet, CheckCircle2 } from "lucide-react";
import { verifyPayment } from "@/api/operations";
import { Card, CardBody, CardHeader, ErrorBanner } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Field";
import { StatusBadge } from "@/components/common/StatusDisplay";
import { extractApiErrorMessage } from "@/api/axios";
import { toast } from "sonner";

/**
 * Le backend n'expose pas de liste des paiements en attente (aucune action
 * "list" n'est enregistrée sur PaymentViewSet) — seule l'action "verify"
 * par identifiant existe. Cet écran reflète fidèlement cette contrainte.
 */
export function AdminPaymentsPage() {
  const [paymentId, setPaymentId] = useState("");

  const mutation = useMutation({
    mutationFn: (id: number) => verifyPayment(id),
    onSuccess: () => toast.success("تم تأكيد المخالصة وإصدار الترخيص الأولي"),
  });

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 flex items-center gap-2">
        <Wallet className="h-5 w-5 text-primary-700" />
        <h1 className="text-xl font-bold text-neutral-900">التحقق من المخالصات</h1>
      </div>

      <Card>
        <CardHeader>
          <h2 className="font-semibold text-neutral-900">تأكيد مخالصة بالمعرّف</h2>
        </CardHeader>
        <CardBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (paymentId) mutation.mutate(Number(paymentId));
            }}
            className="flex items-end gap-2"
          >
            <div className="flex-1">
              <Label htmlFor="payment_id" required>معرّف المخالصة</Label>
              <Input
                id="payment_id"
                type="number"
                value={paymentId}
                onChange={(e) => setPaymentId(e.target.value)}
              />
            </div>
            <Button type="submit" isLoading={mutation.isPending}>
              <CheckCircle2 className="h-4 w-4" />
              تأكيد
            </Button>
          </form>

          {mutation.isError && (
            <div className="mt-4">
              <ErrorBanner message={extractApiErrorMessage(mutation.error, "تعذّر تأكيد المخالصة.")} />
            </div>
          )}

          {mutation.data && (
            <div className="mt-4 rounded-(--radius-md) border border-primary-200 bg-primary-50 p-4 text-sm">
              <p className="mb-1 font-medium text-primary-800">تم تحديث حالة الطلب:</p>
              <StatusBadge status={mutation.data.status} />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
