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
import { Badge } from "@/components/ui/badge";
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
            className="p-1 hover:bg-muted/50 rounded transition-colors"
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
          <span className="font-mono text-xs font-bold text-primary">{row.original.incidentId}</span>
        ),
      },
      {
        id: "anomalyName",
        accessorKey: "anomalyName",
        header: "Anomaly",
        cell: ({ row }) => (
            <div className="max-w-[150px] truncate font-medium" title={row.original.anomalyName}>
                {row.original.anomalyName}
            </div>
        ),
      },
      {
        id: "resource",
        accessorKey: "resource",
        header: "Resource",
        cell: ({ row }) => <Badge variant="outline" className="glass text-[10px]">{row.original.resource}</Badge>,
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
          return <span className="text-xs text-muted-foreground font-mono">{txt}</span>;
        },
      },
      {
        id: "proposedCommand",
        accessorKey: "proposedCommand",
        header: "Proposed Command",
        cell: ({ row }) => (
          <code className="block max-w-[200px] truncate p-1 bg-black/30 rounded border border-white/5 text-[10px] text-emerald-500 font-mono">
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
    <div className="flex flex-col glass rounded-xl border border-[var(--color-border)] overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id} className="border-b border-[var(--color-border)]">
                {hg.headers.map((h) => (
                  <th key={h.id} className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--color-muted-foreground)] sticky top-0 z-10 bg-[var(--color-muted)]/60">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {isLoading ? (
              <tr><td colSpan={columns.length} className="px-4 py-20 text-center animate-pulse">Analyzing system status...</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={columns.length} className="px-4 py-20 text-center text-muted-foreground italic">No incidents requiring attention.</td></tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <tr
                    onClick={() => onRowClick && onRowClick(row.original)}
                    className={cn("cursor-pointer transition-colors hover:bg-primary/5", expandedRows.has(row.original.incidentId) && "bg-primary/5")}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-middle">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                  {expandedRows.has(row.original.incidentId) && (
                    <tr className="bg-muted/10 border-b border-[var(--color-border)]">
                      <td colSpan={columns.length}>
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
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
