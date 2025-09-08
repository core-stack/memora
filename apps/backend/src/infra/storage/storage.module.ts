import { DynamicModule, Module, Provider } from "@nestjs/common";

import { S3Service } from "./s3";
import { StorageService } from "./storage.service";

@Module({
  providers: [{
    provide: StorageService,
    useClass: S3Service
  }],
  exports: [StorageService]
})
export class StorageModule {
  static register(): DynamicModule {
    const providers: Provider[] = [
      {
        provide: StorageService,
        useClass: S3Service,
      },
    ];

    return {
      module: StorageModule,
      providers,
      exports: [StorageService],
    }
  }
}
