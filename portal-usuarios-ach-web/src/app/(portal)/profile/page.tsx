"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, BadgeCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/providers/app-providers";

type ProfileForm = {
  fullName: string;
  idType: string;
  idNumber: string;
  email: string;
  phone: string;
  city: string;
  address: string;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileForm>({
    fullName: user?.fullName ?? "Camila Torres",
    idType: "CC",
    idNumber: "1023456789",
    email: "camila.torres@correo.com",
    phone: "3001234567",
    city: "Bogota",
    address: "Cra 15 # 93 - 20",
  });
  const [savedAt, setSavedAt] = useState<string | null>(null);

  const hasValidEmail = useMemo(() => emailRegex.test(profile.email), [profile.email]);

  const onFieldChange = (field: keyof ProfileForm, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  const onSave = () => {
    if (!hasValidEmail) return;
    setSavedAt(new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }));
  };

  return (
    <section className="space-y-5">
      <div className="glass-card max-w-4xl space-y-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-primary">Datos personales</h2>
            <p className="mt-1 text-sm text-muted-foreground">Actualiza tu información de contacto. La cédula es un dato bloqueado para edición.</p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            <BadgeCheck className="size-4" />
            Perfil verificado
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            Nombre completo
            <input
              type="text"
              className="h-10 w-full rounded-md border border-input px-3"
              value={profile.fullName}
              onChange={(event) => onFieldChange("fullName", event.target.value)}
            />
          </label>

          <label className="space-y-1 text-sm">
            Tipo de identificación
            <select
              className="h-10 w-full cursor-not-allowed rounded-md border border-input bg-muted/60 px-3 text-muted-foreground"
              value={profile.idType}
              disabled
              aria-disabled
            >
              <option value="CC">CC</option>
            </select>
          </label>

          <label className="space-y-1 text-sm">
            Identificación
            <input
              type="text"
              className="h-10 w-full cursor-not-allowed rounded-md border border-input bg-muted/60 px-3 text-muted-foreground"
              value={profile.idNumber}
              readOnly
              aria-readonly
            />
          </label>

          <label className="space-y-1 text-sm">
            Correo electrónico
            <input
              type="email"
              className="h-10 w-full rounded-md border border-input px-3"
              value={profile.email}
              onChange={(event) => onFieldChange("email", event.target.value)}
            />
            {!hasValidEmail ? <p className="text-xs text-red-600">Ingresa un correo válido para poder guardar cambios.</p> : null}
          </label>

          <label className="space-y-1 text-sm">
            Celular
            <input
              type="tel"
              className="h-10 w-full rounded-md border border-input px-3"
              value={profile.phone}
              onChange={(event) => onFieldChange("phone", event.target.value)}
            />
          </label>

          <label className="space-y-1 text-sm">
            Ciudad
            <input
              type="text"
              className="h-10 w-full rounded-md border border-input px-3"
              value={profile.city}
              onChange={(event) => onFieldChange("city", event.target.value)}
            />
          </label>

          <label className="space-y-1 text-sm">
            Dirección
            <input
              type="text"
              className="h-10 w-full rounded-md border border-input px-3"
              value={profile.address}
              onChange={(event) => onFieldChange("address", event.target.value)}
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={onSave} disabled={!hasValidEmail}>
            Guardar cambios
          </Button>
          {savedAt ? <p className="text-xs text-emerald-700">Datos actualizados correctamente a las {savedAt}.</p> : null}
        </div>
      </div>

      <article className="glass-card max-w-4xl space-y-3 border border-amber-300/70 bg-amber-50/80 p-5 text-amber-900">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <ShieldCheck className="size-4" />
          Tratamiento y protección de datos personales
        </div>
        <p className="text-sm leading-relaxed">
          La información registrada en esta sección se utiliza para validar tu identidad, habilitar la comunicación sobre transacciones y mantener
          actualizada la seguridad de tu cuenta en el Portal de Usuarios ACH.
        </p>
        <p className="flex items-start gap-2 text-sm leading-relaxed">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          Tus datos personales son tratados bajo políticas de confidencialidad y se encuentran protegidos de acuerdo con la Ley de Protección de
          Datos Personales (HABEAS DATA) en Colombia.
        </p>
      </article>
    </section>
  );
}