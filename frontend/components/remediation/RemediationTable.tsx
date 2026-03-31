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
        size: 40,
        cell: ({ row }) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleRow(row.original.incidentId);
            }}
            className="inline-flex items-center justify-center w-7 h-7 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-100"
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
        size: 110,
        cell: ({ row }) => <SeverityBadge severity={row.original.severity} />,
      },
      {
        id: "incidentId",
        accessorKey: "incidentId",
        header: "ID",
        size: 100,
        cell: ({ row }) => (
          <span className="font-mono text-xs font-medium text-blue-600 hover:text-blue-700 cursor-pointer hover:underline decoration-blue-300 underline-offset-2">
            {row.original.incidentId}
          </span>
        ),
      },
      {
        id: "anomalyName",
        accessorKey: "anomalyName",
        header: "Anomaly",
        cell: ({ row }) => (
          <div
            className="max-w-[220px] truncate text-sm font-medium text-gray-900"
            title={row.original.anomalyName}
          >
            {row.original.anomalyName}
          </div>
        ),
      },
      {
        id: "resource",
        accessorKey: "resource",
        header: "Resource",
        size: 130,
        cell: ({ row }) => (
          <span className="inline-flex items-center rounded-md bg-gray-100/80 px-2 py-0.5 text-xs font-medium text-gray-600">
            {row.original.resource}
          </span>
        ),
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: "Date",
        size: 140,
        cell: ({ row }) => {
          const d = row.original.createdAt ? new Date(row.original.createdAt) : null;
          const txt = d
            ? `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
                d.getUTCDate()
              ).padStart(2, "0")} ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`
            : "-";
          return <span className="text-xs text-gray-400 font-mono tabular-nums">{txt}</span>;
        },
      },
      {
        id: "proposedCommand",
        accessorKey: "proposedCommand",
        header: "Command",
        cell: ({ row }) => (
          <code className="inline-block max-w-[200px] truncate rounded-md bg-gray-50 px-2 py-1 text-[11px] text-gray-600 font-mono">
            {row.original.proposedCommand || "—"}
          </code>
        ),
      },
      {
        id: "status",
        accessorKey: "status",
        header: "Status",
        size: 120,
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "",
        size: 180,
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
    <div className="flex flex-col rounded-xl bg-white shadow-sm shadow-gray-200/60 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-gray-100">
                {hg.headers.map((h) => (
                  <th
                    key={h.id}
                    className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-gray-400 bg-gray-50/50"
                    style={h.column.getSize() ? { width: h.column.getSize() } : undefined}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    <span className="text-sm text-gray-400">Analyzing system status…</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-3xl">✓</div>
                    <span className="text-sm font-medium text-gray-500">No incidents requiring attention</span>
                    <span className="text-xs text-gray-400">All clear — systems are healthy</span>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, idx) => (
                <React.Fragment key={row.id}>
                  <tr
                    onClick={() => onRowClick && onRowClick(row.original)}
                    className={cn(
                      "cursor-pointer transition-colors duration-100 group",
                      expandedRows.has(row.original.incidentId)
                        ? "bg-blue-50/40"
                        : "hover:bg-gray-50/80",
                      idx > 0 && "border-t border-gray-50"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3.5 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {expandedRows.has(row.original.incidentId) && (
                    <tr className="bg-gray-50/50">
                      <td colSpan={columns.length}>
                        <div className="px-4 py-4">
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
