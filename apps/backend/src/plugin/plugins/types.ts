import { PluginConfigSchema } from "../base/config.interface";

export interface IPlugin<Config = any> {
  name: string;
  description: string;
  icon: string;
  configSchema: PluginConfigSchema<Config>;
}