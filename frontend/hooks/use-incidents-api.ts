"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type Query,
} from "@tanstack/react-query";
import type {
  IncidentRemediation,
  IncidentsListResponse,
  SidebarTab,
  SortField,
  AuditLog,
  ExecutionStep,
} from "@/types/incident-remediation";
import * as mockApi from "@/mocks/api";

// Runtime mock controls (toggle polling at runtime)
export const mockControls = {
  autoRefreshEnabled: false,
  setAutoRefresh(v: boolean) {
    this.autoRefreshEnabled = v;
  },
  pollInterval: 5000,
  setPollInterval(ms: number) {
    this.pollInterval = ms;
  },
};
import type { Status } from "@/types/incident-remediation";

export type IncidentsListParams = {
  tab: SidebarTab;
  severity: string;
  category: string;
  resource: string;
  search: string;
  page: number;
  pageSize: number;
  sortBy: SortField;
  sortDir: "asc" | "desc";
};

export const incidentsQueryKeys = {
  all: ["incidents"] as const,
  list: (p: IncidentsListParams) => [...incidentsQueryKeys.all, "list", p] as const,
  counts: () => [...incidentsQueryKeys.all, "counts"] as const,
  meta: () => [...incidentsQueryKeys.all, "meta"] as const,
  detail: (id: string) => [...incidentsQueryKeys.all, "detail", id] as const,
  audit: (id: string) => [...incidentsQueryKeys.all, "audit", id] as const,
  execution: (id: string) => [...incidentsQueryKeys.all, "execution", id] as const,
};

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  // Route to mock API when running in the frontend dev environment.
  try {
    // list endpoint
    if (url.startsWith("/api/incidents?")) {
      const u = new URL("http://localhost" + url);
      const params: Record<string, string> = {};
      for (const [k, v] of u.searchParams.entries()) params[k] = v;
      const resp = await mockApi.fetchIncidents(params);
      return resp as unknown as T;
    }

    if (url === "/api/incidents/counts") {
      return (await mockApi.fetchCounts()) as unknown as T;
    }

    if (url === "/api/incidents/meta") {
      return (await mockApi.fetchMeta()) as unknown as T;
    }

    // incident detail
    const detailMatch = url.match(/^\/api\/incidents\/(.+)$/);
    if (detailMatch) {
      const id = detailMatch[1];
      if (url.endsWith("/audit")) {
        return (await mockApi.fetchAudit(id)) as unknown as T;
      }
      if (url.endsWith("/execution")) {
        return (await mockApi.fetchExecution(id)) as unknown as T;
      }
      // plain detail
      return (await mockApi.fetchIncident(id)) as unknown as T;
    }

    // PATCH to /api/incidents -> update
    if (url === "/api/incidents" && init?.method === "PATCH") {
      const body = init.body ? JSON.parse(String(init.body)) : {};
      const { incidentId, status, proposedCommand } = body as any;
      const updates: Record<string, any> = {};
      if (status) updates.status = status;
      if (proposedCommand) updates.command = proposedCommand;
      const updated = await mockApi.updateIncident(incidentId, updates);
      return ({ data: updated } as unknown) as T;
    }

    // Fallback to real fetch for any other route
    const res = await fetch(url, init);
    if (!res.ok) {
      const err = await res.text();
      throw new Error(err || res.statusText);
    }
    return res.json() as Promise<T>;
  } catch (err) {
    throw err;
  }
}

function buildListUrl(p: IncidentsListParams): string {
  const sp = new URLSearchParams();
  sp.set("tab", p.tab);
  if (p.severity && p.severity !== "all") sp.set("severity", p.severity);
  if (p.category && p.category !== "all") sp.set("category", p.category);
  if (p.resource && p.resource !== "all") sp.set("resource", p.resource);
  if (p.search.trim()) sp.set("search", p.search.trim());
  sp.set("page", String(p.page));
  sp.set("pageSize", String(p.pageSize));
  sp.set("sortBy", p.sortBy);
  sp.set("sortDir", p.sortDir);
  return `/api/incidents?${sp.toString()}`;
}

export function useIncidentsList(params: IncidentsListParams) {
  return useQuery({
    queryKey: incidentsQueryKeys.list(params),
    queryFn: () => fetchJson<IncidentsListResponse>(buildListUrl(params)),
    placeholderData: (prev: IncidentsListResponse | undefined) => prev,
    refetchInterval: () => (mockControls.autoRefreshEnabled ? mockControls.pollInterval : false),
  });
}

export function useIncidentCounts() {
  return useQuery({
    queryKey: incidentsQueryKeys.counts(),
    queryFn: () => fetchJson<{ counts: Record<string, number> }>("/api/incidents/counts"),
    refetchInterval: 5000,
  });
}

export function useAuditLogs(incidentId?: string) {
  const url = incidentId
    ? `/api/incidents/${incidentId}/audit`
    : "/api/audit";
  return useQuery({
    queryKey: incidentsQueryKeys.audit(incidentId ?? "global"),
    queryFn: () => fetchJson<AuditLog[]>(url),
    refetchInterval: 10000,
  });
}

export function useExecutionSteps(incidentId: string) {
  return useQuery({
    queryKey: incidentsQueryKeys.execution(incidentId),
    queryFn: () => fetchJson<ExecutionStep[]>(`/api/incidents/${incidentId}/execution`),
    enabled: !!incidentId,
    refetchInterval: (query: Query<ExecutionStep[], Error>) => {
        return (query.state.data?.some((s: ExecutionStep) => s.status === "Pending") ? 2000 : false);
    }
  });
}

export function useIncidentMeta() {
  return useQuery({
    queryKey: incidentsQueryKeys.meta(),
    queryFn: () => fetchJson<{ categories: string[]; resources: string[]; severities: string[] }>("/api/incidents/meta"),
    staleTime: 60_000,
  });
}

export function usePatchIncident(options?: Omit<UseMutationOptions<{ data: IncidentRemediation }, Error, { incidentId: string, status?: Status, proposedCommand?: string }>, "mutationFn">) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { incidentId: string, status?: Status, proposedCommand?: string }) => fetchJson<{ data: IncidentRemediation }>("/api/incidents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    }),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: incidentsQueryKeys.all });
    },
    ...options,
  });
}
