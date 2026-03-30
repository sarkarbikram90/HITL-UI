"use client";

import * as React from "react";
import { Check, Pencil, X, Play, RefreshCcw } from "lucide-react";
import type { IncidentRemediation } from "@/types/incident-remediation";

export function ActionButtons({
  row,
  onAccept,
  onModify,
  onReject,
  onExecute,
  disabled,
}: {
  row: IncidentRemediation;
  onAccept: (id: string) => void;
  onModify: (row: IncidentRemediation) => void;
  onReject: (id: string) => void;
  onExecute?: (id: string) => void;
  disabled?: boolean;
}) {
  const isPending = row.status === "Pending";
  const isApproved = row.status === "Approved" || row.status === "Modified";
  const isFailed = row.status === "Failed";

  return (
    <div className="flex items-center gap-2">
      {isPending && (
        <>
          <button
            type="button"
            disabled={disabled}
            onClick={(e) => { e.stopPropagation(); onAccept(row.incidentId); }}
            className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="h-3.5 w-3.5" />
            Accept
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={(e) => { e.stopPropagation(); onModify(row); }}
            className="inline-flex items-center gap-1.5 rounded-md bg-gray-50 px-2.5 py-1.5 text-xs font-medium text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Pencil className="h-3.5 w-3.5" />
            Modify
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={(e) => { e.stopPropagation(); onReject(row.incidentId); }}
            className="inline-flex items-center gap-1.5 rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="h-3.5 w-3.5" />
            Reject
          </button>
        </>
      )}

      {isApproved && onExecute && (
        <button
          type="button"
          disabled={disabled}
          onClick={(e) => { e.stopPropagation(); onExecute(row.incidentId); }}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          Execute
        </button>
      )}

      {isFailed && (
        <button
          type="button"
          disabled={disabled}
          onClick={(e) => { e.stopPropagation(); onModify(row); }}
          className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Retry
        </button>
      )}
    </div>
  );
}
