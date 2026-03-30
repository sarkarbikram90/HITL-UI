"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronRight, ChevronDown } from "lucide-react";
import type { IncidentRemediation, SortField } from "@/types/incident-remediation";
import { SeverityBadge } from "@/components/remediation/SeverityBadge";
import { StatusBadge } from "@/components/remediation/StatusBadge";
import { ActionButtons } from "@/components/remediation/ActionButtons";
import { ExecutionTimeline } from "@/components/remediation/ExecutionTimeline";
import { cn } from "@/lib/utils";

export function RemediationTable({
  data,
  total: _total,
  page: _page,
  pageSize: _pageSize,
  sortBy,
  sortDir,
  isLoading,
  onPageChange: _onPageChange,
  onSortChange: _onSortChange,
  onAccept,
  onModify,
  onReject,
  onExecute,
  mutationPending,
  onRowClick,
}: {
  data: IncidentRemediation[];
  total: number;
  page: number;
  pageSize: number;
  sortBy: SortField;
  sortDir: "asc" | "desc";
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onSortChange: (field: SortField, dir: "asc" | "desc") => void;
  onAccept: (id: string) => void;
  onModify: (row: IncidentRemediation) => void;
  onReject: (id: string) => void;
  onExecute?: (id: string) => void;
  mutationPending?: boolean;
  onRowClick?: (row: IncidentRemediation) => void;
}) {
  const [expandedRows, setExpandedRows] = React.useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const next = new Set(expandedRows);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedRows(next);
  };

  const sorting = React.useMemo<SortingState>(
    () => [{ id: sortBy, desc: sortDir === "desc" }],
    [sortBy, sortDir]
  );

  const columns = React.useMemo<ColumnDef<IncidentRemediation>[]>(
    () => [
      {
        id: "expander",
        header: () => null,
        cell: ({ row }) => (
          <button
            onClick={() => toggleRow(row.original.incidentId)}
            className="inline-flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded transition-colors text-gray-500 hover:text-gray-700"
          >
            {expandedRows.has(row.original.incidentId) ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        ),
      },
      {
        id: "severity",
        accessorKey: "severity",
        header: "Severity",
        cell: ({ row }) => <SeverityBadge severity={row.original.severity} />,
      },
      {
        id: "incidentId",
        accessorKey: "incidentId",
        header: "ID",
        cell: ({ row }) => (
          <span className="font-mono text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer hover:underline">{row.original.incidentId}</span>
        ),
      },
      {
        id: "anomalyName",
        accessorKey: "anomalyName",
        header: "Anomaly",
        cell: ({ row }) => (
            <div className="max-w-xs truncate text-sm font-medium text-gray-900" title={row.original.anomalyName}>
                {row.original.anomalyName}
            </div>
        ),
      },
      {
        id: "resource",
        accessorKey: "resource",
        header: "Resource",
        cell: ({ row }) => (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
            {row.original.resource}
          </span>
        ),
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
          const d = row.original.createdAt ? new Date(row.original.createdAt) : null;
          // format in UTC to keep tests deterministic across timezones
          const txt = d
            ? `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
                d.getUTCDate()
              ).padStart(2, "0")} ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`
            : "-";
          return <span className="text-xs text-gray-500 font-mono">{txt}</span>;
        },
      },
      {
        id: "proposedCommand",
        accessorKey: "proposedCommand",
        header: "Proposed Command",
        cell: ({ row }) => (
          <code className="inline-flex max-w-xs truncate px-2 py-1 bg-gray-100 rounded border border-gray-200 text-xs text-gray-700 font-mono">
            {row.original.proposedCommand || "N/A"}
          </code>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <ActionButtons
            row={row.original}
            onAccept={onAccept}
            onModify={onModify}
            onReject={onReject}
            onExecute={onExecute}
            disabled={mutationPending}
          />
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sortBy, sortDir, expandedRows, onAccept, onModify, onReject, onExecute, mutationPending]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-gray-200 bg-gray-50">
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-600 bg-gray-50">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 animate-pulse">Analyzing system status...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 italic">No incidents requiring attention.</td></tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr
                    onClick={() => onRowClick && onRowClick(row.original)}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-blue-50",
                      expandedRows.has(row.original.incidentId) && "bg-blue-50"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4 align-middle">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                  {expandedRows.has(row.original.incidentId) && (
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <td colSpan={columns.length}>
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300 p-6">
                          <ExecutionTimeline incidentId={row.original.incidentId} />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
