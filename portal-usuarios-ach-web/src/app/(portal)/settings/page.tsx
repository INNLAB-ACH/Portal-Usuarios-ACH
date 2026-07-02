"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [alerts, setAlerts] = useState(true);
  const [language, setLanguage] = useState("es");
  const [channels, setChannels] = useState({
    whatsapp: true,
    sms: false,
    email: true,
  });
  const [frequency, setFrequency] = useState("instant");
  const [windowStart, setWindowStart] = useState("07:00");
  const [windowEnd, setWindowEnd] = useState("21:00");
  const [specialCases, setSpecialCases] = useState({
    highAmount: true,
    outsideSchedule: true,
    failedAttempts: true,
    profileChanges: false,
  });

  const enabledChannels = Object.values(channels).filter(Boolean).length;

  const updateChannel = (channel: keyof typeof channels, value: boolean) => {
    setChannels((current) => ({ ...current, [channel]: value }));
  };

  const updateSpecialCase = (specialCase: keyof typeof specialCases, value: boolean) => {
    setSpecialCases((current) => ({ ...current, [specialCase]: value }));
  };

  return (
    <section className="glass-card max-w-3xl space-y-5 p-5">
      <h2 className="text-lg font-semibold text-primary">Preferencias del portal</h2>

      <div className="space-y-2 text-sm">
        <label className="flex items-center justify-between rounded-lg border border-border/80 p-3">
          Activar notificaciones automáticas
          <input type="checkbox" checked={alerts} onChange={(event) => setAlerts(event.target.checked)} />
        </label>

        <label className="block space-y-1">
          Idioma
          <select className="h-10 w-full rounded-md border border-input px-3" value={language} onChange={(event) => setLanguage(event.target.value)}>
            <option value="es">Español</option>
            <option value="en">Inglés</option>
          </select>
        </label>
      </div>

      <div className={`space-y-4 rounded-lg border border-border/70 p-4 ${alerts ? "" : "opacity-60"}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-medium text-primary">Canales de notificación</h3>
          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">{enabledChannels} canal(es) activo(s)</span>
        </div>

        <div className="grid gap-2 text-sm md:grid-cols-3">
          <label className="flex items-center justify-between rounded-md border border-border/70 p-3">
            WhatsApp
            <input
              type="checkbox"
              checked={channels.whatsapp}
              disabled={!alerts}
              onChange={(event) => updateChannel("whatsapp", event.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between rounded-md border border-border/70 p-3">
            Mensaje de texto
            <input
              type="checkbox"
              checked={channels.sms}
              disabled={!alerts}
              onChange={(event) => updateChannel("sms", event.target.checked)}
            />
          </label>
          <label className="flex items-center justify-between rounded-md border border-border/70 p-3">
            Correo electrónico
            <input
              type="checkbox"
              checked={channels.email}
              disabled={!alerts}
              onChange={(event) => updateChannel("email", event.target.checked)}
            />
          </label>
        </div>

        <label className="block space-y-1 text-sm">
          Frecuencia de envío
          <select
            className="h-10 w-full rounded-md border border-input px-3"
            value={frequency}
            disabled={!alerts}
            onChange={(event) => setFrequency(event.target.value)}
          >
            <option value="instant">Inmediata (en tiempo real)</option>
            <option value="hourly">Resumen cada hora</option>
            <option value="daily">Resumen diario</option>
            <option value="weekly">Resumen semanal</option>
          </select>
        </label>

        <div className="space-y-2 text-sm">
          <p className="font-medium text-primary">Horarios preferidos</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="space-y-1">
              Desde
              <input
                type="time"
                className="h-10 w-full rounded-md border border-input px-3"
                value={windowStart}
                disabled={!alerts}
                onChange={(event) => setWindowStart(event.target.value)}
              />
            </label>
            <label className="space-y-1">
              Hasta
              <input
                type="time"
                className="h-10 w-full rounded-md border border-input px-3"
                value={windowEnd}
                disabled={!alerts}
                onChange={(event) => setWindowEnd(event.target.value)}
              />
            </label>
          </div>
          <p className="text-xs text-muted-foreground">Zona horaria aplicada: America/Bogota.</p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium text-primary">Casos especiales</p>
          <div className="grid gap-2 md:grid-cols-2">
            <label className="flex items-center gap-2 rounded-md border border-border/70 p-3">
              <input
                type="checkbox"
                checked={specialCases.highAmount}
                disabled={!alerts}
                onChange={(event) => updateSpecialCase("highAmount", event.target.checked)}
              />
              Movimientos de monto alto
            </label>
            <label className="flex items-center gap-2 rounded-md border border-border/70 p-3">
              <input
                type="checkbox"
                checked={specialCases.outsideSchedule}
                disabled={!alerts}
                onChange={(event) => updateSpecialCase("outsideSchedule", event.target.checked)}
              />
              Operaciones fuera de horario
            </label>
            <label className="flex items-center gap-2 rounded-md border border-border/70 p-3">
              <input
                type="checkbox"
                checked={specialCases.failedAttempts}
                disabled={!alerts}
                onChange={(event) => updateSpecialCase("failedAttempts", event.target.checked)}
              />
              Intentos fallidos o rechazados
            </label>
            <label className="flex items-center gap-2 rounded-md border border-border/70 p-3">
              <input
                type="checkbox"
                checked={specialCases.profileChanges}
                disabled={!alerts}
                onChange={(event) => updateSpecialCase("profileChanges", event.target.checked)}
              />
              Cambios en perfil y seguridad
            </label>
          </div>
        </div>
      </div>

      <Button disabled={alerts && enabledChannels === 0}>Guardar configuración</Button>
    </section>
  );
}
