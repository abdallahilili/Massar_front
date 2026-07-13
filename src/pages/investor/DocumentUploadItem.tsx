import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, UploadCloud, AlertCircle } from "lucide-react";
import { uploadDocument } from "@/api/workflow";
import { Button } from "@/components/ui/Button";
import { extractApiErrorMessage } from "@/api/axios";
import type { Requirement } from "@/types/models";
import { toast } from "sonner";

export function DocumentUploadItem({
  requirement,
  projectId,
}: {
  requirement: Requirement;
  projectId: number;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);

  const mutation = useMutation({
    mutationFn: () => uploadDocument({ project: projectId, requirement: requirement.id, file: file! }),
    onSuccess: () => {
      setUploaded(true);
      toast.success(`تم رفع «${requirement.name}»`);
    },
    onError: (error) => {
      toast.error(extractApiErrorMessage(error, "تعذّر رفع الوثيقة."));
    },
  });

  return (
    <div className="flex flex-col gap-2 rounded-(--radius-md) border border-neutral-200 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2">
        {uploaded ? (
          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary-600" />
        ) : (
          <AlertCircle className="h-4 w-4 shrink-0 text-neutral-300" />
        )}
        <span className="text-sm text-neutral-800">
          {requirement.name}
          {!requirement.required && <span className="mr-1 text-xs text-neutral-400">(اختياري)</span>}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <label className="cursor-pointer rounded-(--radius-md) border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50">
          {file ? file.name.slice(0, 20) : "اختر ملفاً"}
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              setFile(e.target.files?.[0] ?? null);
              setUploaded(false);
            }}
          />
        </label>
        <Button
          size="sm"
          variant={uploaded ? "success" : "outline"}
          disabled={!file}
          isLoading={mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          <UploadCloud className="h-4 w-4" />
          {uploaded ? "تم الرفع" : "رفع"}
        </Button>
      </div>
    </div>
  );
}
