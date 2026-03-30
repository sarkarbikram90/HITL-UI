import * as React from "react";
import type { Status } from "@/types/incident-remediation";
import { cn } from "@/lib/utils";

const statusStyles: Record<Status, string> = {
  Pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
  Approved: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Rejected: "bg-red-50 text-red-700 border border-red-200",
  Modified: "bg-blue-50 text-blue-700 border border-blue-200",
  Executing: "bg-blue-50 text-blue-700 border border-blue-200 animate-pulse",
  Completed: "bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold",
  Failed: "bg-red-50 text-red-700 border border-red-200",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", statusStyles[status])}>
      {status}
    </span>
  );
}
