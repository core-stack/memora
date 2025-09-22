import type { PluginFilter, PluginRegistry } from "@memora/schemas"

export interface PluginRegistryRoutes {
  "/api/plugin-registry": {
    GET: {
      query: PluginFilter;
      response: PluginRegistry[];
    }
  },
}