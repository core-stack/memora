import { BasePlugin } from './base-plugin.class';

export abstract class SyncPlugin<T extends Record<string, unknown>> extends BasePlugin<T> {
  
}