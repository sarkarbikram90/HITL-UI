"use client";

import { useAuditLogs } from "@/hooks/use-incidents-api";

export function AuditLogPanel() {
  const { data: entries, isLoading } = useAuditLogs();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-card)] p-10 text-center text-sm text-[var(--color-muted-foreground)] glass">
        <p className="font-medium text-[var(--color-foreground)]">
          No audit events yet
        </p>
        <p className="mt-2 max-w-md mx-auto">
          Centralized audit logs will appear here as incidents are processed and decisions are made.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] glass">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/60">
          <tr>
            <th className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
              Time
            </th>
            <th className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
              Actor
            </th>
            <th className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
              Action
            </th>
            <th className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
              Incident
            </th>
            <th className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
              Detail
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {entries.map((e) => (
            <tr
              key={e.id}
              className="hover:bg-[var(--color-muted)]/30 transition-colors"
            >
              <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-[var(--color-muted-foreground)]">
                {new Date(e.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-2 font-medium">{e.actor}</td>
              <td className="px-4 py-2">
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-primary/10 text-primary border border-primary/20">
                  {e.action}
                </span>
              </td>
              <td className="px-4 py-2 font-mono text-xs text-primary">{e.incidentId}</td>
              <td className="px-4 py-2 text-xs text-[var(--color-muted-foreground)] max-w-sm">
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
