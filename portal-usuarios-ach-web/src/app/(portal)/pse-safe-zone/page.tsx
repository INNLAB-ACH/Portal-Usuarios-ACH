"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Ban,
  Building2,
  Clock3,
  Globe,
  MapPin,
  Pencil,
  Plus,
  Save,
  Shield,
  ShieldCheck,
  Store,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/common/stat-card";
import {
  pseGeoRules,
  pseLimitPolicy,
  pseOperationWindows,
  pseSafeZoneSummary,
  pseTrustEntries,
} from "@/data/mock-data";
import { formatCurrency } from "@/lib/utils";
import {
  PSEGeoRule,
  PSELimitPolicy,
  PSEOperationWindow,
  PSETrustEntry,
} from "@/types/portal";

const GEO_RULES_KEY = "pse-safe-zone-geo-rules";
const TRUST_ENTRIES_KEY = "pse-safe-zone-trust-entries";
const WINDOWS_KEY = "pse-safe-zone-operation-windows";
const LIMITS_KEY = "pse-safe-zone-limits";

const daysOfWeek = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"] as const;

type GeoForm = {
  scope: PSEGeoRule["scope"];
  target: string;
  action: PSEGeoRule["action"];
  active: boolean;
};

type TrustForm = {
  category: PSETrustEntry["category"];
  name: string;
  listType: PSETrustEntry["listType"];
  notes: string;
  active: boolean;
};

type WindowForm = {
  name: string;
  startHour: string;
  endHour: string;
  days: string[];
  blockOutsideSchedule: boolean;
  timezone: string;
  active: boolean;
};

const emptyGeoForm: GeoForm = {
  scope: "Ciudad",
  target: "",
  action: "Permitir",
  active: true,
};

const emptyTrustForm: TrustForm = {
  category: "Entidad",
  name: "",
  listType: "Whitelist",
  notes: "",
  active: true,
};

const emptyWindowForm: WindowForm = {
  name: "",
  startHour: "06:00",
  endHour: "20:00",
  days: ["Lun", "Mar", "Mie", "Jue", "Vie"],
  blockOutsideSchedule: true,
  timezone: "America/Bogota",
  active: true,
};

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  const raw = localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function timeStampLabel() {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
    hour12: false,
  }).format(new Date());
}

export default function PSESafeZonePage() {
  const [geoRules, setGeoRules] = useState<PSEGeoRule[]>(() => readStorage(GEO_RULES_KEY, pseGeoRules));
  const [trustEntries, setTrustEntries] = useState<PSETrustEntry[]>(() => readStorage(TRUST_ENTRIES_KEY, pseTrustEntries));
  const [operationWindows, setOperationWindows] = useState<PSEOperationWindow[]>(() =>
    readStorage(WINDOWS_KEY, pseOperationWindows),
  );
  const [limitPolicy, setLimitPolicy] = useState<PSELimitPolicy>(() => readStorage(LIMITS_KEY, pseLimitPolicy));

  const [showGeoForm, setShowGeoForm] = useState(false);
  const [editingGeoId, setEditingGeoId] = useState<string | null>(null);
  const [geoForm, setGeoForm] = useState<GeoForm>(emptyGeoForm);

  const [showTrustForm, setShowTrustForm] = useState(false);
  const [editingTrustId, setEditingTrustId] = useState<string | null>(null);
  const [trustForm, setTrustForm] = useState<TrustForm>(emptyTrustForm);

  const [showWindowForm, setShowWindowForm] = useState(false);
  const [editingWindowId, setEditingWindowId] = useState<string | null>(null);
  const [windowForm, setWindowForm] = useState<WindowForm>(emptyWindowForm);

  const [showLimitForm, setShowLimitForm] = useState(false);
  const [limitDraft, setLimitDraft] = useState<PSELimitPolicy>(limitPolicy);

  useEffect(() => {
    localStorage.setItem(GEO_RULES_KEY, JSON.stringify(geoRules));
  }, [geoRules]);

  useEffect(() => {
    localStorage.setItem(TRUST_ENTRIES_KEY, JSON.stringify(trustEntries));
  }, [trustEntries]);

  useEffect(() => {
    localStorage.setItem(WINDOWS_KEY, JSON.stringify(operationWindows));
  }, [operationWindows]);

  useEffect(() => {
    localStorage.setItem(LIMITS_KEY, JSON.stringify(limitPolicy));
  }, [limitPolicy]);

  const summary = useMemo(() => {
    const activeRules =
      geoRules.filter((item) => item.active).length +
      trustEntries.filter((item) => item.active).length +
      operationWindows.filter((item) => item.active).length +
      (limitPolicy.active ? 1 : 0);

    const blockedRules =
      geoRules.filter((item) => item.active && item.action === "Bloquear").length +
      trustEntries.filter((item) => item.active && item.listType === "Blacklist").length +
      operationWindows.filter((item) => item.active && item.blockOutsideSchedule).length;

    const trustedEntities = trustEntries.filter(
      (item) => item.active && item.listType === "Whitelist" && item.category === "Entidad",
    ).length;

    const trustedMerchants = trustEntries.filter(
      (item) => item.active && item.listType === "Whitelist" && item.category === "Comercio",
    ).length;

    return {
      activeRules: Math.max(activeRules, pseSafeZoneSummary.activeRules),
      blockedRules,
      trustedEntities,
      trustedMerchants,
    };
  }, [geoRules, trustEntries, operationWindows, limitPolicy.active]);

  const whitelistCount = trustEntries.filter((entry) => entry.listType === "Whitelist").length;
  const blacklistCount = trustEntries.filter((entry) => entry.listType === "Blacklist").length;

  const openNewGeo = () => {
    setEditingGeoId(null);
    setGeoForm(emptyGeoForm);
    setShowGeoForm(true);
  };

  const openEditGeo = (rule: PSEGeoRule) => {
    setEditingGeoId(rule.id);
    setGeoForm({
      scope: rule.scope,
      target: rule.target,
      action: rule.action,
      active: rule.active,
    });
    setShowGeoForm(true);
  };

  const saveGeoRule = () => {
    if (!geoForm.target.trim()) {
      return;
    }

    if (editingGeoId) {
      setGeoRules((current) =>
        current.map((rule) =>
          rule.id === editingGeoId
            ? {
                ...rule,
                ...geoForm,
                target: geoForm.target.trim(),
                updatedAt: timeStampLabel(),
              }
            : rule,
        ),
      );
    } else {
      setGeoRules((current) => [
        {
          id: `GEO-${Math.floor(Math.random() * 900 + 100)}`,
          scope: geoForm.scope,
          target: geoForm.target.trim(),
          action: geoForm.action,
          active: geoForm.active,
          updatedAt: timeStampLabel(),
        },
        ...current,
      ]);
    }

    setShowGeoForm(false);
    setEditingGeoId(null);
    setGeoForm(emptyGeoForm);
  };

  const openNewTrust = () => {
    setEditingTrustId(null);
    setTrustForm(emptyTrustForm);
    setShowTrustForm(true);
  };

  const openEditTrust = (entry: PSETrustEntry) => {
    setEditingTrustId(entry.id);
    setTrustForm({
      category: entry.category,
      name: entry.name,
      listType: entry.listType,
      notes: entry.notes ?? "",
      active: entry.active,
    });
    setShowTrustForm(true);
  };

  const saveTrustEntry = () => {
    if (!trustForm.name.trim()) {
      return;
    }

    if (editingTrustId) {
      setTrustEntries((current) =>
        current.map((entry) =>
          entry.id === editingTrustId
            ? {
                ...entry,
                ...trustForm,
                name: trustForm.name.trim(),
                notes: trustForm.notes.trim() || undefined,
              }
            : entry,
        ),
      );
    } else {
      setTrustEntries((current) => [
        {
          id: `TR-${Math.floor(Math.random() * 900 + 100)}`,
          category: trustForm.category,
          name: trustForm.name.trim(),
          listType: trustForm.listType,
          notes: trustForm.notes.trim() || undefined,
          active: trustForm.active,
        },
        ...current,
      ]);
    }

    setShowTrustForm(false);
    setEditingTrustId(null);
    setTrustForm(emptyTrustForm);
  };

  const openNewWindow = () => {
    setEditingWindowId(null);
    setWindowForm(emptyWindowForm);
    setShowWindowForm(true);
  };

  const openEditWindow = (window: PSEOperationWindow) => {
    setEditingWindowId(window.id);
    setWindowForm({
      name: window.name,
      startHour: window.startHour,
      endHour: window.endHour,
      days: window.days,
      blockOutsideSchedule: window.blockOutsideSchedule,
      timezone: window.timezone,
      active: window.active,
    });
    setShowWindowForm(true);
  };

  const toggleWindowDay = (day: string) => {
    setWindowForm((current) => ({
      ...current,
      days: current.days.includes(day)
        ? current.days.filter((item) => item !== day)
        : [...current.days, day],
    }));
  };

  const saveWindow = () => {
    if (!windowForm.name.trim() || windowForm.days.length === 0) {
      return;
    }

    if (editingWindowId) {
      setOperationWindows((current) =>
        current.map((window) =>
          window.id === editingWindowId
            ? {
                ...window,
                ...windowForm,
                name: windowForm.name.trim(),
              }
            : window,
        ),
      );
    } else {
      setOperationWindows((current) => [
        {
          id: `TW-${Math.floor(Math.random() * 900 + 100)}`,
          name: windowForm.name.trim(),
          startHour: windowForm.startHour,
          endHour: windowForm.endHour,
          days: windowForm.days,
          blockOutsideSchedule: windowForm.blockOutsideSchedule,
          timezone: windowForm.timezone,
          active: windowForm.active,
        },
        ...current,
      ]);
    }

    setShowWindowForm(false);
    setEditingWindowId(null);
    setWindowForm(emptyWindowForm);
  };

  const saveLimits = () => {
    setLimitPolicy({
      ...limitDraft,
      updatedAt: timeStampLabel(),
    });
    setShowLimitForm(false);
  };

  const toggleLimitEditor = () => {
    if (!showLimitForm) {
      setLimitDraft(limitPolicy);
    }
    setShowLimitForm((current) => !current);
  };

  return (
    <div className="space-y-5">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Reglas activas"
          value={String(summary.activeRules)}
          helper="Politicas actualmente en ejecucion"
          icon={<ShieldCheck className="size-5" />}
        />
        <StatCard
          label="Reglas bloqueadas"
          value={String(summary.blockedRules)}
          helper="Configuraciones en pausa o inactivas"
          icon={<Ban className="size-5" />}
        />
        <StatCard
          label="Entidades de confianza"
          value={String(summary.trustedEntities)}
          helper="Entidades dentro de whitelist"
          icon={<Building2 className="size-5" />}
        />
        <StatCard
          label="Comercios de confianza"
          value={String(summary.trustedMerchants)}
          helper="Comercios permitidos para operar"
          icon={<Store className="size-5" />}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <article className="glass-card overflow-hidden">
          <header className="flex items-center justify-between border-b border-border/70 px-4 py-3">
            <div>
              <h2 className="text-base font-semibold text-primary">Reglas por ubicación</h2>
              <p className="text-xs text-muted-foreground">Permitir o bloquear por ciudad, país o zona.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={openNewGeo}>
                <Plus className="size-3.5" /> Nueva regla
              </Button>
              <Globe className="size-5 text-primary" />
            </div>
          </header>

          {showGeoForm ? (
            <div className="grid gap-2 border-b border-border/70 bg-muted/30 p-3 md:grid-cols-2">
              <label className="text-xs text-muted-foreground">
                Alcance
                <select
                  className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  value={geoForm.scope}
                  onChange={(event) => setGeoForm((current) => ({ ...current, scope: event.target.value as PSEGeoRule["scope"] }))}
                >
                  <option value="Ciudad">Ciudad</option>
                  <option value="País">País</option>
                  <option value="Zona">Zona</option>
                </select>
              </label>
              <label className="text-xs text-muted-foreground">
                Acción
                <select
                  className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  value={geoForm.action}
                  onChange={(event) => setGeoForm((current) => ({ ...current, action: event.target.value as PSEGeoRule["action"] }))}
                >
                  <option value="Permitir">Permitir</option>
                  <option value="Bloquear">Bloquear</option>
                </select>
              </label>
              <label className="text-xs text-muted-foreground md:col-span-2">
                Objetivo
                <input
                  className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  placeholder="Ejemplo: Medellin, Chile, Zona norte"
                  value={geoForm.target}
                  onChange={(event) => setGeoForm((current) => ({ ...current, target: event.target.value }))}
                />
              </label>
              <label className="mt-1 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={geoForm.active}
                  onChange={(event) => setGeoForm((current) => ({ ...current, active: event.target.checked }))}
                />
                Regla activa
              </label>
              <div className="flex items-center justify-end gap-2 md:col-span-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    setShowGeoForm(false);
                    setEditingGeoId(null);
                    setGeoForm(emptyGeoForm);
                  }}
                >
                  <X className="size-3.5" /> Cancelar
                </Button>
                <Button size="sm" className="gap-1" onClick={saveGeoRule}>
                  <Save className="size-3.5" /> {editingGeoId ? "Guardar cambios" : "Adicionar regla"}
                </Button>
              </div>
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-muted/45 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-4 py-3">Alcance</th>
                  <th className="px-4 py-3">Objetivo</th>
                  <th className="px-4 py-3">Acción</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3 text-right">Editar</th>
                </tr>
              </thead>
              <tbody>
                {geoRules.map((rule) => (
                  <tr key={rule.id} className="border-t border-border/70">
                    <td className="px-4 py-3 font-medium">{rule.scope}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5 text-muted-foreground" />
                        {rule.target}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          rule.action === "Permitir" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {rule.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          rule.active ? "bg-cyan-100 text-cyan-700" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {rule.active ? "Activa" : "Inactiva"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => openEditGeo(rule)}>
                        <Pencil className="size-3.5" /> Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="glass-card overflow-hidden">
          <header className="flex items-center justify-between border-b border-border/70 px-4 py-3">
            <div>
              <h2 className="text-base font-semibold text-primary">Whitelist y blacklist</h2>
              <p className="text-xs text-muted-foreground">Entidades y comercios de confianza o bloqueo directo.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={openNewTrust}>
                <Plus className="size-3.5" /> Nueva entrada
              </Button>
              <Shield className="size-5 text-primary" />
            </div>
          </header>

          {showTrustForm ? (
            <div className="grid gap-2 border-b border-border/70 bg-muted/30 p-3 md:grid-cols-2">
              <label className="text-xs text-muted-foreground">
                Categoria
                <select
                  className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  value={trustForm.category}
                  onChange={(event) => setTrustForm((current) => ({ ...current, category: event.target.value as PSETrustEntry["category"] }))}
                >
                  <option value="Entidad">Entidad</option>
                  <option value="Comercio">Comercio</option>
                </select>
              </label>
              <label className="text-xs text-muted-foreground">
                Lista
                <select
                  className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  value={trustForm.listType}
                  onChange={(event) => setTrustForm((current) => ({ ...current, listType: event.target.value as PSETrustEntry["listType"] }))}
                >
                  <option value="Whitelist">Whitelist</option>
                  <option value="Blacklist">Blacklist</option>
                </select>
              </label>
              <label className="text-xs text-muted-foreground md:col-span-2">
                Nombre de entidad/comercio
                <input
                  className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  placeholder="Ejemplo: Comercio ACH Centro"
                  value={trustForm.name}
                  onChange={(event) => setTrustForm((current) => ({ ...current, name: event.target.value }))}
                />
              </label>
              <label className="text-xs text-muted-foreground md:col-span-2">
                Notas
                <input
                  className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  placeholder="Opcional"
                  value={trustForm.notes}
                  onChange={(event) => setTrustForm((current) => ({ ...current, notes: event.target.value }))}
                />
              </label>
              <label className="mt-1 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={trustForm.active}
                  onChange={(event) => setTrustForm((current) => ({ ...current, active: event.target.checked }))}
                />
                Entrada activa
              </label>
              <div className="flex items-center justify-end gap-2 md:col-span-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    setShowTrustForm(false);
                    setEditingTrustId(null);
                    setTrustForm(emptyTrustForm);
                  }}
                >
                  <X className="size-3.5" /> Cancelar
                </Button>
                <Button size="sm" className="gap-1" onClick={saveTrustEntry}>
                  <Save className="size-3.5" /> {editingTrustId ? "Guardar cambios" : "Adicionar entrada"}
                </Button>
              </div>
            </div>
          ) : null}

          <div className="space-y-3 p-4">
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                Whitelist: <strong>{whitelistCount}</strong>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                Blacklist: <strong>{blacklistCount}</strong>
              </div>
            </div>

            <div className="max-h-70 space-y-2 overflow-y-auto pr-1">
              {trustEntries.map((entry) => (
                <article key={entry.id} className="rounded-lg border border-border/80 bg-white px-3 py-2 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-primary">{entry.name}</p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-1 text-xs ${
                          entry.listType === "Whitelist"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {entry.listType}
                      </span>
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => openEditTrust(entry)}>
                        <Pencil className="size-3.5" /> Editar
                      </Button>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{entry.category}</p>
                  {entry.notes ? <p className="mt-1 text-xs text-muted-foreground">{entry.notes}</p> : null}
                </article>
              ))}
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="glass-card overflow-hidden">
          <header className="flex items-center justify-between border-b border-border/70 px-4 py-3">
            <div>
              <h2 className="text-base font-semibold text-primary">Ventanas horarias</h2>
              <p className="text-xs text-muted-foreground">Operación permitida solo dentro del horario definido.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1" onClick={openNewWindow}>
                <Plus className="size-3.5" /> Nueva ventana
              </Button>
              <Clock3 className="size-5 text-primary" />
            </div>
          </header>

          {showWindowForm ? (
            <div className="grid gap-2 border-b border-border/70 bg-muted/30 p-3 md:grid-cols-2">
              <label className="text-xs text-muted-foreground md:col-span-2">
                Nombre
                <input
                  className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  placeholder="Ejemplo: Horario nocturno"
                  value={windowForm.name}
                  onChange={(event) => setWindowForm((current) => ({ ...current, name: event.target.value }))}
                />
              </label>
              <label className="text-xs text-muted-foreground">
                Hora inicio
                <input
                  type="time"
                  className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  value={windowForm.startHour}
                  onChange={(event) => setWindowForm((current) => ({ ...current, startHour: event.target.value }))}
                />
              </label>
              <label className="text-xs text-muted-foreground">
                Hora fin
                <input
                  type="time"
                  className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  value={windowForm.endHour}
                  onChange={(event) => setWindowForm((current) => ({ ...current, endHour: event.target.value }))}
                />
              </label>
              <label className="text-xs text-muted-foreground md:col-span-2">
                Zona horaria
                <input
                  className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  value={windowForm.timezone}
                  onChange={(event) => setWindowForm((current) => ({ ...current, timezone: event.target.value }))}
                />
              </label>
              <div className="md:col-span-2">
                <p className="text-xs text-muted-foreground">Días habilitados</p>
                <div className="mt-1 grid grid-cols-4 gap-2 sm:grid-cols-7">
                  {daysOfWeek.map((day) => (
                    <label key={day} className="flex items-center gap-1 rounded-md border border-border/70 bg-white px-2 py-1 text-xs">
                      <input
                        type="checkbox"
                        checked={windowForm.days.includes(day)}
                        onChange={() => toggleWindowDay(day)}
                      />
                      {day}
                    </label>
                  ))}
                </div>
              </div>
              <label className="mt-1 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={windowForm.blockOutsideSchedule}
                  onChange={(event) => setWindowForm((current) => ({ ...current, blockOutsideSchedule: event.target.checked }))}
                />
                Bloquear fuera de horario
              </label>
              <label className="mt-1 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={windowForm.active}
                  onChange={(event) => setWindowForm((current) => ({ ...current, active: event.target.checked }))}
                />
                Ventana activa
              </label>
              <div className="flex items-center justify-end gap-2 md:col-span-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    setShowWindowForm(false);
                    setEditingWindowId(null);
                    setWindowForm(emptyWindowForm);
                  }}
                >
                  <X className="size-3.5" /> Cancelar
                </Button>
                <Button size="sm" className="gap-1" onClick={saveWindow}>
                  <Save className="size-3.5" /> {editingWindowId ? "Guardar cambios" : "Adicionar ventana"}
                </Button>
              </div>
            </div>
          ) : null}

          <div className="space-y-2 p-4">
            {operationWindows.map((window) => (
              <article key={window.id} className="rounded-lg border border-border/80 bg-white px-3 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-primary">{window.name}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        window.active ? "bg-cyan-100 text-cyan-700" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {window.active ? "Activa" : "Inactiva"}
                    </span>
                    <Button variant="outline" size="sm" className="gap-1" onClick={() => openEditWindow(window)}>
                      <Pencil className="size-3.5" /> Editar
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-foreground">
                  {window.startHour} - {window.endHour} ({window.timezone})
                </p>
                <p className="mt-1 text-xs text-muted-foreground">Días: {window.days.join(", ")}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {window.blockOutsideSchedule ? "Bloqueo fuera de horario: activado" : "Bloqueo fuera de horario: desactivado"}
                </p>
              </article>
            ))}
          </div>
        </article>

        <article className="glass-card p-4 md:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-primary">Límites operativos</h2>
              <p className="text-xs text-muted-foreground">Topes por monto, cantidad y acumulado.</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={toggleLimitEditor}
              >
                <Pencil className="size-3.5" /> {showLimitForm ? "Cerrar" : "Editar límites"}
              </Button>
              <ShieldCheck className="size-5 text-primary" />
            </div>
          </div>

          {showLimitForm ? (
            <div className="mb-4 grid gap-2 rounded-lg border border-border/80 bg-muted/30 p-3">
              <label className="text-xs text-muted-foreground">
                Monto máximo por transacción
                <input
                  type="number"
                  min={0}
                  className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  value={limitDraft.maxAmountPerTransaction}
                  onChange={(event) =>
                    setLimitDraft((current) => ({
                      ...current,
                      maxAmountPerTransaction: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="text-xs text-muted-foreground">
                Cantidad máxima de transacciones por día
                <input
                  type="number"
                  min={0}
                  className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  value={limitDraft.maxTransactionsPerDay}
                  onChange={(event) =>
                    setLimitDraft((current) => ({
                      ...current,
                      maxTransactionsPerDay: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="text-xs text-muted-foreground">
                Acumulado diario
                <input
                  type="number"
                  min={0}
                  className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  value={limitDraft.dailyAccumulatedCap}
                  onChange={(event) =>
                    setLimitDraft((current) => ({
                      ...current,
                      dailyAccumulatedCap: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="text-xs text-muted-foreground">
                Acumulado semanal
                <input
                  type="number"
                  min={0}
                  className="mt-1 h-10 w-full rounded-md border border-input bg-white px-3 text-sm"
                  value={limitDraft.weeklyAccumulatedCap}
                  onChange={(event) =>
                    setLimitDraft((current) => ({
                      ...current,
                      weeklyAccumulatedCap: Number(event.target.value),
                    }))
                  }
                />
              </label>
              <label className="mt-1 flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={limitDraft.active}
                  onChange={(event) => setLimitDraft((current) => ({ ...current, active: event.target.checked }))}
                />
                Límites activos
              </label>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    setLimitDraft(limitPolicy);
                    setShowLimitForm(false);
                  }}
                >
                  <X className="size-3.5" /> Cancelar
                </Button>
                <Button size="sm" className="gap-1" onClick={saveLimits}>
                  <Save className="size-3.5" /> Guardar límites
                </Button>
              </div>
            </div>
          ) : null}

          <div className="space-y-3 text-sm">
            <div className="rounded-lg border border-border/80 bg-white px-3 py-2">
              <p className="text-xs text-muted-foreground">Monto máximo por transacción</p>
              <p className="text-base font-semibold text-primary">{formatCurrency(limitPolicy.maxAmountPerTransaction)}</p>
            </div>
            <div className="rounded-lg border border-border/80 bg-white px-3 py-2">
              <p className="text-xs text-muted-foreground">Cantidad máxima diaria</p>
              <p className="text-base font-semibold text-primary">{limitPolicy.maxTransactionsPerDay} transacciones</p>
            </div>
            <div className="rounded-lg border border-border/80 bg-white px-3 py-2">
              <p className="text-xs text-muted-foreground">Acumulado diario</p>
              <p className="text-base font-semibold text-primary">{formatCurrency(limitPolicy.dailyAccumulatedCap)}</p>
            </div>
            <div className="rounded-lg border border-border/80 bg-white px-3 py-2">
              <p className="text-xs text-muted-foreground">Acumulado semanal</p>
              <p className="text-base font-semibold text-primary">{formatCurrency(limitPolicy.weeklyAccumulatedCap)}</p>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Última actualización de límites: {limitPolicy.updatedAt}.
          </p>
        </article>
      </section>
    </div>
  );
}
