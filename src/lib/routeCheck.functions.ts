import { createServerFn } from "@tanstack/react-start";
export type { RouteCheckResult } from "../server/routeCheck.server";

export const checkAllRoutes = createServerFn({ method: "GET" }).handler(async () => {
  const { runRouteCheck } = await import("../server/routeCheck.server");
  return runRouteCheck();
});
