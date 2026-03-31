"use client";

import * as React from "react";
import {
  getFailureRate,
  setFailureRate,
  resetMockData,
  addIncident,
  forceExecutionResult,
  resetExecution,
} from "@/mocks/api";
import { mockControls } from "@/hooks/use-incidents-api";

export function MockDebugPanel() {
  const [open, setOpen] = React.useState(false);
  const [failure, setFailure] = React.useState(getFailureRate);   // lazy initialiser — avoids calling on every render
  const [autoRefresh, setAutoRefresh] = React.useState(
    () => mockControls.autoRefreshEnabled                          // lazy initialiser
  );
  const [incidentId, setIncidentId] = React.useState("");

  // ── Removed useEffects that fired on mount and unnecessarily
  //    overwrote external state.  Side effects now happen only
  //    when the user actually changes the control.

  function handleFailureChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = Number(e.target.value);
    setFailure(value);
    setFailureRate(value);                                         // call directly on change
  }

  function handleAutoRefreshChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.checked;
    setAutoRefresh(value);
    mockControls.setAutoRefresh(value);                           // call directly on change
  }

  const addRandomIncident = React.useCallback(() => {             // stable reference; no deps
    const id = `INC-${Math.floor(Math.random() * 9000 + 1000)}`;
    const now = new Date().toISOString();

    addIncident({
      id,
      anomalyName: "Auto anomaly",
      resource: "mock-node",
      category: "Synthetic",
      severity: "Low",
      confidence: 40,
      status: "Pending",
      createdAt: now,
      description: "Generated via debug panel",
      command: "echo test",
    });
  }, []);

  // Guard: do nothing when no ID has been entered
  function requireIncidentId(action: (id: string) => void) {
    if (!incidentId.trim()) return;
    action(incidentId.trim());
  }

  return (
    <div style={{ position: "fixed", right: 16, bottom: 16, zIndex: 60 }}>
      {/* Toggle */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 bg-gray-800 text-white rounded shadow text-sm"
      >
        {open ? "Close Debug" : "Debug"}
      </button>

      {open && (
        <div className="mt-2 w-80 p-4 bg-gray-900 text-white rounded border text-sm space-y-3">
          <div className="font-bold">⚙️ Mock Controls</div>

          {/* Auto Refresh */}
          <label className="flex justify-between items-center">
            <span>Auto-refresh</span>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={handleAutoRefreshChange}
            />
          </label>

          {/* Failure Rate */}
          <div>
            <div>Failure: {(failure * 100).toFixed(0)}%</div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={failure}
              onChange={handleFailureChange}
              className="w-full"
            />
          </div>

          {/* Incident Controls */}
          <button
            onClick={addRandomIncident}
            className="w-full bg-blue-600 p-1 rounded"
          >
            ➕ Add Incident
          </button>

          <button
            onClick={resetMockData}
            className="w-full bg-gray-700 p-1 rounded"
          >
            🔄 Reset Data
          </button>

          {/* Execution Controls */}
          <input
            placeholder="Incident ID"
            value={incidentId}
            onChange={(e) => setIncidentId(e.target.value)}
            className="w-full p-1 rounded bg-black border"
          />

          <div className="flex gap-2">
            <button
              onClick={() =>
                requireIncidentId((id) => forceExecutionResult(id, "success"))
              }
              className="flex-1 bg-green-600 p-1 rounded"
            >
              Success
            </button>

            <button
              onClick={() =>
                requireIncidentId((id) => forceExecutionResult(id, "fail"))
              }
              className="flex-1 bg-red-600 p-1 rounded"
            >
              Fail
            </button>
          </div>

          <button
            onClick={() => requireIncidentId(resetExecution)}
            className="w-full bg-yellow-600 p-1 rounded"
          >
            Reset Execution
          </button>
        </div>
      )}
    </div>
  );
}

export default MockDebugPanel;