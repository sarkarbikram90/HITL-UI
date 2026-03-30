"use client";

import * as React from "react";
import { X, Clipboard } from "lucide-react";
import type { IncidentRemediation } from "@/types/incident-remediation";

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
  onConfirm: (payload?: any) => void;
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
      // show a tiny loading skeleton to simulate async fetch
      setLoading(true);
      const t = setTimeout(() => setLoading(false), 250);
      return () => clearTimeout(t);
    }
    return;
  }, [incident]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => onOpenChange(false)}
      />
      <aside className="relative ml-auto h-full w-[420px] max-w-full bg-card/95 backdrop-blur-md shadow-2xl border-l border-[var(--color-border)] overflow-y-auto animate-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
          <div>
            <h3 className="text-lg font-bold tracking-tight">{actionType === "approve" ? "APPROVE INCIDENT" : actionType === "reject" ? "REJECT INCIDENT" : actionType === "modify" ? "MODIFY INCIDENT" : "INCIDENT DETAILS"}</h3>
            <p className="text-sm text-muted-foreground">{incident?.anomalyName}</p>
          </div>
          <button className="p-2" onClick={() => onOpenChange(false)} aria-label="Close panel">
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 w-1/2 rounded bg-zinc-700/40 animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-6 rounded bg-zinc-700/30 animate-pulse" />
                <div className="h-6 rounded bg-zinc-700/30 animate-pulse" />
                <div className="h-6 rounded bg-zinc-700/30 animate-pulse" />
                <div className="h-6 rounded bg-zinc-700/30 animate-pulse" />
              </div>
              <div className="h-36 rounded bg-zinc-700/30 animate-pulse" />
            </div>
          ) : incident ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">Resource</div>
                  <div className="font-medium">{incident.resource}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Category</div>
                  <div className="font-medium">{incident.category}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Severity</div>
                  <div className="font-medium">{incident.severity}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Confidence</div>
                  <div className="font-medium">{incident.confidence}%</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Date</div>
                  <div className="font-mono text-sm">{incident.createdAt ? new Date(incident.createdAt).toLocaleString() : "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="font-medium">{incident.status}</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold">Description</h4>
                <p className="text-sm text-muted-foreground">{(incident as any).description || "No description available."}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold">RCA & Logs</h4>
                <p className="text-sm text-muted-foreground">Short RCA summary placeholder.</p>
                <button className="mt-2 px-3 py-1 text-sm rounded bg-muted text-muted-foreground" onClick={() => { /* placeholder */ }}>
                  View Logs
                </button>
              </div>

              <div>
                <h4 className="text-sm font-semibold">Proposed Command</h4>
                <pre className="relative rounded bg-zinc-900 p-3 text-xs font-mono overflow-auto">
                  <code className="block whitespace-pre-wrap">{incident.proposedCommand || "N/A"}</code>
                  <button
                    className="absolute right-2 top-2 p-1 rounded bg-muted/40"
                    onClick={async () => {
                      try {
                        await navigator.clipboard?.writeText(incident.proposedCommand || "");
                        setCopied(true);
                        setTimeout(() => setCopied(false), 1200);
                      } catch (err) {
                        setCopied(false);
                      }
                    }}
                    title="Copy command"
                  >
                    <Clipboard className="h-4 w-4" />
                  </button>
                  {copied && <div className="absolute right-10 top-2 rounded bg-black/70 px-2 py-1 text-xs">Copied</div>}
                </pre>
              </div>

              <div>
                <h4 className="text-sm font-semibold">VPC / Firewall Check</h4>
                <div className="flex items-center gap-3">
                  <span className="inline-block rounded-full bg-emerald-600/20 px-2 py-1 text-xs">Pass</span>
                  <div className="text-sm text-muted-foreground">Instance: {incident.resource}</div>
                </div>
              </div>

              {actionType === "reject" && (
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Reason for rejection</label>
                  <select className="w-full p-2 bg-transparent border rounded" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}>
                    <option value="">Select reason</option>
                    <option value="false-positive">False positive</option>
                    <option value="not-actionable">Not actionable</option>
                    <option value="needs-info">Needs more info</option>
                  </select>
                  <textarea className="w-full p-2 bg-transparent border rounded" placeholder="Comments (optional)" value={comments} onChange={(e) => setComments(e.target.value)} />
                </div>
              )}

              {actionType === "modify" && (
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Edit command</label>
                  <textarea className="w-full p-2 bg-transparent border rounded font-mono text-sm" value={modifiedCommand} onChange={(e) => setModifiedCommand(e.target.value)} />
                </div>
              )}

              <div className="pt-2">
                <h4 className="text-sm font-semibold">Attachments (UI only)</h4>
                <div className="flex items-center gap-2">
                  <input ref={el => fileRef.current = el} type="file" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    setSelectedFile(f ? f.name : null);
                  }} />
                  <button className="px-3 py-1 rounded bg-muted text-sm" onClick={() => fileRef.current?.click()}>Upload file</button>
                  <div className="text-sm text-muted-foreground">{selectedFile ?? "No file"}</div>
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className="sticky bottom-0 left-0 right-0 border-t border-[var(--color-border)] bg-card/90 p-4 flex items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">{actionType === "approve" ? "Approve will mark this incident as Approved and dispatch." : actionType === "reject" ? "Provide reason and confirm rejection." : actionType === "modify" ? "Edit the proposed command then confirm." : "Viewing incident."}</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 rounded bg-transparent" onClick={() => onOpenChange(false)}>Cancel</button>
            <button
              className="px-3 py-2 rounded bg-primary text-primary-foreground"
              onClick={() => {
                if (!incident) return;
                if (actionType === "reject") onConfirm({ incidentId: incident.incidentId, status: "Rejected", reason: rejectReason, comments });
                else if (actionType === "modify") onConfirm({ incidentId: incident.incidentId, status: "Modified", proposedCommand: modifiedCommand });
                else if (actionType === "approve") onConfirm({ incidentId: incident.incidentId, status: "Approved" });
                else onOpenChange(false);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
