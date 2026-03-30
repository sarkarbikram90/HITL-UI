"use client";

import * as React from "react";
import { Check, Pencil, X, Play, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <div className="flex flex-wrap items-center gap-2">
      {isPending && (
        <>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 glass"
            disabled={disabled}
            onClick={(e) => { e.stopPropagation(); onAccept(row.incidentId); }}
          >
            <Check className="mr-1 h-3.5 w-3.5" />
            Accept
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 glass"
            disabled={disabled}
            onClick={(e) => { e.stopPropagation(); onModify(row); }}
          >
            <Pencil className="mr-1 h-3.5 w-3.5" />
            Modify
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 glass"
            disabled={disabled}
            onClick={(e) => { e.stopPropagation(); onReject(row.incidentId); }}
          >
            <X className="mr-1 h-3.5 w-3.5" />
            Reject
          </Button>
        </>
      )}

      {isApproved && onExecute && (
        <Button
          type="button"
          size="sm"
          className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(var(--color-primary),0.3)]"
          disabled={disabled}
          onClick={(e) => { e.stopPropagation(); onExecute && onExecute(row.incidentId); }}
        >
          <Play className="mr-1 h-3.5 w-3.5 fill-current" />
          Execute
        </Button>
      )}

      {isFailed && (
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 glass"
          disabled={disabled}
          onClick={(e) => { e.stopPropagation(); onModify(row); }}
        >
          <RefreshCcw className="mr-1 h-3.5 w-3.5" />
          Retry
        </Button>
      )}
    </div>
  );
}
