"use client";

import * as React from "react";
import { useExecutionSteps } from "@/hooks/use-incidents-api";
import { CheckCircle2, Circle, XCircle, Loader2 } from "lucide-react";

export function ExecutionTimeline({ incidentId }: { incidentId: string }) {
  const { data: steps, isLoading } = useExecutionSteps(incidentId);

  if (isLoading) {
    return (
      <div className="flex animate-pulse space-x-4 p-4">
        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
        <div className="flex-1 space-y-4 py-1">
          <div className="h-4 rounded bg-gray-200"></div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 h-4 rounded bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!steps || steps.length === 0) {
    return (
      <div className="p-4 text-sm text-gray-600 italic">
        No execution steps recorded yet.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200 m-2">
      <h4 className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-4">Execution Progress</h4>
      <div className="relative space-y-6 left-2">
        {/* Vertical Line */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-300" />

        {steps.map((step) => (
          <div key={step.id} className="relative flex items-start gap-4">
            <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-gray-300 shadow-sm">
              {step.status === "Success" && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
              {step.status === "Failed" && <XCircle className="h-4 w-4 text-red-600" />}
              {step.status === "Pending" && <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />}
              {/* Fallback for unexpected statuses */}
              {step.status !== "Success" && step.status !== "Failed" && step.status !== "Pending" && (
                <Circle className="h-2 w-2 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900 truncate">{step.stepName}</p>
                <span className="text-[10px] font-mono text-gray-600">
                  {new Date(step.createdAt).toLocaleTimeString()}
                </span>
              </div>
              <code className="mt-1 block text-xs p-1.5 bg-gray-100 rounded border border-gray-300 font-mono text-blue-700 overflow-x-auto">
                $ {step.command}
              </code>
              {step.output && (
                <pre className="mt-2 text-[10px] p-2 bg-gray-100 rounded text-gray-700 overflow-x-auto max-h-32 border-l-2 border-blue-300 font-mono">
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
