"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { mockUsers } from "@/data/mock-data";
import { AuthUser } from "@/types/portal";
import { useHydrated } from "@/lib/use-hydrated";

type AuthContextValue = {
  user: AuthUser | null;
  isHydrated: boolean;
  login: (username: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "ach-portal-user";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const isHydrated = useHydrated();

  const persistedUser = useMemo<AuthUser | null>(() => {
    if (!isHydrated) {
      return null;
    }

    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  }, [isHydrated]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: user ?? persistedUser,
      isHydrated,
      login: async (username, password) => {
        const found = mockUsers.find(
          (candidate) => candidate.username === username && candidate.password === password,
        );

        if (!found) {
          return { ok: false, message: "Credenciales invalidas" };
        }

        const authUser: AuthUser = {
          id: found.id,
          username: found.username,
          fullName: found.fullName,
        };

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
        setUser(authUser);
        return { ok: true };
      },
      logout: () => {
        sessionStorage.removeItem(STORAGE_KEY);
        setUser(null);
      },
    }),
    [isHydrated, persistedUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AppProviders");
  }
  return ctx;
}
