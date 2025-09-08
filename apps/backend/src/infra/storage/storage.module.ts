import { env } from '@/env';
import { DynamicModule, Module, Provider } from '@nestjs/common';

import { LocalStorageService } from './local';
import { LocalUploadController } from './local/controller';
import { S3Service } from './s3';
import { StorageService } from './storage.service';

@Module({
  providers: [{
    provide: StorageService,
    useClass: env.STORAGE_TYPE === 's3' ? S3Service : LocalStorageService
  }],
  exports: [StorageService]
})
export class StorageModule {
  static register(): DynamicModule {
    const providers: Provider[] = [
      {
        provide: StorageService,
        useClass: env.STORAGE_TYPE === 's3' ? S3Service : LocalStorageService,
      },
    ];

    const controllers =
      env.STORAGE_TYPE === 'local' ? [LocalUploadController] : [];

    return {
      module: StorageModule,
      providers,
      controllers,
      exports: [StorageService],
    }
  }
}
