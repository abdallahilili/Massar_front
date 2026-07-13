import type { ApplicationStatus } from "@/types/models";

export interface StatusMeta {
  label: string;
  tone: "neutral" | "info" | "warning" | "success" | "danger";
  step: number;
}

/** Ordre et habillage des statuts du dossier — reflète le parcours en 8 étapes du document produit. */
export const APPLICATION_STATUS_META: Record<ApplicationStatus, StatusMeta> = {
  DRAFT: { label: "مسودة", tone: "neutral", step: 1 },
  SUBMITTED: { label: "تم الإرسال", tone: "info", step: 2 },
  UNDER_REVIEW: { label: "قيد المراجعة الإدارية", tone: "info", step: 3 },
  NEEDS_CORRECTION: { label: "بحاجة لتصحيح", tone: "warning", step: 3 },
  INSPECTION_SCHEDULED: { label: "بانتظار المعاينة", tone: "info", step: 4 },
  INSPECTION_DONE: { label: "تمت المعاينة", tone: "info", step: 5 },
  PAYMENT_PENDING: { label: "بانتظار رفع المخالصة", tone: "warning", step: 5 },
  PAYMENT_VERIFIED: { label: "تم تأكيد المخالصة", tone: "success", step: 6 },
  PROVISIONAL_LICENSE: { label: "ترخيص أولي/مؤقت", tone: "success", step: 6 },
  FOLLOWUP_INSPECTIONS: { label: "تفتيشات متكررة", tone: "info", step: 7 },
  FINAL_LICENSE: { label: "ترخيص نهائي صادر", tone: "success", step: 8 },
  REJECTED: { label: "مرفوض نهائياً", tone: "danger", step: 0 },
};

export const TOTAL_JOURNEY_STEPS = 8;

export const INVESTOR_TYPE_LABELS: Record<string, string> = {
  PERSON: "شخص طبيعي",
  LOCAL_COMPANY: "شركة موريتانية",
  FOREIGN_COMPANY: "شركة أجنبية",
};
