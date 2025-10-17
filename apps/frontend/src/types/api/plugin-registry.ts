import type { PluginRegistry, PluginRegistryFilter } from "@snipet/schemas"

export interface PluginRegistryRoutes {
  "/api/plugin-registry": {
    GET: {
      query: PluginRegistryFilter;
      response: PluginRegistry[];
    }
  },
}