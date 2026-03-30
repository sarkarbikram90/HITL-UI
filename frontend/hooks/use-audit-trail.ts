/**
 * Re-export for consumers that expect hooks under `hooks/`.
 * Audit events are session-scoped on the client until a backend audit API exists.
 */
export { useAuditTrail, type AuditEntry } from "@/contexts/audit-context";
