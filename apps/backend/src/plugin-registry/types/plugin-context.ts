import { Logger } from '@nestjs/common';

import { PluginServiceProvider } from './plugin-service-provider';

export type PluginContext<TConfig = any> = {
  logger: Logger;
  provider: PluginServiceProvider;
  config: TConfig;
}