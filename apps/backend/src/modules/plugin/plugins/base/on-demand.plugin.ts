import { BasePlugin } from './base-plugin.class';

export abstract class OnDemandPlugin<T extends Record<string, unknown>> extends BasePlugin<T> {
  abstract load(config: T): Promise<void>;
  abstract unload(): Promise<void>;
  
  abstract run(): Promise<void>;
}