"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as mockApi from "@/mocks/api";
import { mockControls } from "@/hooks/use-incidents-api";
import { incidentsQueryKeys } from "@/hooks/use-incidents-api";

function DebugOff() {
  return null;
}

function DebugPage() {
  // Debug feature is disabled
  return null;
  const qc = useQueryClient();
  const [failure, setFailure] = React.useState(() => mockApi.getFailureRate?.() ?? 0);
  const [enableFailures, setEnableFailures] = React.useState(() => (mockApi.getFailureRate?.() ?? 0) > 0);
  const [pollMs, setPollMs] = React.useState(() => mockControls.pollInterval ?? 5000);

  const [incidents, setIncidents] = React.useState<any[]>([]);
  const [audit, setAudit] = React.useState<any[]>([]);
  const [selected, setSelected] = React.useState<string | null>(null);
  const [execution, setExecution] = React.useState<any[]>([]);

  const loadAll = React.useCallback(async () => {
    const res = await mockApi.fetchIncidents();
    setIncidents(res.data ?? res);
    const logs = await mockApi.fetchAudit();
    setAudit(logs.slice(0, 50));
  }, []);

  React.useEffect(() => {
    mockApi.setFailureRate(failure);
    setEnableFailures(failure > 0);
  }, [failure]);

  React.useEffect(() => {
    mockControls.setPollInterval(Number(pollMs));
  }, [pollMs]);

  React.useEffect(() => {
    loadAll();
    const iv = setInterval(() => {
      if (mockControls.autoRefreshEnabled) loadAll();
    }, mockControls.pollInterval || 5000);
    return () => clearInterval(iv);
  }, [loadAll]);

  React.useEffect(() => {
    if (!selected) return;
    let mounted = true;
    (async () => {
      const exec = await mockApi.fetchExecution(selected);
      if (mounted) setExecution(exec ?? []);
    })();
    return () => {
      mounted = false;
    };
  }, [selected]);

  async function handleInject(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const inc = {
      id: `INC-D-${Math.floor(Math.random() * 90000 + 10000)}`,
      anomalyName: String(fd.get("anomalyName") ?? "Synthetic"),
      resource: String(fd.get("resource") ?? "mock"),
      category: String(fd.get("category") ?? "Synthetic"),
      severity: String(fd.get("severity") ?? "Low"),
      confidence: Number(fd.get("confidence") ?? 50),
      status: "Pending",
      createdAt: new Date().toISOString(),
      description: String(fd.get("description") ?? ""),
      command: String(fd.get("command") ?? "echo 'noop'"),
    };
    await mockApi.addIncident(inc as any);
    // invalidate queries to refresh UI
    qc.invalidateQueries({ queryKey: incidentsQueryKeys.all });
    await loadAll();
  }

  async function handleForce(incidentId: string, result: "success" | "fail") {
    await mockApi.forceExecutionResult(incidentId, result as any);
    qc.invalidateQueries({ queryKey: incidentsQueryKeys.all });
    const exec = await mockApi.fetchExecution(incidentId);
    setExecution(exec ?? []);
    const logs = await mockApi.fetchAudit(incidentId);
    setAudit((a) => [...(logs ?? []), ...a]);
  }

  async function handleResetExecution(incidentId: string) {
    await mockApi.resetExecution(incidentId);
    qc.invalidateQueries({ queryKey: incidentsQueryKeys.all });
    setExecution([]);
    const logs = await mockApi.fetchAudit(incidentId);
    setAudit((a) => [...(logs ?? []), ...a]);
  }

  function toggleFailures(enabled: boolean) {
    setEnableFailures(enabled);
    mockApi.setFailureRate(enabled ? failure : 0);
  }

  return (
    <div className="p-6 max-w-screen-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Simulation Control Center (Dev)</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-4 rounded border">
          <h3 className="font-semibold mb-2">System Controls</h3>
          <label className="block text-sm mb-2">Failure rate: {(failure * 100).toFixed(0)}%</label>
          <input type="range" min={0} max={1} step={0.01} value={failure} onChange={(e) => setFailure(Number(e.target.value))} />
          <div className="flex items-center gap-2 mt-2">
            <label className="flex items-center gap-2">Enable failures
              <input type="checkbox" checked={enableFailures} onChange={(e) => toggleFailures(e.target.checked)} />
            </label>
          </div>
          <div className="mt-4">
            <label className="block text-sm">Polling interval (ms)</label>
            <input className="w-32 p-1 border rounded mt-1" type="number" value={pollMs} onChange={(e) => setPollMs(Number(e.target.value || 0))} />
            <div className="text-xs text-muted-foreground mt-1">Auto-refresh uses this interval when enabled.</div>
          </div>
        </div>

        <div className="glass p-4 rounded border">
          <h3 className="font-semibold mb-2">Inject Incident</h3>
          <form onSubmit={handleInject} className="grid gap-2">
            <input name="anomalyName" placeholder="Anomaly Name" className="p-2 border rounded" />
            <input name="resource" placeholder="Resource" className="p-2 border rounded" />
            <select name="severity" className="p-2 border rounded">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
            <input name="confidence" type="number" min={0} max={100} defaultValue={50} className="p-2 border rounded" />
            <input name="command" placeholder="Command" className="p-2 border rounded" />
            <textarea name="description" placeholder="Description" className="p-2 border rounded" />
            <div className="flex gap-2">
              <button type="submit" className="btn">Inject</button>
              <button type="button" onClick={() => { mockApi.resetMockData(); qc.invalidateQueries({ queryKey: incidentsQueryKeys.all }); loadAll(); }} className="btn">Reset Data</button>
            </div>
          </form>
        </div>

        <div className="glass p-4 rounded border col-span-1">
          <h3 className="font-semibold mb-2">Incidents Snapshot</h3>
          <div className="max-h-72 overflow-auto">
            <ul>
              {incidents.map((it) => (
                <li key={it.incidentId} className="p-2 border-b cursor-pointer flex justify-between" onClick={() => setSelected(it.incidentId)}>
                  <div>
                    <div className="font-medium">{it.anomalyName}</div>
                    <div className="text-xs text-muted-foreground">{it.resource}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{it.status}</div>
                    <div className="text-xs">{it.severity}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="glass p-4 rounded border col-span-1">
          <h3 className="font-semibold mb-2">Execution / Audit</h3>
          <div className="mb-2">Selected: {selected ?? "—"}</div>
          <div className="flex gap-2 mb-2">
            <button disabled={!selected} onClick={() => selected && handleForce(selected, "success")} className="btn">Force Success</button>
            <button disabled={!selected} onClick={() => selected && handleForce(selected, "fail")} className="btn">Force Failure</button>
            <button disabled={!selected} onClick={() => selected && handleResetExecution(selected)} className="btn">Reset</button>
          </div>
          <div className="text-sm font-medium">Execution Steps</div>
          <div className="max-h-36 overflow-auto text-xs mt-2">
            {execution.length === 0 ? <div className="italic">No execution steps</div> : execution.map((s: any) => (
              <div key={s.id} className="mb-1">
                <div className="font-medium">{s.stepName} — {s.status}</div>
                <div className="text-muted-foreground">{s.output}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-4 rounded border col-span-2">
          <h3 className="font-semibold mb-2">Recent Audit Logs</h3>
          <div className="max-h-40 overflow-auto text-xs">
            {audit.length === 0 ? <div className="italic">No audit logs</div> : audit.map((a) => (
              <div key={a.id} className="p-2 border-b">
                <div className="text-sm">{a.action} — {a.actor}</div>
                <div className="text-muted-foreground">{a.details}</div>
                <div className="text-xs">{a.createdAt}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// export a no-op in production builds
export default process.env.NODE_ENV !== "development" ? DebugOff : DebugPage;
