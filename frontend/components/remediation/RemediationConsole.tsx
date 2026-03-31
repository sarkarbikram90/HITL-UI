"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { IncidentRemediation, SidebarTab, SortField } from "@/types/incident-remediation";
import { Header } from "@/components/remediation/Header";
import { Sidebar } from "@/components/remediation/Sidebar";
import { FilterBar } from "@/components/remediation/FilterBar";
import { RemediationTable } from "@/components/remediation/RemediationTable";
import IncidentPanel from "@/components/remediation/IncidentPanel";
import { AuditLogPanel } from "@/components/remediation/AuditLogPanel";
import {
  useIncidentsList,
  useIncidentCounts,
  useIncidentMeta,
  usePatchIncident,
} from "@/hooks/use-incidents-api";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle } from "lucide-react";

const TABS: SidebarTab[] = [
  "incoming",
  "approved",
  "rejected",
  "modified",
  "pending-task",
  "completed",
  "audit-logs",
  "executing",
  "failed"
];

const SORT_FIELDS: SortField[] = [
  "severity",
  "incidentId",
  "anomalyName",
  "resource",
  "category",
  "confidence",
  "cloudAccount",
  "proposedCommand",
  "status",
  "createdAt"
];

function parseTab(v: string | null): SidebarTab {
  if (v && TABS.includes(v as SidebarTab)) return v as SidebarTab;
  return "incoming";
}

function parseSortField(v: string | null): SortField {
  if (v && SORT_FIELDS.includes(v as SortField)) return v as SortField;
  return "incidentId";
}

export function RemediationConsole() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = parseTab(searchParams?.get("tab") ?? null);
  const severity = searchParams?.get("severity") ?? "all";
  const category = searchParams?.get("category") ?? "all";
  const resource = searchParams?.get("resource") ?? "all";
  const search = searchParams?.get("search") ?? "";
  const page = Math.max(1, Number(searchParams?.get("page")) || 1);
  const sortBy = parseSortField(searchParams?.get("sortBy") ?? null);
  const sortDir: "asc" | "desc" = searchParams?.get("sortDir") === "desc" ? "desc" : "asc";
  const pageSize = Math.min(100, Math.max(1, Number(searchParams?.get("pageSize")) || 20));

  const listParams = React.useMemo(() => ({
      tab, severity, category, resource, search, page, pageSize, sortBy, sortDir,
    }), [tab, severity, category, resource, search, page, pageSize, sortBy, sortDir]
  );

  const { data, isLoading, isFetching } = useIncidentsList(listParams);
  const { data: countsData } = useIncidentCounts();
  const { data: meta } = useIncidentMeta();
  const [actionMessage, setActionMessage] = React.useState<{ message: string; type: "success" | "error" | null } | null>(null);

  // Auto-dismiss action messages
  React.useEffect(() => {
    if (actionMessage) {
      const t = setTimeout(() => setActionMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [actionMessage]);

  const patch = usePatchIncident({
    onSuccess: (_data, variables) => {
      const action = variables.status === "Approved" ? "approved" :
        variables.status === "Rejected" ? "rejected" :
        variables.status === "Modified" ? "modified" :
        variables.status === "Executing" ? "sent for execution" : "updated";
      setActionMessage({ message: `Incident ${variables.incidentId} ${action}`, type: "success" });
    },
    onError: (error) => {
      setActionMessage({ message: `Action failed: ${error.message}`, type: "error" });
    },
  });

  const [panelOpen, setPanelOpen] = React.useState(false);
  const [selectedIncident, setSelectedIncident] = React.useState<IncidentRemediation | null>(null);
  const [actionType, setActionType] = React.useState<"approve" | "reject" | "modify" | "view" | null>(null);

  const pushParams = React.useCallback((patchParams: Record<string, string | number | undefined>) => {
      const sp = new URLSearchParams(searchParams?.toString() ?? "");
      Object.entries(patchParams).forEach(([k, v]) => {
        if (v === undefined || v === "") sp.delete(k);
        else sp.set(k, String(v));
      });
      router.replace(`/?${sp.toString()}`, { scroll: false });
    }, [router, searchParams]
  );

  const openPanelFor = (row: IncidentRemediation, type: "approve" | "reject" | "modify" | "view") => {
    setSelectedIncident(row);
    setActionType(type);
    setPanelOpen(true);
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!panelOpen || !selectedIncident) return;
      const active = document.activeElement?.tagName;
      if (active === "INPUT" || active === "TEXTAREA" || active === "SELECT") return;
      const k = e.key.toLowerCase();
      if (k === "a") setActionType("approve");
      else if (k === "r") setActionType("reject");
      else if (k === "m") setActionType("modify");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panelOpen, selectedIncident]);

  const onAccept = (incidentId: string) => {
    const row = rows.find((r) => r.incidentId === incidentId);
    if (row) openPanelFor(row, "approve");
  };
  const onReject = (incidentId: string) => {
    const row = rows.find((r) => r.incidentId === incidentId);
    if (row) openPanelFor(row, "reject");
  };
  const onExecute = (incidentId: string) => {
    patch.mutate({ incidentId, status: "Executing" });
  };

  const rows = data?.data ?? [];
  const total = data?.total ?? 0;

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)] text-[var(--color-foreground)]">
      <Header />

      <div className="flex min-h-0 flex-1">
        <Sidebar counts={countsData?.counts} />

        <main className="flex min-w-0 flex-1 flex-col relative overflow-hidden">
          {/* Toast notification */}
          {actionMessage && (
            <div
              className={cn(
                "absolute top-3 right-4 z-40 flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg animate-in slide-in-from-top-2 fade-in duration-200",
                actionMessage.type === "success"
                  ? "bg-emerald-600 text-white"
                  : "bg-red-600 text-white"
              )}
            >
              {actionMessage.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{actionMessage.message}</span>
              <button
                onClick={() => setActionMessage(null)}
                className="ml-1 p-0.5 rounded hover:bg-white/20 transition-colors duration-100"
              >
                <XCircle className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {tab === "audit-logs" ? (
            <div className="flex flex-1 flex-col gap-5 p-6">
              <div>
                <h2 className="text-lg font-semibold tracking-tight text-gray-900">Audit Trail</h2>
                <p className="text-sm text-gray-400 mt-0.5">Immutable record of system and human interventions</p>
              </div>
              <AuditLogPanel />
            </div>
          ) : (
            <div className="flex flex-1 flex-col">
              <FilterBar
                severity={severity} category={category} resource={resource} search={search}
                severities={meta?.severities ?? ["Low", "Medium", "High", "Critical"]}
                categories={meta?.categories ?? []}
                resources={meta?.resources ?? []}
                onSeverityChange={(v) => pushParams({ severity: v, page: 1 })}
                onCategoryChange={(v) => pushParams({ category: v, page: 1 })}
                onResourceChange={(v) => pushParams({ resource: v, page: 1 })}
                onSearchChange={(v) => pushParams({ search: v, page: 1 })}
              />
              <div className="flex-1 overflow-auto p-5 pt-4">
                <RemediationTable
                  data={rows} total={total} page={page} pageSize={pageSize}
                  sortBy={sortBy} sortDir={sortDir} isLoading={isLoading || isFetching}
                  onPageChange={(p) => pushParams({ page: p })}
                  onSortChange={(field, dir) => pushParams({ sortBy: field, sortDir: dir, page: 1 })}
                  onAccept={onAccept} onModify={(row) => openPanelFor(row, "modify")} onReject={onReject} onExecute={onExecute}
                  mutationPending={patch.isPending}
                  onRowClick={(row) => openPanelFor(row, "view")}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      <IncidentPanel
        open={panelOpen}
        onOpenChange={(v) => {
          if (!v) {
            setPanelOpen(false);
            setSelectedIncident(null);
            setActionType(null);
          } else setPanelOpen(v);
        }}
        incident={selectedIncident}
        actionType={actionType}
        onConfirm={(payload) => {
          if (!payload) return;
          patch.mutate(payload);
          setPanelOpen(false);
          setSelectedIncident(null);
          setActionType(null);
        }}
      />
    </div>
  );
}
