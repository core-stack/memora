export interface PluginServiceProvider {
  getService<T>(name: string): Promise<T | undefined> | T | undefined;
  hasService(name: string): Promise<boolean> | boolean;
}