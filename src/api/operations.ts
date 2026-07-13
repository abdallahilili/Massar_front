import { apiClient } from "@/api/axios";
import type {
  ApplicationStatusResponse,
  InspectionRecord,
  InspectionReportPayload,
  LicenseRecord,
  PaginatedResponse,
  PaymentRecord,
  PaymentUploadPayload,
  PublicLicenseVerification,
} from "@/types/models";

/** POST /api/operations/payments/ (multipart) — l'investisseur envoie sa quittance. */
export async function uploadPayment(payload: PaymentUploadPayload): Promise<PaymentRecord> {
  const form = new FormData();
  form.append("project", String(payload.project));
  form.append("amount", String(payload.amount));
  form.append("receipt", payload.receipt);

  const { data } = await apiClient.post<PaymentRecord>("/operations/payments/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/** POST /api/operations/payments/{id}/verify/ — réservé à l'administration. */
export async function verifyPayment(paymentId: number): Promise<ApplicationStatusResponse> {
  const { data } = await apiClient.post<ApplicationStatusResponse>(
    `/operations/payments/${paymentId}/verify/`
  );
  return data;
}

/** GET /api/operations/projects/{projectId}/licenses/ */
export async function fetchProjectLicenses(projectId: number): Promise<LicenseRecord[]> {
  const { data } = await apiClient.get<LicenseRecord[]>(
    `/operations/projects/${projectId}/licenses/`
  );
  return data;
}

/** GET /api/operations/verify/{licenseNumber}/ — vérification publique, sans authentification. */
export async function verifyLicensePublic(
  licenseNumber: string
): Promise<PublicLicenseVerification> {
  const { data } = await apiClient.get<PublicLicenseVerification>(
    `/operations/verify/${encodeURIComponent(licenseNumber)}/`
  );
  return data;
}

/** GET /api/operations/inspections/mine/ — missions assignées à l'inspecteur connecté. */
export async function fetchMyInspections(): Promise<InspectionRecord[]> {
  const { data } = await apiClient.get<PaginatedResponse<InspectionRecord> | InspectionRecord[]>(
    "/operations/inspections/mine/"
  );
  return Array.isArray(data) ? data : data.results;
}

/** POST /api/operations/inspections/{id}/report/ */
export async function submitInspectionReport(
  inspectionId: number,
  payload: InspectionReportPayload
): Promise<ApplicationStatusResponse> {
  const form = new FormData();
  form.append("result", payload.result);
  if (payload.notes) form.append("notes", payload.notes);
  form.append("latitude", String(payload.latitude));
  form.append("longitude", String(payload.longitude));
  form.append("checklist_completed", String(payload.checklist_completed));
  if (payload.photo) form.append("photo", payload.photo);

  const { data } = await apiClient.post<ApplicationStatusResponse>(
    `/operations/inspections/${inspectionId}/report/`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return data;
}
