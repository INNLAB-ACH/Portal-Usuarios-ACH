"use client";

import { useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

type WizardItem = {
  id: string;
  name: string;
  amount: number;
};

type PaymentWizardProps = {
  title: string;
  items: WizardItem[];
  onClose: () => void;
};

export function PaymentWizard({ title, items, onClose }: PaymentWizardProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [otp, setOtp] = useState("");
  const [reference] = useState(() => `ACH-${Math.floor(Math.random() * 900000 + 100000)}`);
  const total = useMemo(() => items.reduce((sum, item) => sum + item.amount, 0), [items]);

  return (
    <div className="glass-card fixed inset-x-4 top-8 z-30 mx-auto max-w-2xl border border-primary/30 bg-white p-5 md:inset-x-0">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-primary">{title}</h3>
        <p className="text-xs text-muted-foreground">Paso {step} de 3</p>
      </div>

      {step === 1 ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Resumen de items seleccionados para pago/autorizacion.</p>
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded-md border border-border/80 px-3 py-2 text-sm">
                <span>{item.name}</span>
                <strong>{formatCurrency(item.amount)}</strong>
              </li>
            ))}
          </ul>
          <p className="text-right text-sm text-muted-foreground">
            Total: <strong className="text-primary">{formatCurrency(total)}</strong>
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={() => setStep(2)}>Continuar</Button>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Confirma la operacion con el codigo OTP simulado (000000).</p>
          <input
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            placeholder="Ingresa OTP"
            className="h-11 w-full rounded-lg border border-input px-3 text-sm"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setStep(1)}>Atras</Button>
            <Button onClick={() => setStep(3)} disabled={otp !== "000000"}>Confirmar</Button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-3 text-center">
          <CheckCircle2 className="mx-auto size-12 text-green-600" />
          <p className="text-lg font-semibold">Operacion autorizada con exito</p>
          <p className="text-sm text-muted-foreground">Referencia: {reference}</p>
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      ) : null}
    </div>
  );
}
