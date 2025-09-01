import { CopyObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";

import { env } from "src/env";

type S3Options = {
  endpoint?: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  publicBaseURL?: string;
  defaultBucket?: string;
}

type GetPreSignedUploadUrlOptions = {
  publicAccess?: boolean;
  bucket?: string
  temp?: boolean
}

@Injectable()
export class StorageService {
  private readonly s3: S3Client;
  private readonly defaultBucket?: string;
  private readonly publicBaseURL?: string;
  constructor() {
    if (!env.S3_ACCESS_KEY_ID || !env.S3_SECRET_ACCESS_KEY) return;
    this.defaultBucket = env.S3_DEFAULT_BUCKET;
    this.publicBaseURL = env.S3_PUBLIC_BASE_URL;
    this.s3 = new S3Client({
      region: env.S3_REGION ?? "auto",
      endpoint: env.S3_ENDPOINT,
      credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY,
      },
    });
  }

  async getPreSignedUploadUrl(
    key: string,
    contentType: string,
    { publicAccess, bucket, temp }: GetPreSignedUploadUrlOptions = {
      publicAccess: false,
      temp: false
    }
  ): Promise<string> {
    if (!bucket) {
      bucket = this.defaultBucket
    }
    if (temp) {
      key = `temp/${key}`
    }
    console.log(bucket, key);

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
      ACL: publicAccess ? "public-read" : "private",
    });
    return getSignedUrl(this.s3, command, { expiresIn: 300 });
  }

  async confirmTempUpload(key: string, bucket = this.defaultBucket): Promise<boolean> {
    key = `temp/${key}`
    const command = new CopyObjectCommand({
      Bucket: bucket,
      CopySource: `/${bucket}/${key}`,
      Key: key,
    });

    const res = await this.s3.send(command);
    return !!res.$metadata.httpStatusCode && res.$metadata.httpStatusCode >= 200 && res.$metadata.httpStatusCode < 300
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

  async putObject(key: string, body: Buffer, contentType: string, bucket = this.defaultBucket): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: bucket,
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
