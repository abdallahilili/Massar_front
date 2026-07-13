import { CheckCircle2, Circle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/Primitives";
import { APPLICATION_STATUS_META } from "@/constants/statusMeta";
import type { ApplicationStatus, StatusHistoryEntry } from "@/types/models";
import { format } from "date-fns";

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const meta = APPLICATION_STATUS_META[status];
  return <Badge tone={meta.tone}>{meta.label}</Badge>;
}

export function StatusTimeline({ history }: { history: StatusHistoryEntry[] }) {
  if (history.length === 0) {
    return <p className="text-sm text-neutral-500">لا يوجد سجل تتبّع بعد.</p>;
  }

  return (
    <ol className="relative border-e-2 border-neutral-200 pe-4">
      {history.map((entry, index) => {
        const isRejected = entry.to_status === "REJECTED";
        const isLast = index === history.length - 1;
        const Icon = isRejected ? XCircle : isLast ? CheckCircle2 : Circle;

        return (
          <li key={`${entry.created_at}-${index}`} className="mb-6 last:mb-0">
            <span
              className={`absolute -end-[9px] flex h-4 w-4 items-center justify-center rounded-full ${
                isRejected
                  ? "bg-red-500"
                  : isLast
                  ? "bg-primary-600"
                  : "bg-neutral-300"
              }`}
            >
              <Icon className="h-3 w-3 text-white" />
            </span>
            <div className="ms-1">
              <p className="text-sm font-medium text-neutral-800">{entry.to_status_display}</p>
              {entry.note && <p className="text-xs text-neutral-500">{entry.note}</p>}
              <p className="text-xs text-neutral-400">
                {format(new Date(entry.created_at), "dd/MM/yyyy — HH:mm")}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
