"use client";

import dynamic from "next/dynamic";

const MockDebugPanel = dynamic(
  () => import("@/components/mocks/MockDebugPanel").then((m) => m.MockDebugPanel),
  { ssr: false }
);

export default function MockDebugPanelLoader() {
  return <MockDebugPanel />;
}