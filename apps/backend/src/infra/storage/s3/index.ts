import { env } from '@/env';
import {
  CopyObjectCommand, CreateBucketCommand, Delete, DeleteObjectsCommand, GetObjectCommand,
  ListBucketsCommand, ListObjectsV2Command, PutBucketPolicyCommand, PutObjectCommand, S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { StorageDeleteError } from '../errors/delete-error';
import { GetPreSignedUploadUrlOptions, StorageService } from '../storage.service';

import type { CreateBucketCommandInput } from '@aws-sdk/client-s3';
@Injectable()
export class S3Service extends StorageService implements OnModuleInit {
  private readonly logger = new Logger(S3Service.name);

  private readonly s3: S3Client;

  constructor(private config: CreateBucketCommandInput, private policy?: Record<string, any>) {
    super();
    if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) return;
    this.s3 = new S3Client({
      region: env.AWS_REGION,
      endpoint: env.AWS_ENDPOINT,
      forcePathStyle: env.AWS_FORCE_PATH_STYLE,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async onModuleInit() {
    const res = await this.s3.send(new ListBucketsCommand());
    if (!res.Buckets) {
      this.logger.warn('No buckets found');
      return;
    }
    if (res.Buckets.find(b => b.Name === this.config.Bucket)) {
      this.logger.verbose(`Bucket ${this.config.Bucket} already exists`);
    } else {
      this.logger.verbose(`Creating bucket ${this.config.Bucket}`);
      await this.s3.send(new CreateBucketCommand(this.config));
      this.logger.verbose(`Bucket ${this.config.Bucket} created`);
    }
    if (this.policy) {
      this.logger.verbose(`Setting policy for bucket ${this.config.Bucket}`);
      await this.s3.send(new PutBucketPolicyCommand({ Bucket: this.config.Bucket, Policy: JSON.stringify(this.policy) }));
      this.logger.verbose(`Policy set for bucket ${this.config.Bucket}`);
    }
  }

  async getUploadUrl(
    key: string,
    contentType: string,
    { temp }: GetPreSignedUploadUrlOptions = { temp: false }
  ): Promise<{ url: string, key: string }> {
    if (temp) {
      key = `temp/${key}`
    }

    const command = new PutObjectCommand({
      Bucket: this.config.Bucket,
      Key: key,
      ContentType: contentType,
    });
    return { url: await getSignedUrl(this.s3, command, { expiresIn: 300 }), key };
  }

  async getVisualizationUrl(key: string): Promise<{ url: string, key: string }> {
    const command = new GetObjectCommand({
      Bucket: this.config.Bucket,
      Key: key,
    });

    return { url: await getSignedUrl(this.s3, command, { expiresIn: 300 }), key};
  }

  async confirmTempUpload(key: string, bucket = this.config.Bucket): Promise<string> {
    const targetKey = key.replace("temp/", "");
    const sourceKey = key.startsWith("temp/") ? key : `temp/${key}`

    const command = new CopyObjectCommand({
      Bucket: bucket,
      CopySource: `/${bucket}/${sourceKey}`,
      Key: targetKey,
    });

    const res = await this.s3.send(command);
    if (!!res.$metadata.httpStatusCode && res.$metadata.httpStatusCode >= 200 && res.$metadata.httpStatusCode < 300) {
      return targetKey;
    }

    throw new Error("Error copying object");
  }

  async getPreSignedDownloadUrl(key: string, bucket = this.config.Bucket): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return getSignedUrl(this.s3, command, { expiresIn: 300 });
  }

  async getObject(key: string, bucket = this.config.Bucket): Promise<NodeJS.ReadableStream | null> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const result = await this.s3.send(command);
    return result.Body as NodeJS.ReadableStream | null;
  }

  async putObject(key: string, body: Buffer, contentType: string, opts: { bucket?: string } = { bucket: this.config.Bucket } ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: opts.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await this.s3.send(command);
  }

  async delete(key: string, isFolder?: boolean): Promise<void> {
    const listOfObjects = await this.s3.send(new ListObjectsV2Command({
      Bucket: this.config.Bucket,
      Prefix: isFolder ? key.endsWith("/") ? key : `${key}/` : key
    }));
    if (!listOfObjects.Contents || listOfObjects.Contents.length === 0) return;
    
    const objectsToDelete: Delete = { Objects: [] };
    listOfObjects.Contents?.forEach((object) => objectsToDelete.Objects?.push({ Key: object.Key }));
  
    const deleteResult = await this.s3.send(new DeleteObjectsCommand({
      Bucket: this.config.Bucket,
      Delete: objectsToDelete,
    }));
  
    if (deleteResult.Errors) {
      throw new StorageDeleteError("Error deleting objects", deleteResult.Errors.map((err) => err.Key).filter(e => e !== undefined));
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async deleteTempFiles() {
    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: this.config.Bucket,
        Prefix: 'temp/',
      });
      const listedObjects = await this.s3.send(listCommand);

      if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

      const now = new Date();
        const expiredObjects = listedObjects.Contents.filter(obj => {
        if (!obj.LastModified) return false;
        const age = (now.getTime() - obj.LastModified.getTime());
        return age > env.DELETE_TEMP_FILES_AFTER;
      });

      if (expiredObjects.length === 0) return;

      const deleteCommand = new DeleteObjectsCommand({
        Bucket: this.config.Bucket,
        Delete: {
          Objects: expiredObjects.map(obj => ({ Key: obj.Key! })),
        },
      });

      const result = await this.s3.send(deleteCommand);

      if (result.Errors && result.Errors.length > 0) {
        this.logger.error(`Error deleting some temp files: ${result.Errors.map(e => e.Key).join(', ')}`);
      } else {
        this.logger.verbose(`Deleted ${expiredObjects.length} expired temp file(s).`);
      }

    } catch (err) {
      this.logger.error('Error while deleting temp files', err instanceof Error ? err.stack : err);
    }
  }
}
