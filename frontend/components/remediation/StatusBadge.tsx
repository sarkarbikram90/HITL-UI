import * as React from "react";
import type { Status } from "@/types/incident-remediation";
import { cn } from "@/lib/utils";
import {
  Clock,
  CheckCircle2,
  XCircle,
  Pencil,
  Loader2,
  CircleCheck,
  AlertTriangle,
} from "lucide-react";

const statusConfig: Record<Status, { icon: typeof Clock; style: string; iconStyle: string }> = {
  Pending: {
    icon: Clock,
    style: "bg-amber-50 text-amber-700",
    iconStyle: "text-amber-500",
  },
  Approved: {
    icon: CheckCircle2,
    style: "bg-emerald-50 text-emerald-700",
    iconStyle: "text-emerald-500",
  },
  Rejected: {
    icon: XCircle,
    style: "bg-red-50 text-red-700",
    iconStyle: "text-red-500",
  },
  Modified: {
    icon: Pencil,
    style: "bg-blue-50 text-blue-700",
    iconStyle: "text-blue-500",
  },
  Executing: {
    icon: Loader2,
    style: "bg-violet-50 text-violet-700",
    iconStyle: "text-violet-500 animate-spin",
  },
  Completed: {
    icon: CircleCheck,
    style: "bg-emerald-50 text-emerald-700",
    iconStyle: "text-emerald-600",
  },
  Failed: {
    icon: AlertTriangle,
    style: "bg-red-50 text-red-700",
    iconStyle: "text-red-500",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none whitespace-nowrap",
        config.style
      )}
    >
      <Icon className={cn("h-3 w-3", config.iconStyle)} />
      {status}
    </span>
  );
}
