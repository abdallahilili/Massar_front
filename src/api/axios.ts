import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/authStore";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = useAuthStore.getState().refreshToken;
  if (!refreshToken) return null;

  try {
    const { data } = await axios.post<{ access: string }>(
      `${API_BASE_URL}/auth/refresh/`,
      { refresh: refreshToken }
    );
    useAuthStore.getState().setTokens({ access: data.access, refresh: refreshToken });
    return data.access;
  } catch {
    useAuthStore.getState().logout();
    return null;
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;
      const newToken = refreshPromise ?? (refreshPromise = refreshAccessToken());
      const access = await newToken;
      refreshPromise = null;

      if (access) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${access}`;
        return apiClient(original);
      }
    }

    return Promise.reject(error);
  }
);

/** Extrait un message d'erreur lisible depuis une réponse DRF (detail, non_field_errors, ou premier champ invalide). */
export function extractApiErrorMessage(error: unknown, fallback = "Une erreur est survenue. Veuillez réessayer."): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === "string") return data;
    if (data && typeof data === "object") {
      const record = data as Record<string, unknown>;
      if (typeof record.detail === "string") return record.detail;
      const firstKey = Object.keys(record)[0];
      if (firstKey) {
        const value = record[firstKey];
        if (Array.isArray(value) && typeof value[0] === "string") return value[0];
        if (typeof value === "string") return value;
      }
    }
  }
  return fallback;
}
