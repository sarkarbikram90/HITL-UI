"use client";

import { useAuditLogs } from "@/hooks/use-incidents-api";

export function AuditLogPanel() {
  const { data: entries, isLoading } = useAuditLogs();

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-sm text-gray-600">
        <p className="font-medium text-gray-900">
          No audit events yet
        </p>
        <p className="mt-2 max-w-md mx-auto">
          Centralized audit logs will appear here as incidents are processed and decisions are made.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-900">
              Time
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-900">
              Actor
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-900">
              Action
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-900">
              Incident
            </th>
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-900">
              Detail
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {entries.map((e) => (
            <tr
              key={e.id}
              className="hover:bg-blue-50 transition-colors"
            >
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-600">
                {new Date(e.createdAt).toLocaleString()}
              </td>
              <td className="px-4 py-3 font-medium text-gray-900">{e.actor}</td>
              <td className="px-4 py-3">
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {e.action}
                </span>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-blue-600">{e.incidentId}</td>
              <td className="px-4 py-3 text-xs text-gray-600 max-w-sm">
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
