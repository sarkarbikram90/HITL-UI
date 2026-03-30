"use client";

import * as React from "react";
import { useExecutionSteps } from "@/hooks/use-incidents-api";
import { CheckCircle2, Circle, XCircle, Loader2 } from "lucide-react";

export function ExecutionTimeline({ incidentId }: { incidentId: string }) {
  const { data: steps, isLoading } = useExecutionSteps(incidentId);

  if (isLoading) {
    return (
      <div className="flex animate-pulse space-x-4 p-4">
        <div className="h-10 w-10 rounded-full bg-muted"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 rounded bg-muted"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-4 rounded bg-muted"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!steps || steps.length === 0) {
    return (
      <div className="p-4 text-sm text-muted-foreground italic">
        No execution steps recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-muted/20 rounded-lg border border-[var(--color-border)] glass m-2">
      <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-4">Execution Progress</h4>
      <div className="relative space-y-6 left-2">
        {/* Vertical Line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border" />

        {steps.map((step) => (
          <div key={step.id} className="relative flex items-start gap-4">
            <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-background border-2 border-border shadow-sm">
              {step.status === "Success" && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              {step.status === "Failed" && <XCircle className="h-4 w-4 text-rose-500" />}
              {step.status === "Pending" && <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />}
              {/* Fallback for unexpected statuses */}
              {step.status !== "Success" && step.status !== "Failed" && step.status !== "Pending" && (
                <Circle className="h-2 w-2 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold truncate">{step.stepName}</p>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {new Date(step.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <code className="mt-1 block text-xs p-1.5 bg-black/40 rounded border border-white/5 font-mono text-emerald-400 overflow-x-auto">
                $ {step.command}
              </code>
              {step.output && (
                <pre className="mt-2 text-[10px] p-2 bg-black/60 rounded text-muted-foreground overflow-x-auto max-h-32 border-l-2 border-primary/30">
                  {step.output}
                </pre>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
