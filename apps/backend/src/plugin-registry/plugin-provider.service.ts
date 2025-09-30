import { Injectable, Logger } from '@nestjs/common';

import { PluginServiceProvider } from './types/plugin-service-provider';

@Injectable()
export class PluginProviderRegistry implements PluginServiceProvider {
  private readonly logger = new Logger(PluginProviderRegistry.name);
  private services = new Map<string, any>();

  registerService(serviceName: string, serviceInstance: any): void {
    if (this.services.has(serviceName)) {
      this.logger.warn(`Service ${serviceName} is already registered, overwriting`);
    }
    this.services.set(serviceName, serviceInstance);
    this.logger.log(`Service ${serviceName} registered for plugins`);
  }

  getService<T>(serviceName: string): T | undefined {
    const service = this.services.get(serviceName);
    if (!service) {
      this.logger.warn(`Service ${serviceName} not found in registry`);
    }
    return service as T;
  }

  hasService(serviceName: string): boolean {
    return this.services.has(serviceName);
  }

  getAllServices(): Map<string, any> {
    return new Map(this.services);
  }

  removeService(serviceName: string): boolean {
    return this.services.delete(serviceName);
  }
}