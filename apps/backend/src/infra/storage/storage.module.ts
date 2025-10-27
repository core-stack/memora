import { env } from '@/env';
import { Module } from '@nestjs/common';

import { PrivateStorageService } from './private-storage.service';
import { PublicStorageService } from './public-storage.service';
import { S3Service } from './s3';

@Module({
  providers:  [
    {
      provide: PrivateStorageService,
      useFactory: () => new S3Service({ Bucket: env.AWS_BUCKET, ACL: "private" }),
    },
    {
      provide: PublicStorageService,
      useFactory: () => new S3Service({ 
        Bucket: env.AWS_PUBLIC_BUCKET, ACL: "public-read"
      }, {
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${env.AWS_PUBLIC_BUCKET}/*`],
          },
        ],
      }),
    },
  ],
  exports: [PublicStorageService, PrivateStorageService]
})
export class StorageModule {}
