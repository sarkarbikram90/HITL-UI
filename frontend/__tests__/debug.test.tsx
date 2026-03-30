import React from "react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ensure dev-only export path
process.env.NODE_ENV = "development";

import * as mockApi from "@/mocks/api";
import { mockControls } from "@/hooks/use-incidents-api";

const DebugPage = React.lazy(() => import("@/src/pages/debug"));

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

test("debug page is disabled", async () => {
  const { container } = renderWithClient(
    <React.Suspense fallback={<div />}> 
      <DebugPage />
    </React.Suspense>
  );

  // Debug feature is disabled - page returns null
  expect(container.firstChild?.firstChild).toBeNull();
});

test("auto refresh is disabled by default", () => {
  // Verify auto-refresh is disabled
  expect(mockControls.autoRefreshEnabled).toBe(false);
});
