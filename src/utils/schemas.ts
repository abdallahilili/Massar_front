import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  password: z.string().min(1, "كلمة المرور مطلوبة"),
  role: z.enum(["INVESTOR", "INSPECTOR", "ADMIN"]),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

export const checkNameSchema = z.object({
  name: z.string().min(2, "يرجى إدخال اسم لا يقل عن حرفين"),
  service_type: z.coerce.number({ message: "يرجى اختيار نوع النشاط" }).int().positive(),
});
export type CheckNameFormValues = z.infer<typeof checkNameSchema>;

export const onboardingSchema = z.object({
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  phone: z.string().min(8, "رقم الهاتف غير صحيح"),
  password: z.string().min(8, "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل"),
  investor_type: z.enum(["PERSON", "LOCAL_COMPANY", "FOREIGN_COMPANY"]),
  full_name: z.string().min(2, "الاسم الكامل مطلوب"),
  nationality: z.string().min(2, "الجنسية مطلوبة"),
  national_id: z.string().min(2, "رقم الهوية مطلوب"),
  project_name: z.string().min(2, "اسم المشروع مطلوب"),
  service_type: z.coerce.number({ message: "يرجى اختيار نوع النشاط" }).int().positive(),
});
export type OnboardingFormValues = z.infer<typeof onboardingSchema>;

export const paymentUploadSchema = z.object({
  amount: z.coerce.number({ message: "المبلغ مطلوب" }).positive("يجب أن يكون المبلغ أكبر من صفر"),
  receipt: z
    .instanceof(FileList)
    .refine((files) => files.length === 1, "يرجى إرفاق صورة المخالصة"),
});
export type PaymentUploadFormValues = z.infer<typeof paymentUploadSchema>;

export const inspectionReportSchema = z.object({
  result: z.enum(["PASSED", "FAILED"]),
  notes: z.string().optional(),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  checklist_completed: z.boolean().refine((v) => v, "يجب إكمال قائمة التحقق قبل الإرسال"),
  photo: z.instanceof(FileList).optional(),
});
export type InspectionReportFormValues = z.infer<typeof inspectionReportSchema>;

export const linkProjectSchema = z.object({
  projectId: z.coerce.number({ message: "معرّف المشروع مطلوب" }).int().positive(),
  serviceType: z.coerce.number({ message: "يرجى اختيار نوع النشاط" }).int().positive(),
});
export type LinkProjectFormValues = z.infer<typeof linkProjectSchema>;
