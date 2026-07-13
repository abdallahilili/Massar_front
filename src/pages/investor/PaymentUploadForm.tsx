import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Wallet } from "lucide-react";
import { uploadPayment } from "@/api/operations";
import { paymentUploadSchema } from "@/utils/schemas";
import type { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input, Label, FieldError } from "@/components/ui/Field";
import { ErrorBanner } from "@/components/ui/Primitives";
import { extractApiErrorMessage } from "@/api/axios";
import { toast } from "sonner";

export function PaymentUploadForm({ projectId }: { projectId: number }) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof paymentUploadSchema>, unknown, z.output<typeof paymentUploadSchema>>({ resolver: zodResolver(paymentUploadSchema) });

  const mutation = useMutation({
    mutationFn: (values: z.output<typeof paymentUploadSchema>) =>
      uploadPayment({ project: projectId, amount: values.amount, receipt: values.receipt[0] }),
    onSuccess: () => {
      toast.success("تم إرسال المخالصة، بانتظار تأكيد الإدارة");
      queryClient.invalidateQueries({ queryKey: ["application-status", projectId] });
    },
  });

  return (
    <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4">
      <p className="text-sm text-neutral-600">
        تم إصدار أمر الدفع. بعد السداد لدى الإدارة العامة للضرائب، ارفع صورة المخالصة هنا.
      </p>
      <div>
        <Label htmlFor="amount" required>المبلغ المدفوع (أوقية جديدة)</Label>
        <Input id="amount" type="number" step="0.01" {...register("amount")} error={errors.amount?.message} />
        <FieldError message={errors.amount?.message} />
      </div>
      <div>
        <Label htmlFor="receipt" required>صورة المخالصة</Label>
        <input
          id="receipt"
          type="file"
          accept="image/*,application/pdf"
          className="block w-full text-sm text-neutral-600"
          {...register("receipt")}
        />
        <FieldError message={errors.receipt?.message} />
      </div>
      {mutation.isError && (
        <ErrorBanner message={extractApiErrorMessage(mutation.error, "تعذّر رفع المخالصة.")} />
      )}
      <Button type="submit" isLoading={mutation.isPending}>
        <Wallet className="h-4 w-4" />
        إرسال المخالصة
      </Button>
    </form>
  );
}
