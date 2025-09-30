import { env } from 'src/env';

import {
  CopyObjectCommand, GetObjectCommand, PutObjectCommand, S3Client
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';

import { GetPreSignedUploadUrlOptions, StorageService } from '../storage.service';

@Injectable()
export class S3Service extends StorageService {
  private readonly s3: S3Client;
  private readonly defaultBucket?: string;
  private readonly publicBaseURL?: string;

  constructor() {
    super();
    if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) return;
    this.defaultBucket = env.AWS_BUCKET;
    this.publicBaseURL = env.AWS_PUBLIC_BUCKET_BASE_URL;
    this.s3 = new S3Client({
      region: env.AWS_REGION ?? "auto",
      endpoint: env.AWS_ENDPOINT,
      forcePathStyle: env.AWS_FORCE_PATH_STYLE,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async getUploadUrl(
    key: string,
    contentType: string,
    { publicAccess, temp }: GetPreSignedUploadUrlOptions = {
      publicAccess: false,
      temp: false
    }
  ): Promise<{ url: string, key: string }> {
    if (temp) {
      key = `temp/${key}`
    }

    const command = new PutObjectCommand({
      Bucket: this.defaultBucket,
      Key: key,
      ContentType: contentType,
      ACL: publicAccess ? "public-read" : "private",
    });
    return { url: await getSignedUrl(this.s3, command, { expiresIn: 300 }), key };
  }

  async getVisualizationUrl(key: string): Promise<{ url: string, key: string }> {
    const command = new GetObjectCommand({
      Bucket: this.defaultBucket,
      Key: key,
    });

    return { url: await getSignedUrl(this.s3, command, { expiresIn: 300 }), key};
  }

  async confirmTempUpload(key: string, bucket = this.defaultBucket): Promise<string> {
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

  async getPreSignedDownloadUrl(key: string, bucket = this.defaultBucket): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    return getSignedUrl(this.s3, command, { expiresIn: 300 });
  }

  async getObject(key: string, bucket = this.defaultBucket): Promise<NodeJS.ReadableStream | null> {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const result = await this.s3.send(command);
    return result.Body as NodeJS.ReadableStream | null;
  }

  async putObject(key: string, body: Buffer, contentType: string, opts: { bucket?: string } = { bucket: this.defaultBucket } ): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: opts.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await this.s3.send(command);
  }

  buildPublicUrl(key: string, publicBaseURL = this.publicBaseURL): string {
    return `${publicBaseURL}/${key}`;
  }
}
