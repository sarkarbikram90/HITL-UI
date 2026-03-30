import * as React from "react";
import type { Severity } from "@/types/incident-remediation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const severityStyles: Record<
  Severity,
  string
> = {
  Low: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100",
  Medium:
    "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100",
  High: "border-orange-200 bg-orange-50 text-orange-950 dark:border-orange-900 dark:bg-orange-950/50 dark:text-orange-100",
  Critical:
    "border-red-200 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950/50 dark:text-red-100",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium capitalize", severityStyles[severity])}
    >
      {severity}
    </Badge>
  );
}
