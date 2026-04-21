"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { socialSecurityEvents, socialSecurityInfo } from "@/data/mock-data";

export default function SecuritySocialPage() {
  const [events, setEvents] = useState(socialSecurityEvents);
  const [novelty, setNovelty] = useState("");

  const submitNovelty = (event: FormEvent) => {
    event.preventDefault();
    if (!novelty.trim()) {
      return;
    }

    setEvents((prev) => [
      {
        id: `N-${Math.floor(Math.random() * 900 + 1000)}`,
        date: new Date().toISOString().slice(0, 10),
        noveltyType: novelty,
        status: "Reportada",
      },
      ...prev,
    ]);

    setNovelty("");
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="space-y-4">
        <article className="glass-card space-y-3 p-4">
          <h2 className="text-lg font-semibold text-primary">Informacion afiliaciones</h2>
          <p className="text-sm">EPS: <strong>{socialSecurityInfo.eps}</strong></p>
          <p className="text-sm">Fondo de pensiones: <strong>{socialSecurityInfo.pensionFund}</strong></p>
          <p className="text-sm">ARL: <strong>{socialSecurityInfo.arl}</strong></p>
          <p className="text-sm">Caja de compensacion: <strong>{socialSecurityInfo.compensationFund}</strong></p>
        </article>

        <article className="glass-card space-y-3 p-4">
          <h2 className="text-lg font-semibold text-primary">Generar planilla</h2>
          <div className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/40 px-3 py-2">
            <p className="text-xs text-muted-foreground">Powered by SOI ACH</p>
            <Image src="/soi-ach.svg" alt="Powered by SOI ACH" width={126} height={24} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <input className="h-10 rounded-md border border-input px-3" placeholder="Periodo (AAAA-MM)" />
            <input className="h-10 rounded-md border border-input px-3" placeholder="Nro empleados" />
          </div>
          <Button>Generar planilla de pago</Button>
        </article>
      </section>

      <section className="space-y-4">
        <article className="glass-card space-y-3 p-4">
          <h2 className="text-lg font-semibold text-primary">Reportar novedad individual</h2>
          <form className="flex gap-2" onSubmit={submitNovelty}>
            <input
              value={novelty}
              onChange={(event) => setNovelty(event.target.value)}
              className="h-10 flex-1 rounded-md border border-input px-3 text-sm"
              placeholder="Ej: incapacidad, ingreso, retiro"
            />
            <Button type="submit">Agregar</Button>
          </form>
        </article>

        <article className="glass-card overflow-hidden">
          <div className="border-b border-border/80 px-4 py-3">
            <h2 className="font-semibold">Historial de novedades</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted/45 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-t border-border/70">
                    <td className="px-4 py-3">{event.date}</td>
                    <td className="px-4 py-3">{event.noveltyType}</td>
                    <td className="px-4 py-3">{event.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
}
