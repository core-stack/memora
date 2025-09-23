import { PluginServiceProvider } from './plugin-service-provider';

export type PluginContext<TConfig = any> = {
  provider: PluginServiceProvider;
  config: TConfig;
}