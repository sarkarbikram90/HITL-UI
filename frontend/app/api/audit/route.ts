import { proxyJsonResponse } from "@/lib/api-proxy";

// Global audit logs endpoint (all incidents)
export async function GET() {
  return proxyJsonResponse({ path: "/api/audit" });
}
