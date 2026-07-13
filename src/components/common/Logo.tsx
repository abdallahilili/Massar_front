import { Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to={ROUTES.home} className="flex items-center gap-2.5">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius-md) bg-primary-700 text-gold-300">
        <Landmark className="h-5 w-5" />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-base font-bold text-primary-800">مسار</span>
          <span className="block text-[11px] text-neutral-500">
            وزارة التجارة والسياحة — موريتانيا
          </span>
        </span>
      )}
    </Link>
  );
}
