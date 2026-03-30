import * as React from "react";
import type { Status } from "@/types/incident-remediation";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusStyles: Record<Status, string> = {
  Pending: "border-slate-500 bg-slate-500/10 text-slate-300",
  Approved: "border-emerald-500 bg-emerald-500/10 text-emerald-400",
  Rejected: "border-red-500 bg-red-500/10 text-red-400",
  Modified: "border-amber-500 bg-amber-500/10 text-amber-400",
  Executing: "border-blue-500 bg-blue-500/10 text-blue-400 animate-pulse",
  Completed: "border-emerald-400 bg-emerald-400/20 text-emerald-300 border-2",
  Failed: "border-rose-600 bg-rose-600/10 text-rose-400",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge
      variant="outline"
      className={cn("font-medium px-2 py-0.5 whitespace-nowrap", statusStyles[status])}
    >
      {status}
    </Badge>
  );
}
