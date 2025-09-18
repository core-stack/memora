import { IPlugin } from './plugin';
import { PluginContext } from './plugin-context';

export interface PluginDefinition<TConfig = any, TInstance = IPlugin> {
  initialize: (ctx: PluginContext<TConfig>) => Promise<TInstance>;
}