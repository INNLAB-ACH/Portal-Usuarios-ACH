"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [alerts, setAlerts] = useState(true);
  const [language, setLanguage] = useState("es");

  return (
    <section className="glass-card max-w-2xl space-y-4 p-5">
      <h2 className="text-lg font-semibold text-primary">Preferencias del portal</h2>

      <div className="space-y-2 text-sm">
        <label className="flex items-center justify-between rounded-lg border border-border/80 p-3">
          Activar notificaciones automaticas
          <input type="checkbox" checked={alerts} onChange={(event) => setAlerts(event.target.checked)} />
        </label>

        <label className="block space-y-1">
          Idioma
          <select className="h-10 w-full rounded-md border border-input px-3" value={language} onChange={(event) => setLanguage(event.target.value)}>
            <option value="es">Espanol</option>
            <option value="en">Ingles</option>
          </select>
        </label>
      </div>

      <Button>Guardar configuracion</Button>
    </section>
  );
}
