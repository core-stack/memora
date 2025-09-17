import { PluginInstance } from "./base/plugin";
import { PostgresPlugin } from "./postgres";

export const plugins: Record<string, new (id: string) => PluginInstance<any>> = {
  postgres: PostgresPlugin
}