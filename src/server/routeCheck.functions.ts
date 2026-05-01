import { createServerFn } from "@tanstack/react-start";

export type { RouteCheckResult } from "./routeCheck.server";

export const checkAllRoutes = createServerFn({ method: "GET" }).handler(async () => {
  const { runRouteCheck } = await import("./routeCheck.server");
  return runRouteCheck();
});
