import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { fetchServiceTypes } from "@/api/core";
import { ServiceTypeCard } from "@/components/cards/Cards";
import { Spinner, ErrorBanner, EmptyState } from "@/components/ui/Primitives";
import { extractApiErrorMessage } from "@/api/axios";

export function HomePage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["service-types"],
    queryFn: fetchServiceTypes,
  });

  return (
    <div>
      <section className="border-b border-neutral-200 bg-gradient-to-b from-primary-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:py-20">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-neutral-900 sm:text-4xl"
          >
            ماذا تريد أن تنشئ؟
          </motion.h1>
          <p className="mx-auto mt-4 max-w-xl text-neutral-600">
            منصة مسار ترافقك خطوة بخطوة من فكرة مشروعك السياحي أو التجاري حتى الحصول على
            ترخيصك الرسمي — بدون تسجيل دخول مسبق وبدون استمارات معقّدة.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        {isLoading && <Spinner label="جارٍ تحميل أنواع الأنشطة..." />}
        {isError && <ErrorBanner message={extractApiErrorMessage(error, "تعذّر تحميل أنواع الأنشطة.")} />}
        {data && data.length === 0 && (
          <EmptyState title="لا توجد أنشطة متاحة حالياً" description="يرجى المحاولة لاحقاً." />
        )}
        {data && data.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((serviceType) => (
              <ServiceTypeCard key={serviceType.id} serviceType={serviceType} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
