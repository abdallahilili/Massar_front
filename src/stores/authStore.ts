import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LocalProjectContext, TokenPair, UserRole } from "@/types/models";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  role: UserRole | null;
  /** Contexte du projet créé/actif localement (aucun endpoint "me" côté backend). */
  project: LocalProjectContext | null;

  setTokens: (tokens: TokenPair) => void;
  setSession: (params: { tokens: TokenPair; email: string; role: UserRole }) => void;
  setProjectContext: (project: LocalProjectContext | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      email: null,
      role: null,
      project: null,

      setTokens: (tokens) =>
        set({ accessToken: tokens.access, refreshToken: tokens.refresh }),

      setSession: ({ tokens, email, role }) =>
        set({
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
          email,
          role,
        }),

      setProjectContext: (project) => set({ project }),

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          email: null,
          role: null,
          project: null,
        }),

      isAuthenticated: () => Boolean(get().accessToken),
    }),
    {
      name: "messar-auth",
    }
  )
);
