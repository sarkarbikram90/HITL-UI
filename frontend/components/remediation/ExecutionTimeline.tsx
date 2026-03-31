"use client";

import * as React from "react";
import { useExecutionSteps } from "@/hooks/use-incidents-api";
import { CheckCircle2, Circle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExecutionTimeline({ incidentId }: { incidentId: string }) {
  const { data: steps, isLoading } = useExecutionSteps(incidentId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-4 animate-pulse">
        <div className="h-5 w-5 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 rounded bg-gray-200" />
          <div className="h-3 w-2/3 rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (!steps || steps.length === 0) {
    return (
      <div className="py-3 text-xs text-gray-400 italic">
        No execution steps recorded yet.
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white border border-gray-100 p-4">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-4">
        Execution Progress
      </h4>
      <div className="relative space-y-4 ml-1">
        {/* Vertical connector */}
        <div className="absolute left-[9px] top-3 bottom-3 w-px bg-gray-200" />

        {steps.map((step) => (
          <div key={step.id} className="relative flex items-start gap-3">
            <div
              className={cn(
                "relative z-10 flex h-5 w-5 items-center justify-center rounded-full bg-white",
                step.status === "Success" && "ring-2 ring-emerald-200",
                step.status === "Failed" && "ring-2 ring-red-200",
                step.status === "Pending" && "ring-2 ring-blue-200"
              )}
            >
              {step.status === "Success" && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
              {step.status === "Failed" && <XCircle className="h-3.5 w-3.5 text-red-600" />}
              {step.status === "Pending" && <Loader2 className="h-3.5 w-3.5 text-blue-600 animate-spin" />}
              {step.status !== "Success" && step.status !== "Failed" && step.status !== "Pending" && (
                <Circle className="h-2 w-2 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0 -mt-0.5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-gray-800 truncate">{step.stepName}</p>
                <span className="text-[10px] font-mono text-gray-400 tabular-nums shrink-0">
                  {new Date(step.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <code className="mt-1.5 block text-[11px] px-2.5 py-1.5 bg-gray-900 rounded-md font-mono text-gray-200 overflow-x-auto">
                $ {step.command}
              </code>
              {step.output && (
                <pre className="mt-1.5 text-[10px] px-2.5 py-2 bg-gray-50 rounded-md text-gray-600 overflow-x-auto max-h-24 border-l-2 border-blue-200 font-mono">
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
