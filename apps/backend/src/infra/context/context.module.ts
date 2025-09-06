import { DynamicModule, Module } from '@nestjs/common';

import { ContextProvider } from './context.provider';

@Module({
  providers: [ContextProvider],
  exports: [ContextProvider]
})
export class ContextModule {
  static forRoot(): DynamicModule {
    return {
      module: ContextModule,
      providers: [ContextProvider],
      exports: [ContextProvider],
      global: true
    }
  } 
}