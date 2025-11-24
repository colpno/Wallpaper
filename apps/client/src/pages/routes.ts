import { createBrowserRouter, type RouteObject } from "react-router";

const routes: RouteObject[] = [];

// Dynamically extract all route configurations in the current directory
const modules = import.meta.glob("./*/route.ts", { eager: true }) as Record<
  string,
  { default?: RouteObject }
>;
for (const key of Object.keys(modules)) {
  const mod = modules[key];
  if (!mod || typeof mod !== "object" || !("default" in mod)) continue;
  const def = mod.default as RouteObject | undefined;
  if (!def) continue;
  routes.push(def);
}

export default createBrowserRouter(routes);
