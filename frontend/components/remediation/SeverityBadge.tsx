import * as React from "react";
import type { Severity } from "@/types/incident-remediation";
import { cn } from "@/lib/utils";

const severityConfig: Record<Severity, { dot: string; badge: string }> = {
  Low: {
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700",
  },
  Medium: {
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700",
  },
  High: {
    dot: "bg-orange-500",
    badge: "bg-orange-50 text-orange-700",
  },
  Critical: {
    dot: "bg-red-500",
    badge: "bg-red-50 text-red-700",
  },
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const config = severityConfig[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none",
        config.badge
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {severity}
    </span>
  );
}
