import { PluginConfigSchema } from './config.interface';

export interface IPlugin<Config = any> {
  name: string;
  description: string;
  icon: string;
  configSchema: PluginConfigSchema<Config>;
  test(config: Config): Promise<boolean> | boolean;
}