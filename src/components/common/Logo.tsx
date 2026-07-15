import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to={ROUTES.home} className="flex shrink-0 items-center gap-2">
      <img src="/image.png" alt="مسار" className="h-8 w-8 object-contain sm:h-10 sm:w-10" />

      {!compact && (
        <span className="leading-tight">
          <span className="block text-sm font-bold text-primary-800 sm:text-base">مسار</span>
          <span className="hidden text-[11px] text-neutral-500 sm:block">
            وزارة التجارة والسياحة — موريتانيا
          </span>
        </span>
      )}
    </Link>
  );
}
