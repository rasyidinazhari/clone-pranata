import { createServerFn } from "@tanstack/react-start";

import type { RouteCheckResult } from "../server/routeCheck.functions";

export const checkAllRoutes = createServerFn({ method: "GET" }).handler(async () => {
  const { runRouteCheck } = await import("./routeCheck.server");
  return runRouteCheck();
});
