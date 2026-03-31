"use client";

import * as React from "react";
import { Check, Pencil, X, Play, RefreshCcw } from "lucide-react";
import type { IncidentRemediation } from "@/types/incident-remediation";
import { cn } from "@/lib/utils";

function ActionBtn({
  onClick,
  disabled,
  variant,
  icon: Icon,
  label,
}: {
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  variant: "accept" | "modify" | "reject" | "execute" | "retry";
  icon: typeof Check;
  label: string;
}) {
  const styles = {
    accept: "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700",
    modify: "text-gray-500 hover:bg-gray-100 hover:text-gray-700",
    reject: "text-red-500 hover:bg-red-50 hover:text-red-600",
    execute: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    retry: "text-blue-600 hover:bg-blue-50 hover:text-blue-700",
  };

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      className={cn(
        "inline-flex items-center justify-center w-7 h-7 rounded-md transition-colors duration-100 cursor-pointer",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none",
        styles[variant]
      )}
    >
      <Icon className="h-3.5 w-3.5" />
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
    <div className="flex items-center gap-0.5 whitespace-nowrap">
      {isPending && (
        <>
          <ActionBtn
            variant="accept"
            icon={Check}
            label="Accept remediation"
            disabled={disabled}
            onClick={() => onAccept(row.incidentId)}
          />
          <ActionBtn
            variant="modify"
            icon={Pencil}
            label="Modify command"
            disabled={disabled}
            onClick={() => onModify(row)}
          />
          <ActionBtn
            variant="reject"
            icon={X}
            label="Reject action"
            disabled={disabled}
            onClick={() => onReject(row.incidentId)}
          />
        </>
      )}

      {isApproved && onExecute && (
        <button
          type="button"
          title="Execute remediation"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation();
            onExecute(row.incidentId);
          }}
          className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-blue-700 shadow-sm transition-colors duration-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Play className="h-3 w-3 fill-current" />
          Run
        </button>
      )}

      {isFailed && (
        <ActionBtn
          variant="retry"
          icon={RefreshCcw}
          label="Retry execution"
          disabled={disabled}
          onClick={() => onModify(row)}
        />
      )}
    </div>
  );
}
