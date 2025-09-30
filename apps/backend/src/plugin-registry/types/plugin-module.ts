import { IPlugin } from './plugin';
import { PluginContext } from './plugin-context';

export interface PluginModule<TConfig = any, TInstance = IPlugin> {
  initialize: (ctx: PluginContext<TConfig>) => Promise<TInstance>;
}