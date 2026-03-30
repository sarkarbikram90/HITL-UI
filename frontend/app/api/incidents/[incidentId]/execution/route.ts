import { proxyJsonResponse } from "@/lib/api-proxy";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ incidentId: string }> }
) {
  const { incidentId } = await ctx.params;
  return proxyJsonResponse({
    path: `/api/incidents/${encodeURIComponent(incidentId)}/execution`,
  });
}

export async function POST(
  req: Request,
  ctx: { params: Promise<{ incidentId: string }> }
) {
  const { incidentId } = await ctx.params;
  const body = await req.json();
  return proxyJsonResponse({
    path: `/api/incidents/${encodeURIComponent(incidentId)}/execution`,
    method: "POST",
    body,
  });
}
