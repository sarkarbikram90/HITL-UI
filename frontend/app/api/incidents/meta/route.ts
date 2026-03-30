import { proxyJsonResponse } from "@/lib/api-proxy";

export async function GET() {
  return proxyJsonResponse({ path: "/api/incidents/meta" });
}
