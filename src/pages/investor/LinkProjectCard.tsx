import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { LinkIcon } from "lucide-react";
import { fetchServiceTypes } from "@/api/core";
import { linkProjectSchema } from "@/utils/schemas";
import type { z } from "zod";
import { Card, CardBody, CardHeader } from "@/components/ui/Primitives";
import { Button } from "@/components/ui/Button";
import { Input, Select, Label, FieldError } from "@/components/ui/Field";
import { useAuthStore } from "@/stores/authStore";

/**
 * Le backend n'expose aucun endpoint « mes projets » — l'API ne permet
 * de consulter un dossier que via son identifiant (GET /workflow/projects/{id}/status/).
 * Cette carte relie donc, une fois, l'appareil courant au projet créé lors de l'inscription.
 */
export function LinkProjectCard() {
  const setProjectContext = useAuthStore((s) => s.setProjectContext);
  const { data: serviceTypes } = useQuery({ queryKey: ["service-types"], queryFn: fetchServiceTypes });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof linkProjectSchema>, unknown, z.output<typeof linkProjectSchema>>({ resolver: zodResolver(linkProjectSchema) });

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <h2 className="font-semibold text-neutral-900">ربط مشروعك بهذا الجهاز</h2>
      </CardHeader>
      <CardBody>
        <p className="mb-4 text-sm text-neutral-600">
          لم يُعثر على مشروع محفوظ على هذا الجهاز. أدخل معرّف المشروع ونوع النشاط الذي استلمته عند التسجيل.
        </p>
        <form
          onSubmit={handleSubmit((values) => {
            const serviceTypeName = serviceTypes?.find((st) => st.id === values.serviceType)?.name ?? "";
            setProjectContext({
              projectId: values.projectId,
              projectName: `مشروع #${values.projectId}`,
              serviceTypeId: values.serviceType,
              serviceTypeName,
            });
          })}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="projectId" required>معرّف المشروع</Label>
            <Input id="projectId" type="number" {...register("projectId")} error={errors.projectId?.message} />
            <FieldError message={errors.projectId?.message} />
          </div>
          <div>
            <Label htmlFor="serviceType" required>نوع النشاط</Label>
            <Select id="serviceType" {...register("serviceType")} error={errors.serviceType?.message}>
              <option value="">اختر نوع النشاط</option>
              {serviceTypes?.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.name}
                </option>
              ))}
            </Select>
            <FieldError message={errors.serviceType?.message} />
          </div>
          <Button type="submit" className="w-full">
            <LinkIcon className="h-4 w-4" />
            ربط المشروع
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
