import { mockIncidents, type Incident } from "./incidents";

const defaultDelay = 500;
let failureRate = 0.05; // 5% random failures

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// internal in-memory store
let incidents: Incident[] = mockIncidents.map((i) => ({ ...i }));

function maybeFail() {
  if (Math.random() < failureRate) {
    throw new Error("Mock API failure");
  }
}

export function setFailureRate(rate: number) {
  failureRate = Math.max(0, Math.min(1, Number(rate) || 0));
}

export function getFailureRate() {
  return failureRate;
}

// Audit log simulation
type AuditLog = {
  id: number;
  incidentId: string;
  actor: string;
  action: string;
  details: string;
  createdAt: string;
};

let auditLogs: AuditLog[] = [];
let nextAuditId = 1;

function addAuditEntry(incidentId: string, action: string, details: string) {
  const entry: AuditLog = {
    id: nextAuditId++,
    incidentId,
    actor: "mock-operator",
    action,
    details,
    createdAt: new Date().toISOString(),
  };
  auditLogs.unshift(entry);
  return entry;
}

// Execution simulation
type ExecutionStep = {
  id: number;
  incidentId: string;
  stepName: string;
  command: string;
  status: "Pending" | "Success" | "Failed";
  output: string;
  createdAt: string;
};

const executions: Record<string, ExecutionStep[]> = {};
let nextExecId = 1;

function startExecutionSimulation(incidentId: string) {
  if (executions[incidentId]) return;
  const steps: ExecutionStep[] = [
    {
      id: nextExecId++,
      incidentId,
      stepName: "Prepare environment",
      command: "prepare-environment.sh",
      status: "Pending",
      output: "",
      createdAt: new Date().toISOString(),
    },
    {
      id: nextExecId++,
      incidentId,
      stepName: "Run remediation",
      command: "run-remediation.sh",
      status: "Pending",
      output: "",
      createdAt: new Date().toISOString(),
    },
    {
      id: nextExecId++,
      incidentId,
      stepName: "Verify",
      command: "verify.sh",
      status: "Pending",
      output: "",
      createdAt: new Date().toISOString(),
    },
  ];
  executions[incidentId] = steps;

  steps.forEach((step, idx) => {
    const delayMs = 800 + idx * 900;
    setTimeout(() => {
      const failed = Math.random() < 0.08;
      step.status = failed ? "Failed" : "Success";
      step.output = failed ? "Step failed due to simulated error." : "Step completed successfully.";
      if (idx === steps.length - 1) {
        const finalStatus = steps.some((s) => s.status === "Failed") ? "Rejected" : "Approved";
        incidents = incidents.map((i) => (i.id === incidentId ? { ...i, status: finalStatus } : i));
        addAuditEntry(incidentId, "execution:finished", `Execution finished, status=${finalStatus}`);
      }
    }, delayMs);
  });
}

export async function fetchIncidents(params?: Record<string, string | number | undefined>) {
  await delay(defaultDelay);
  // simple filtering: severity, category, resource, search
  let out = incidents.slice();
  if (!params) return { data: out, total: out.length, page: 1, pageSize: out.length };
  const severity = params["severity"] as string | undefined;
  const category = params["category"] as string | undefined;
  const resource = params["resource"] as string | undefined;
  const search = params["search"] as string | undefined;
  const page = Number(params["page"] ?? 1);
  const pageSize = Number(params["pageSize"] ?? 50);

  if (severity && severity !== "all") out = out.filter((i) => i.severity === severity);
  if (category && category !== "all") out = out.filter((i) => i.category === category);
  if (resource && resource !== "all") out = out.filter((i) => i.resource === resource);
  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    out = out.filter((i) => (i.anomalyName + " " + i.resource + " " + i.description).toLowerCase().includes(q));
  }

  const total = out.length;
  const start = (page - 1) * pageSize;
  const pageData = out.slice(start, start + pageSize);

  return {
    data: pageData.map(mapToIncidentRemediation),
    total,
    page,
    pageSize,
  };
}

export async function fetchCounts() {
  await delay(200);
  const counts: Record<string, number> = {
    Pending: incidents.filter((i) => i.status === "Pending").length,
    Approved: incidents.filter((i) => i.status === "Approved").length,
    Rejected: incidents.filter((i) => i.status === "Rejected").length,
    Modified: incidents.filter((i) => i.status === "Modified").length,
  };
  return { counts };
}

export async function fetchMeta() {
  await delay(200);
  const categories = Array.from(new Set(incidents.map((i) => i.category)));
  const resources = Array.from(new Set(incidents.map((i) => i.resource)));
  const severities = Array.from(new Set(incidents.map((i) => i.severity)));
  return { categories, resources, severities };
}

export async function fetchIncident(id: string) {
  await delay(200);
  const found = incidents.find((i) => i.id === id);
  if (!found) throw new Error("Not found");
  return mapToIncidentRemediation(found);
}

export async function updateIncident(id: string, updates: Partial<Incident>) {
  await delay(400);
  maybeFail();
  incidents = incidents.map((i) => (i.id === id ? { ...i, ...updates } : i));
  const updated = incidents.find((i) => i.id === id)!;
  return mapToIncidentRemediation(updated);
}

// Map local Incident -> IncidentRemediation shape used by UI types
function mapToIncidentRemediation(i: Incident) {
  return {
    incidentId: i.id,
    anomalyName: i.anomalyName,
    resource: i.resource,
    category: i.category,
    confidence: i.confidence,
    cloudAccount: "mock-account",
    proposedCommand: i.command,
    status: mapStatus(i.status),
    severity: i.severity as any,
    createdAt: i.createdAt,
  };
}

function mapStatus(s: Incident["status"]) {
  // Incident.status is a subset of UI Status; map directly
  return s as any;
}

export function resetMockData() {
  incidents = mockIncidents.map((i) => ({ ...i }));
}

export function addIncident(inc: Incident) {
  incidents.unshift({ ...inc });
  return mapToIncidentRemediation(inc);
}

export function forceExecutionResult(incidentId: string, result: "success" | "fail") {
  const steps = executions[incidentId];
  if (!steps) return null;
  steps.forEach((s) => {
    s.status = result === "success" ? "Success" : "Failed";
    s.output = result === "success" ? "Forced success" : "Forced failure";
  });
  const finalStatus = result === "success" ? "Approved" : "Rejected";
  incidents = incidents.map((i) => (i.id === incidentId ? { ...i, status: finalStatus } : i));
  addAuditEntry(incidentId, "execution:forced", `Forced execution ${result}`);
  return fetchExecution(incidentId);
}

export function resetExecution(incidentId: string) {
  delete executions[incidentId];
  addAuditEntry(incidentId, "execution:reset", "Execution reset via debug");
  incidents = incidents.map((i) => (i.id === incidentId ? { ...i, status: "Pending" } : i));
  return true;
}

export async function fetchAudit(incidentId?: string) {
  await delay(200);
  return incidentId
    ? auditLogs.filter((a) => a.incidentId === incidentId)
    : auditLogs;
}

export async function fetchExecution(incidentId: string) {
  await delay(150);
  return executions[incidentId] || [];
}

export default {
  fetchIncidents,
  fetchCounts,
  fetchMeta,
  fetchIncident,
  fetchAudit,
  fetchExecution,
  updateIncident,
  resetMockData,
};
