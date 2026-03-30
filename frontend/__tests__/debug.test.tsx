import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ensure dev-only export path
process.env.NODE_ENV = "development";

import * as mockApi from "@/mocks/api";
import { mockControls } from "@/hooks/use-incidents-api";

const DebugPage = React.lazy(() => import("@/pages/debug"));

function renderWithClient(ui: React.ReactElement) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={qc}>{ui}</QueryClientProvider>);
}

beforeEach(() => {
  // reset mock state
  mockApi.resetMockData();
  mockApi.setFailureRate(0);
  mockControls.setAutoRefresh(false);
  mockControls.setPollInterval(5000);
});

test("failure rate control updates mock API", async () => {
  renderWithClient(
    <React.Suspense fallback={<div />}> 
      <DebugPage />
    </React.Suspense>
  );

  // slider role is 'slider'
  const slider = await screen.findByRole("slider");
  fireEvent.change(slider, { target: { value: 0.2 } });

  await waitFor(() => {
    expect(mockApi.getFailureRate()).toBeCloseTo(0.2, 2);
  });
});

test("inject incident appears and force execution works", async () => {
  renderWithClient(
    <React.Suspense fallback={<div />}> 
      <DebugPage />
    </React.Suspense>
  );

  const anomalyInput = await screen.findByPlaceholderText("Anomaly Name");
  const resourceInput = screen.getByPlaceholderText("Resource");
  const cmdInput = screen.getByPlaceholderText("Command");
  const injectBtn = screen.getByText("Inject");

  fireEvent.change(anomalyInput, { target: { value: "Test Injected Anomaly" } });
  fireEvent.change(resourceInput, { target: { value: "test-node" } });
  fireEvent.change(cmdInput, { target: { value: "echo injected" } });

  fireEvent.click(injectBtn);

  // injected item should appear in snapshot list
  const item = await screen.findByText("Test Injected Anomaly");
  expect(item).toBeTruthy();

  // select item to enable execution controls
  fireEvent.click(item);

  const forceBtn = await screen.findByText("Force Success");
  fireEvent.click(forceBtn);

  // after forcing, execution steps should be visible with 'Success'
  await waitFor(async () => {
    const success = await screen.findByText(/Success/);
    expect(success).toBeTruthy();
  });

  // audit logs should contain execution:forced
  await waitFor(() => {
    const log = screen.getByText(/execution:forced/);
    expect(log).toBeTruthy();
  });
});
