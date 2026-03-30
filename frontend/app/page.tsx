import { Suspense } from "react";
import { RemediationConsole } from "@/components/remediation/RemediationConsole";

function ConsoleFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)] text-sm text-[var(--color-muted-foreground)]">
      Loading console…
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<ConsoleFallback />}>
      <RemediationConsole />
    </Suspense>
  );
}
