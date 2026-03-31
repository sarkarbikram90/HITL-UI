"use client";

import * as React from "react";
import { X, Clipboard, Check, ShieldAlert, Pencil, Eye } from "lucide-react";
import type { IncidentRemediation } from "@/types/incident-remediation";
import { SeverityBadge } from "@/components/remediation/SeverityBadge";
import { StatusBadge } from "@/components/remediation/StatusBadge";
import { cn } from "@/lib/utils";

const panelTitle: Record<string, { label: string; icon: typeof Check; color: string }> = {
  approve: { label: "Approve Incident", icon: Check, color: "text-emerald-600" },
  reject: { label: "Reject Incident", icon: ShieldAlert, color: "text-red-600" },
  modify: { label: "Modify Incident", icon: Pencil, color: "text-blue-600" },
  view: { label: "Incident Details", icon: Eye, color: "text-gray-600" },
};

export default function IncidentPanel({
  open,
  onOpenChange,
  incident,
  actionType,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  incident: IncidentRemediation | null;
  actionType: "approve" | "reject" | "modify" | "view" | null;
  onConfirm: (payload?: {
    incidentId: string;
    status?: "Approved" | "Rejected" | "Modified" | "Executing" | "Pending";
    proposedCommand?: string;
    reason?: string;
    comments?: string;
  }) => void;
}) {
  const [rejectReason, setRejectReason] = React.useState("");
  const [comments, setComments] = React.useState("");
  const [modifiedCommand, setModifiedCommand] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
  const fileRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (incident) {
      setModifiedCommand(incident.proposedCommand || "");
      setRejectReason("");
      setComments("");
      setCopied(false);
      setSelectedFile(null);
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 250);
      return () => clearTimeout(t);
    }
    return;
  }, [incident]);

  if (!open) return null;

  const titleConfig = panelTitle[actionType ?? "view"];
  const TitleIcon = titleConfig.icon;

  const confirmLabel =
    actionType === "approve"
      ? "Approve & Dispatch"
      : actionType === "reject"
        ? "Confirm Rejection"
        : actionType === "modify"
          ? "Save Changes"
          : "Close";

  const confirmStyle =
    actionType === "approve"
      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
      : actionType === "reject"
        ? "bg-red-600 hover:bg-red-700 text-white"
        : actionType === "modify"
          ? "bg-blue-600 hover:bg-blue-700 text-white"
          : "bg-gray-100 hover:bg-gray-200 text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      <aside className="relative ml-auto h-full w-[440px] max-w-full bg-white shadow-2xl overflow-y-auto flex flex-col animate-in slide-in-from-right-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className={cn("p-1.5 rounded-lg bg-gray-50", titleConfig.color)}>
              <TitleIcon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-gray-900">
                {titleConfig.label}
              </h3>
              <p className="text-xs text-gray-400 truncate max-w-[280px]">
                {incident?.anomalyName}
              </p>
            </div>
          </div>
          <button
            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors duration-100"
            onClick={() => onOpenChange(false)}
            aria-label="Close panel"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {loading ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-4 w-1/3 rounded bg-gray-100" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-10 rounded-lg bg-gray-100" />
                <div className="h-10 rounded-lg bg-gray-100" />
                <div className="h-10 rounded-lg bg-gray-100" />
                <div className="h-10 rounded-lg bg-gray-100" />
              </div>
              <div className="h-28 rounded-lg bg-gray-100" />
            </div>
          ) : incident ? (
            <>
              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Resource", value: incident.resource },
                  { label: "Category", value: incident.category },
                  {
                    label: "Severity",
                    value: <SeverityBadge severity={incident.severity} />,
                  },
                  { label: "Confidence", value: `${incident.confidence}%` },
                  {
                    label: "Created",
                    value: incident.createdAt
                      ? new Date(incident.createdAt).toLocaleString()
                      : "-",
                    mono: true,
                  },
                  {
                    label: "Status",
                    value: <StatusBadge status={incident.status} />,
                  },
                ].map((item, i) => (
                  <div key={i} className="rounded-lg bg-gray-50/80 px-3 py-2.5">
                    <div className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-1">
                      {item.label}
                    </div>
                    <div
                      className={cn(
                        "text-sm text-gray-900",
                        "mono" in item && item.mono && "font-mono text-xs"
                      )}
                    >
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Description
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {(incident as IncidentRemediation & { description?: string }).description || "No description available."}
                </p>
              </section>

              {/* RCA */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  RCA & Logs
                </h4>
                <p className="text-sm text-gray-600">Short RCA summary placeholder.</p>
                <button className="mt-2 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors duration-100">
                  View Logs
                </button>
              </section>

              {/* Proposed Command */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Proposed Command
                </h4>
                <div className="relative rounded-lg bg-gray-900 p-3.5 overflow-hidden">
                  <code className="block whitespace-pre-wrap text-xs font-mono text-gray-100 leading-relaxed">
                    {incident.proposedCommand || "N/A"}
                  </code>
                  <button
                    className="absolute right-2 top-2 p-1.5 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors duration-100 text-gray-400 hover:text-gray-200"
                    onClick={async () => {
                      try {
                        await navigator.clipboard?.writeText(incident.proposedCommand || "");
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1200);
                      } catch {
                        setCopied(false);
                      }
                    }}
                    title="Copy command"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Clipboard className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </section>

              {/* VPC Check */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  VPC / Firewall Check
                </h4>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Pass
                  </span>
                  <span className="text-xs text-gray-500">Instance: {incident.resource}</span>
                </div>
              </section>

              {/* Reject form */}
              {actionType === "reject" && (
                <section className="space-y-3 rounded-lg border border-red-100 bg-red-50/30 p-3.5">
                  <label className="text-xs font-semibold text-gray-700">Reason for rejection</label>
                  <select
                    className="w-full h-9 px-3 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 transition-colors duration-100"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  >
                    <option value="">Select reason</option>
                    <option value="false-positive">False positive</option>
                    <option value="not-actionable">Not actionable</option>
                    <option value="needs-info">Needs more info</option>
                  </select>
                  <textarea
                    className="w-full h-20 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 resize-none transition-colors duration-100"
                    placeholder="Comments (optional)"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </section>
              )}

              {/* Modify form */}
              {actionType === "modify" && (
                <section className="space-y-3 rounded-lg border border-blue-100 bg-blue-50/30 p-3.5">
                  <label className="text-xs font-semibold text-gray-700">Edit command</label>
                  <textarea
                    className="w-full h-24 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg font-mono text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400/20 resize-none transition-colors duration-100"
                    value={modifiedCommand}
                    onChange={(e) => setModifiedCommand(e.target.value)}
                  />
                </section>
              )}

              {/* Attachments */}
              <section>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                  Attachments
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    ref={(el) => { fileRef.current = el; }}
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      setSelectedFile(f ? f.name : null);
                    }}
                  />
                  <button
                    className="px-3 py-1.5 rounded-md bg-gray-50 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors duration-100"
                    onClick={() => fileRef.current?.click()}
                  >
                    Upload file
                  </button>
                  <span className="text-xs text-gray-400">{selectedFile ?? "No file"}</span>
                </div>
              </section>
            </>
          ) : null}
        </div>

        {/* Footer - sticky */}
        <div className="border-t border-gray-100 bg-white px-5 py-3.5">
          <div className="flex items-center gap-2">
            <button
              className="flex-1 h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors duration-100"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              className={cn(
                "flex-1 h-9 px-3 rounded-lg text-sm font-medium transition-colors duration-100",
                confirmStyle
              )}
              onClick={() => {
                if (!incident) return;
                if (actionType === "reject")
                  onConfirm({
                    incidentId: incident.incidentId,
                    status: "Rejected",
                    reason: rejectReason,
                    comments,
                  });
                else if (actionType === "modify")
                  onConfirm({
                    incidentId: incident.incidentId,
                    status: "Modified",
                    proposedCommand: modifiedCommand,
                  });
                else if (actionType === "approve")
                  onConfirm({ incidentId: incident.incidentId, status: "Approved" });
                else onOpenChange(false);
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
