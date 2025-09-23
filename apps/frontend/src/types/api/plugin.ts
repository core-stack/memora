import type { PluginFilter, CreatePlugin, UpdatePlugin, Plugin } from "@memora/schemas"

export interface PluginRoutes {
  "/api/plugin": {
    GET: {
      query: PluginFilter;
      response: Plugin[];
    },
    POST: {
      body: CreatePlugin;
      response: Plugin;
    }
  },
  "/api/plugin/:id": {
    PUT: {
      body: UpdatePlugin;
      params: { id: string };
      response: undefined;
    },
    DELETE: {
      params: { id: string };
      response: undefined;
    }
  },
  "/api/plugin/test": {
    POST: {
      body: CreatePlugin;
      response: boolean;
    }
  }
}