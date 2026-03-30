export type Severity = "Low" | "Medium" | "High" | "Critical";
export type Status = "Pending" | "Approved" | "Rejected" | "Modified" | "Executing" | "Completed" | "Failed";

export interface IncidentRemediation {
  incidentId: string;
  anomalyName: string;
  resource: string;
  category: string;
  confidence: number;
  cloudAccount: string;
  proposedCommand: string;
  status: Status;
  severity: Severity;
  createdAt?: string;
}

export interface AuditLog {
  id: number;
  incidentId: string;
  actor: string;
  action: string;
  details: string;
  createdAt: string;
}

export interface ExecutionStep {
  id: number;
  incidentId: string;
  stepName: string;
  command: string;
  status: "Pending" | "Success" | "Failed";
  output: string;
  createdAt: string;
}

export type SidebarTab =
  | "incoming"
  | "approved"
  | "rejected"
  | "modified"
  | "pending-task"
  | "completed"
  | "audit-logs"
  | "executing"
  | "failed";

export interface IncidentsListResponse {
  data: IncidentRemediation[];
  total: number;
  page: number;
  pageSize: number;
}

export type SortField =
  | "severity"
  | "incidentId"
  | "anomalyName"
  | "resource"
  | "category"
  | "confidence"
  | "cloudAccount"
  | "proposedCommand"
  | "status"
  | "createdAt";
