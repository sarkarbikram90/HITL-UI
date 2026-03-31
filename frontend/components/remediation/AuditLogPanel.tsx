"use client";

import { useAuditLogs } from "@/hooks/use-incidents-api";
import { cn } from "@/lib/utils";

const actionColors: Record<string, string> = {
  APPROVE: "bg-emerald-50 text-emerald-700",
  REJECT: "bg-red-50 text-red-700",
  MODIFY: "bg-blue-50 text-blue-700",
  EXECUTE: "bg-violet-50 text-violet-700",
  CREATE: "bg-gray-100 text-gray-600",
};

function getActionStyle(action: string): string {
  const key = action.toUpperCase();
  return actionColors[key] ?? "bg-gray-100 text-gray-600";
}

export function AuditLogPanel() {
  const { data: entries, isLoading } = useAuditLogs();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
        <div className="text-2xl mb-3">📋</div>
        <p className="text-sm font-medium text-gray-700">No audit events yet</p>
        <p className="mt-1.5 text-xs text-gray-400 max-w-sm mx-auto">
          Audit logs will appear here as incidents are processed and decisions are made.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm shadow-gray-200/60">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Time
            </th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Actor
            </th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Action
            </th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Incident
            </th>
            <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Detail
            </th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e, idx) => (
            <tr
              key={e.id}
              className={cn(
                "hover:bg-gray-50/80 transition-colors duration-100",
                idx > 0 && "border-t border-gray-50"
              )}
            >
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-400 tabular-nums">
                {new Date(e.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-3 text-sm font-medium text-gray-800">{e.actor}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase font-semibold leading-none",
                    getActionStyle(e.action)
                  )}
                >
                  {e.action}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-blue-600 hover:underline cursor-pointer decoration-blue-300 underline-offset-2">
                {e.incidentId}
              </td>
              <td className="px-4 py-3 text-xs text-gray-500 max-w-sm">
                <div className="line-clamp-2" title={e.details}>
                  {e.details}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
