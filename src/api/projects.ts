import { apiClient } from "@/api/axios";
import type { CheckNameResult, OnboardingPayload, Project } from "@/types/models";

/** GET /api/projects/check-name/?name=...&service_type=... */
export async function checkNameAvailability(params: {
  name: string;
  service_type: number;
}): Promise<CheckNameResult> {
  const { data } = await apiClient.get<CheckNameResult>("/projects/check-name/", {
    params,
  });
  return data;
}

/** POST /api/projects/onboarding/ */
export async function submitOnboarding(payload: OnboardingPayload): Promise<Project> {
  const { data } = await apiClient.post<Project>("/projects/onboarding/", payload);
  return data;
}
