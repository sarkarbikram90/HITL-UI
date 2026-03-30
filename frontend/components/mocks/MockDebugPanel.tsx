"use client";

import * as React from "react";
import { mockControls } from "@/hooks/use-incidents-api";
import * as mockApi from "@/mocks/api";

export function MockDebugPanel() {
  const [open, setOpen] = React.useState(false);
  const [failure, setFailure] = React.useState(() => mockApi.getFailureRate());
  const [autoRefresh, setAutoRefresh] = React.useState(() => mockControls.autoRefreshEnabled);

  React.useEffect(() => {
    mockApi.setFailureRate(failure);
  }, [failure]);

  React.useEffect(() => {
    mockControls.setAutoRefresh(autoRefresh);
  }, [autoRefresh]);

  function addRandomIncident() {
    const id = `INC-M-${Math.floor(Math.random() * 9000 + 1000)}`;
    const now = new Date().toISOString();
    const inc = {
      id,
      anomalyName: "Auto-generated anomaly",
      resource: "mock-node",
      category: "Synthetic",
      severity: "Low",
      confidence: 45,
      status: "Pending",
      createdAt: now,
      description: "Synthetic incident injected via debug panel",
      command: "echo 'noop'",
    };
    if ((mockApi as any).addIncident) {
      (mockApi as any).addIncident(inc);
    } else {
      // last resort: reset then hope list includes our synthetic data
      mockApi.resetMockData();
    }
  }

  function resetData() {
    mockApi.resetMockData();
  }

  return (
    <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 60 }}>
      <div>
        <button
          onClick={() => setOpen((s) => !s)}
          className="p-2 bg-card rounded-md shadow text-sm"
        >
          {open ? "Close Debug" : "Debug"}
        </button>
      </div>
      {open && (
        <div className="mt-2 w-80 p-4 glass rounded border border-[var(--color-border)] text-sm">
          <div className="mb-2 font-bold">Mock Controls</div>
          <label className="flex items-center justify-between mb-2">
            <span>Auto-refresh</span>
            <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
          </label>
          <label className="flex flex-col mb-2">
            <span>Failure rate: {(failure * 100).toFixed(0)}%</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={failure}
              onChange={(e) => setFailure(Number(e.target.value))}
            />
          </label>
          <div className="flex gap-2 mt-2">
            <button onClick={resetData} className="btn">Reset Data</button>
            <button onClick={addRandomIncident} className="btn">Add Incident</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MockDebugPanel;
