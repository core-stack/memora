import type { PluginRegistry, PluginRegistryFilter } from "@memora/schemas"

export interface PluginRegistryRoutes {
  "/api/plugin-registry": {
    GET: {
      query: PluginRegistryFilter;
      response: PluginRegistry[];
    }
  },
}