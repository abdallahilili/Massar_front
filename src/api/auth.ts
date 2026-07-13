import { apiClient } from "@/api/axios";
import type { LoginPayload, TokenPair } from "@/types/models";

/** POST /api/auth/login/ */
export async function login(payload: LoginPayload): Promise<TokenPair> {
  const { data } = await apiClient.post<TokenPair>("/auth/login/", payload);
  return data;
}
