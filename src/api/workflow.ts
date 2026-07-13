import { apiClient } from "@/api/axios";
import type {
  ApplicationStatusResponse,
  DocumentRecord,
  DocumentUploadPayload,
} from "@/types/models";

/** POST /api/workflow/documents/ (multipart) — crée ou remplace le document d'une exigence donnée. */
export async function uploadDocument(
  payload: DocumentUploadPayload
): Promise<DocumentRecord> {
  const form = new FormData();
  form.append("project", String(payload.project));
  form.append("requirement", String(payload.requirement));
  form.append("file", payload.file);

  const { data } = await apiClient.post<DocumentRecord>("/workflow/documents/", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

/** POST /api/workflow/projects/{projectId}/submit/ */
export async function submitApplication(
  projectId: number
): Promise<ApplicationStatusResponse> {
  const { data } = await apiClient.post<ApplicationStatusResponse>(
    `/workflow/projects/${projectId}/submit/`
  );
  return data;
}

/** GET /api/workflow/projects/{projectId}/status/ */
export async function fetchApplicationStatus(
  projectId: number
): Promise<ApplicationStatusResponse> {
  const { data } = await apiClient.get<ApplicationStatusResponse>(
    `/workflow/projects/${projectId}/status/`
  );
  return data;
}
