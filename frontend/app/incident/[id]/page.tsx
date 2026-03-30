import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/remediation/Header";
import { SeverityBadge } from "@/components/remediation/SeverityBadge";
import { StatusBadge } from "@/components/remediation/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { IncidentRemediation } from "@/types/incident-remediation";

export const dynamic = "force-dynamic";

async function fetchIncident(id: string): Promise<IncidentRemediation | null> {
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/incidents/${encodeURIComponent(id)}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data ?? null) as IncidentRemediation | null;
  } catch {
    return null;
  }
}

export default async function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const decoded = decodeURIComponent(id);
  const row = await fetchIncident(decoded);
  if (!row) notFound();

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <Header />
      <div className="mx-auto max-w-3xl px-6 py-8">
        <Button variant="ghost" size="sm" className="mb-6 -ml-2 gap-2" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            Back to queue
          </Link>
        </Button>
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted-foreground)]">
                Incident
              </p>
              <h1 className="mt-1 font-mono text-2xl font-semibold">
                {row.incidentId}
              </h1>
              <p className="mt-2 text-lg text-[var(--color-foreground)]">
                {row.anomalyName}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <SeverityBadge severity={row.severity} />
              <StatusBadge status={row.status} />
            </div>
          </div>
          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-[var(--color-muted-foreground)]">
                Resource
              </dt>
              <dd className="mt-1">
                <Badge variant="outline">{row.resource}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[var(--color-muted-foreground)]">
                Category
              </dt>
              <dd className="mt-1">
                <Badge variant="outline">{row.category}</Badge>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[var(--color-muted-foreground)]">
                Confidence
              </dt>
              <dd className="mt-1 text-sm font-medium tabular-nums">
                {row.confidence}%
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-[var(--color-muted-foreground)]">
                Cloud account
              </dt>
              <dd className="mt-1 text-sm">{row.cloudAccount}</dd>
            </div>
          </dl>
          <div className="mt-8">
            <dt className="text-xs font-medium text-[var(--color-muted-foreground)]">
              Proposed command
            </dt>
            <dd className="mt-2 rounded-lg bg-[var(--color-muted)]/50 p-4 font-mono text-sm">
              {row.proposedCommand || <span className="text-[var(--color-muted-foreground)]">No command proposed</span>}
            </dd>
          </div>
          {row.createdAt && (
            <p className="mt-6 text-xs text-[var(--color-muted-foreground)]">
              Detected: {new Date(row.createdAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
