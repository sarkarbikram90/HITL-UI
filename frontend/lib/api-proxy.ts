/**
 * Shared proxy helper for forwarding Next.js API requests to the Go backend.
 */

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export interface ProxyOptions {
  /** Path on the Go backend (e.g. "/api/incidents") */
  path: string;
  /** HTTP method */
  method?: string;
  /** Query string (already formatted) */
  query?: string;
  /** JSON body to forward */
  body?: unknown;
  /** Request headers to forward */
  headers?: Record<string, string>;
}

/**
 * Proxy a request to the Go backend and return the raw Response.
 */
export async function proxyToBackend(opts: ProxyOptions): Promise<Response> {
  const url = `${BACKEND_URL}${opts.path}${opts.query ? `?${opts.query}` : ""}`;

  const init: RequestInit = {
    method: opts.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  };

  if (opts.body !== undefined && opts.method !== "GET") {
    init.body = JSON.stringify(opts.body);
  }

  const res = await fetch(url, init);
  return res;
}

/**
 * Proxy and return a NextResponse-compatible result.
 * Preserves status codes and JSON body from the Go backend.
 */
export async function proxyJsonResponse(opts: ProxyOptions) {
  const { NextResponse } = await import("next/server");

  try {
    const res = await proxyToBackend(opts);
    const text = await res.text();

    // Try to parse as JSON, fall back to text
    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      body = { error: text || res.statusText };
    }

    return NextResponse.json(body, { status: res.status });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Backend unavailable";
    return NextResponse.json(
      { error: `Backend connection failed: ${message}` },
      { status: 502 }
    );
  }
}
