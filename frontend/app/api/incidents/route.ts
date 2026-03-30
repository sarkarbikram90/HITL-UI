import { proxyJsonResponse } from "@/lib/api-proxy";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  return proxyJsonResponse({
    path: "/api/incidents",
    method: "GET",
    query: searchParams.toString(),
  });
}

export async function POST(req: Request) {
  const body = await req.json();
  return proxyJsonResponse({
    path: "/api/incidents",
    method: "POST",
    body,
  });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  return proxyJsonResponse({
    path: "/api/incidents",
    method: "PATCH",
    body,
  });
}
