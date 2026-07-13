import { Link } from "react-router-dom";
import { ArrowLeft, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import type { ServiceType } from "@/types/models";
import { ROUTES } from "@/constants/routes";
import { Card } from "@/components/ui/Primitives";

export function ServiceTypeCard({ serviceType }: { serviceType: ServiceType }) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
      <Link to={ROUTES.serviceDetail(serviceType.id)}>
        <Card className="group h-full p-5 transition-shadow hover:shadow-md">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-(--radius-md) bg-primary-50 text-primary-700">
            <Building2 className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900">{serviceType.name}</h3>
          <p className="mt-1.5 text-xs text-neutral-500">
            {serviceType.requirements.length} وثيقة مطلوبة · {serviceType.required_inspections_count}{" "}
            معاينة قبل الترخيص النهائي
          </p>
          <span className="mt-4 flex items-center gap-1 text-sm font-medium text-primary-700 group-hover:gap-2 transition-all">
            ابدأ الإجراء
            <ArrowLeft className="h-4 w-4" />
          </span>
        </Card>
      </Link>
    </motion.div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="flex items-center gap-4 p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-(--radius-md) bg-accent-50 text-accent-600">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-xs text-neutral-500">{label}</p>
        <p className="text-lg font-semibold text-neutral-900">{value}</p>
      </div>
    </Card>
  );
}

