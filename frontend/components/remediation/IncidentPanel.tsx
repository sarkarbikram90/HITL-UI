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
      <aside className="relative ml-auto h-full w-[420px] max-w-full bg-white shadow-2xl border-l border-gray-200 overflow-y-auto animate-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-bold tracking-tight">{actionType === "approve" ? "APPROVE INCIDENT" : actionType === "reject" ? "REJECT INCIDENT" : actionType === "modify" ? "MODIFY INCIDENT" : "INCIDENT DETAILS"}</h3>
            <p className="text-sm text-gray-600">{incident?.anomalyName}</p>
          </div>
          <button className="p-2" onClick={() => onOpenChange(false)} aria-label="Close panel">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 w-1/2 rounded bg-gray-200 animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-6 rounded bg-gray-200 animate-pulse" />
                <div className="h-6 rounded bg-gray-200 animate-pulse" />
                <div className="h-6 rounded bg-gray-200 animate-pulse" />
                <div className="h-6 rounded bg-gray-200 animate-pulse" />
              </div>
              <div className="h-36 rounded bg-gray-200 animate-pulse" />
            </div>
          ) : incident ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-gray-600">Resource</div>
                  <div className="font-medium text-gray-900">{incident.resource}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Category</div>
                  <div className="font-medium text-gray-900">{incident.category}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Severity</div>
                  <div className="font-medium text-gray-900">{incident.severity}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Confidence</div>
                  <div className="font-medium text-gray-900">{incident.confidence}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Date</div>
                  <div className="font-mono text-sm text-gray-700">{incident.createdAt ? new Date(incident.createdAt).toLocaleString() : "-"}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-600">Status</div>
                  <div className="font-medium text-gray-900">{incident.status}</div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900">Description</h4>
                <p className="text-sm text-gray-600">{(incident as any).description || "No description available."}</p>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900">RCA & Logs</h4>
                <p className="text-sm text-gray-600">Short RCA summary placeholder.</p>
                <button className="mt-2 px-3 py-1 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors" onClick={() => { /* placeholder */ }}>
                  View Logs
                </button>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900">Proposed Command</h4>
                <pre className="relative rounded bg-gray-50 border border-gray-200 p-3 text-xs font-mono text-gray-800 overflow-auto">
                  <code className="block whitespace-pre-wrap">{incident.proposedCommand || "N/A"}</code>
                  <button
                    className="absolute right-2 top-2 p-1 rounded bg-gray-200 hover:bg-gray-300 transition-colors text-gray-600"
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
                  {copied && <div className="absolute right-10 top-2 rounded bg-gray-900/70 px-2 py-1 text-xs text-white">Copied</div>}
                </pre>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-gray-900">VPC / Firewall Check</h4>
                <div className="flex items-center gap-3">
                  <span className="inline-block rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">Pass</span>
                  <div className="text-sm text-gray-600">Instance: {incident.resource}</div>
                </div>
              </div>

              {actionType === "reject" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Reason for rejection</label>
                  <select className="w-full p-2 bg-white border border-gray-300 rounded text-gray-900 hover:border-gray-400 transition-colors" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}>
                    <option value="">Select reason</option>
                    <option value="false-positive">False positive</option>
                    <option value="not-actionable">Not actionable</option>
                    <option value="needs-info">Needs more info</option>
                  </select>
                  <textarea className="w-full p-2 bg-white border border-gray-300 rounded text-gray-900 placeholder-gray-500 hover:border-gray-400 transition-colors" placeholder="Comments (optional)" value={comments} onChange={(e) => setComments(e.target.value)} />
                </div>
              )}

              {actionType === "modify" && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-900">Edit command</label>
                  <textarea className="w-full p-2 bg-white border border-gray-300 rounded font-mono text-sm text-gray-900 placeholder-gray-500 hover:border-gray-400 transition-colors" value={modifiedCommand} onChange={(e) => setModifiedCommand(e.target.value)} />
                </div>
              )}

              <div className="pt-2">
                <h4 className="text-sm font-semibold text-gray-900">Attachments (UI only)</h4>
                <div className="flex items-center gap-2">
                  <input ref={el => fileRef.current = el} type="file" className="hidden" onChange={(e) => {
                    const f = e.target.files?.[0];
                    setSelectedFile(f ? f.name : null);
                  }} />
                  <button className="px-3 py-1 rounded bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition-colors" onClick={() => fileRef.current?.click()}>Upload file</button>
                  <div className="text-sm text-gray-600">{selectedFile ?? "No file"}</div>
                </div>
              </div>
            </>
          ) : null}
        </div>

        <div className="sticky bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4 flex flex-col gap-3">
          <div className="text-sm text-gray-600">{actionType === "approve" ? "Approve will mark this incident as Approved and dispatch." : actionType === "reject" ? "Provide reason and confirm rejection." : actionType === "modify" ? "Edit the proposed command then confirm." : "Viewing incident."}</div>
          <div className="flex items-center gap-2">
            <button 
              className="flex-1 px-3 py-2 rounded bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              className="flex-1 px-3 py-2 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
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
