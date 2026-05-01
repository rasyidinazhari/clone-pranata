import { createServerFn } from "@tanstack/react-start";

export type RouteCheckResult = {
  path: string;
  status: number;
  ok: boolean;
  durationMs: number;
  error?: string;
};

const ROUTES = ["/", "/dashboard", "/rekomendasi", "/historis", "/tentang"];

export const checkAllRoutes = createServerFn({ method: "GET" })
  .handler(async (): Promise<{ checkedAt: string; baseUrl: string; results: RouteCheckResult[] }> => {
    const { getRequest } = await import("@tanstack/react-start/server");
    const req = getRequest();
    const reqUrl = new URL(req.url);
    const baseUrl = `${reqUrl.protocol}//${reqUrl.host}`;

    const results = await Promise.all(
      ROUTES.map(async (path): Promise<RouteCheckResult> => {
        const start = Date.now();
        try {
          const res = await fetch(`${baseUrl}${path}`, {
            method: "GET",
            headers: { Accept: "text/html" },
          });
          return {
            path,
            status: res.status,
            ok: res.ok,
            durationMs: Date.now() - start,
          };
        } catch (e) {
          return {
            path,
            status: 0,
            ok: false,
            durationMs: Date.now() - start,
            error: e instanceof Error ? e.message : String(e),
          };
        }
      })
    );

    return { checkedAt: new Date().toISOString(), baseUrl, results };
  });
