"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { useAuth } from "@/components/providers/app-providers";

export default function HomePage() {
  const router = useRouter();
  const { user, isHydrated } = useAuth();

  useEffect(() => {
    if (isHydrated && user) {
      router.replace("/dashboard");
    }
  }, [isHydrated, router, user]);

  if (!isHydrated) {
    return <div className="flex min-h-screen items-center justify-center">Cargando...</div>;
  }

  if (user) {
    return null;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center p-4">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(0,48,135,0.08)_40%,rgba(0,168,168,0.12)_100%)]" />
      <LoginForm />
    </main>
  );
}
