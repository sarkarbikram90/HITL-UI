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

/* ──────────────────────────────────────────────────────────────
   Column width budget (targeting 1280px viewport)
   Sidebar ~208px  +  padding ~40px  =  ~1032px available

   expander:    36px
   severity:    88px
   id:          72px
   anomaly:    flex (fills remaining)
   resource:   120px
   date:       120px   (hidden < lg)
   command:    150px   (hidden < lg)
   status:     100px
   actions:     96px
   ──────────────────────────────────────────────────────────── */

const COL_WIDTHS = {
  expander: "w-[36px]",
  severity: "w-[88px]",
  id: "w-[72px]",
  anomaly: "", // flex
  resource: "w-[120px]",
  date: "w-[120px]",
  command: "w-[150px]",
  status: "w-[100px]",
  actions: "w-[96px]",
} as const;

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
            onClick={(e) => {
              e.stopPropagation();
              toggleRow(row.original.incidentId);
            }}
            className="inline-flex items-center justify-center w-6 h-6 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-100"
          >
            {expandedRows.has(row.original.incidentId) ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
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
          <span
            className="font-mono text-[11px] font-medium text-blue-600 hover:text-blue-700 cursor-pointer hover:underline decoration-blue-300 underline-offset-2"
            title={row.original.incidentId}
          >
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
            className="truncate text-sm font-medium text-gray-900"
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
        cell: ({ row }) => (
          <span
            className="inline-block max-w-full truncate rounded bg-gray-100/80 px-1.5 py-0.5 text-[11px] font-medium text-gray-600"
            title={row.original.resource}
          >
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
          const txt = d
            ? `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(
                d.getUTCDate()
              ).padStart(2, "0")} ${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`
            : "—";
          return (
            <span
              className="text-[11px] text-gray-400 font-mono tabular-nums"
              title={d ? d.toUTCString() : undefined}
            >
              {txt}
            </span>
          );
        },
      },
      {
        id: "proposedCommand",
        accessorKey: "proposedCommand",
        header: "Command",
        cell: ({ row }) => (
          <code
            className="inline-block max-w-full truncate rounded bg-gray-50 px-1.5 py-0.5 text-[10px] text-gray-500 font-mono"
            title={row.original.proposedCommand || undefined}
          >
            {row.original.proposedCommand || "—"}
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
        header: () => null,
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

  // Map column id → fixed width class
  const colWidthMap: Record<string, string> = {
    expander: COL_WIDTHS.expander,
    severity: COL_WIDTHS.severity,
    incidentId: COL_WIDTHS.id,
    anomalyName: COL_WIDTHS.anomaly,
    resource: COL_WIDTHS.resource,
    createdAt: COL_WIDTHS.date,
    proposedCommand: COL_WIDTHS.command,
    status: COL_WIDTHS.status,
    actions: COL_WIDTHS.actions,
  };

  // Responsive visibility: hide date & command < lg
  const colHideMap: Record<string, string> = {
    createdAt: "hidden lg:table-cell",
    proposedCommand: "hidden lg:table-cell",
  };

  return (
    <div className="flex flex-col rounded-xl bg-white shadow-sm shadow-gray-200/60 overflow-hidden">
      <table className="w-full table-fixed text-left text-sm">
        {/* Colgroup enforces widths on table-fixed */}
        <colgroup>
          {table.getAllColumns().map((col) => {
            const w = colWidthMap[col.id];
            const hide = colHideMap[col.id] ?? "";
            return (
              <col
                key={col.id}
                className={cn(w, hide)}
              />
            );
          })}
        </colgroup>

        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-gray-100">
              {hg.headers.map((h) => {
                const hide = colHideMap[h.column.id] ?? "";
                return (
                  <th
                    key={h.id}
                    className={cn(
                      "px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 bg-gray-50/50",
                      hide
                    )}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-14 text-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                  <span className="text-sm text-gray-400">Analyzing system status…</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-14 text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-2xl">✓</div>
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
                  {row.getVisibleCells().map((cell) => {
                    const hide = colHideMap[cell.column.id] ?? "";
                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          "px-3 py-2.5 align-middle overflow-hidden",
                          hide
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
                {expandedRows.has(row.original.incidentId) && (
                  <tr className="bg-gray-50/50">
                    <td colSpan={columns.length}>
                      <div className="px-3 py-3">
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
  );
}
