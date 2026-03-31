"use client";

import * as React from "react";
import { Check, Pencil, X, Play, RefreshCcw } from "lucide-react";
import type { IncidentRemediation } from "@/types/incident-remediation";
import { cn } from "@/lib/utils";

function ActionBtn({
  children,
  onClick,
  disabled,
  variant,
  className,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  variant: "accept" | "modify" | "reject" | "execute" | "retry";
  className?: string;
}) {
  const styles = {
    accept:
      "text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800",
    modify:
      "text-gray-600 hover:bg-gray-100 hover:text-gray-800",
    reject:
      "text-red-600 hover:bg-red-50 hover:text-red-700",
    execute:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    retry:
      "text-blue-600 hover:bg-blue-50 hover:text-blue-700",
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors duration-100 cursor-pointer",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
        styles[variant],
        className
      )}
    >
      {children}
    </button>
  );
}

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
    <div className="flex items-center gap-1">
      {isPending && (
        <>
          <ActionBtn
            variant="accept"
            disabled={disabled}
            onClick={() => onAccept(row.incidentId)}
          >
            <Check className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Accept</span>
          </ActionBtn>
          <ActionBtn
            variant="modify"
            disabled={disabled}
            onClick={() => onModify(row)}
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Modify</span>
          </ActionBtn>
          <ActionBtn
            variant="reject"
            disabled={disabled}
            onClick={() => onReject(row.incidentId)}
          >
            <X className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Reject</span>
          </ActionBtn>
        </>
      )}

      {isApproved && onExecute && (
        <ActionBtn
          variant="execute"
          disabled={disabled}
          onClick={() => onExecute(row.incidentId)}
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          Execute
        </ActionBtn>
      )}

      {isFailed && (
        <ActionBtn
          variant="retry"
          disabled={disabled}
          onClick={() => onModify(row)}
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Retry
        </ActionBtn>
      )}
    </div>
  );
}
