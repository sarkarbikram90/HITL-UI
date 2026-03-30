"use client";

import * as React from "react";

export interface AuditEntry {
  id: string;
  at: number;
  action: "approve" | "reject" | "modify";
  incidentId: string;
  detail?: string;
}

type AuditContextValue = {
  entries: AuditEntry[];
  log: (entry: Omit<AuditEntry, "id" | "at">) => void;
};

const AuditContext = React.createContext<AuditContextValue | null>(null);

export function AuditProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = React.useState<AuditEntry[]>([]);

  const log = React.useCallback((entry: Omit<AuditEntry, "id" | "at">) => {
    const full: AuditEntry = {
      ...entry,
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()),
      at: Date.now(),
    };
    setEntries((prev) => [full, ...prev].slice(0, 200));
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.debug("[audit]", full);
    }
  }, []);

  const value = React.useMemo(() => ({ entries, log }), [entries, log]);

  return (
    <AuditContext.Provider value={value}>{children}</AuditContext.Provider>
  );
}

export function useAuditTrail() {
  const ctx = React.useContext(AuditContext);
  if (!ctx) {
    throw new Error("useAuditTrail must be used within AuditProvider");
  }
  return ctx;
}
