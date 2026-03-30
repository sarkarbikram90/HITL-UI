import * as React from "react";
import type { Severity } from "@/types/incident-remediation";
import { cn } from "@/lib/utils";

const severityStyles: Record<Severity, string> = {
  Low: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Medium: "bg-amber-50 text-amber-700 border border-amber-200",
  High: "bg-orange-50 text-orange-700 border border-orange-200",
  Critical: "bg-red-50 text-red-700 border border-red-200",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", severityStyles[severity])}>
      {severity}
    </span>
  );
}
