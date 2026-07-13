import { apiClient } from "@/api/axios";
import type { ServiceType } from "@/types/models";

/** GET /api/services/ */
export async function fetchServiceTypes(): Promise<ServiceType[]> {
  const { data } = await apiClient.get<ServiceType[] | { results: ServiceType[] }>("/services/");
  return Array.isArray(data) ? data : data.results;
}

/** GET /api/services/{id}/ */
export async function fetchServiceType(id: number | string): Promise<ServiceType> {
  const { data } = await apiClient.get<ServiceType>(`/services/${id}/`);
  return data;
}
