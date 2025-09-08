import { randomUUID } from 'crypto';
import { createReadStream, promises as fs } from 'fs';
import { join } from 'path';

import { env } from '@/env';
import { Injectable } from '@nestjs/common';

import { GetPreSignedUploadUrlOptions, StorageService } from '../storage.service';

@Injectable()
export class LocalStorageService extends StorageService {
  static readonly basePath = env.LOCAL_STORAGE_PATH;
  static readonly uploadURL = `${env.API_URL}/local-upload`;
  
  getVisualizationUrl(key: string): Promise<{ url: string, key: string }> | { url: string, key: string } {
    // TODO - implement
    throw new Error('Method not implemented.');
  }

  async getUploadUrl(
    key: string,
    contentType: string,
    { temp }: GetPreSignedUploadUrlOptions = { temp: false }
  ): Promise<{ url: string, key: string }> {
    if (temp) key = `temp/${key}`;

    const token = randomUUID();
    await fs.mkdir(join(LocalStorageService.basePath, 'tokens'), { recursive: true });
    await fs.writeFile(
      join(LocalStorageService.basePath, 'tokens', token),
      JSON.stringify({ key, contentType, exp: Date.now() + 5 * 60 * 1000 })
    );

    return { url: `${LocalStorageService.uploadURL}/${token}`, key };
  }

  async confirmTempUpload(key: string): Promise<boolean> {
    const tempPath = join(LocalStorageService.basePath, 'temp', key);
    const finalPath = join(LocalStorageService.basePath, key);
    await fs.mkdir(join(finalPath, '..'), { recursive: true });
    await fs.rename(tempPath, finalPath);
    return true;
  }

  async getPreSignedDownloadUrl(key: string): Promise<string> {
    return this.buildPublicUrl(key);
  }

  async getObject(key: string): Promise<NodeJS.ReadableStream | null> {
    const filePath = join(LocalStorageService.basePath, key);
    return createReadStream(filePath);
  }

  async putObject(key: string, body: Buffer): Promise<void> {
    const filePath = join(LocalStorageService.basePath, key);
    await fs.mkdir(join(filePath, '..'), { recursive: true });
    await fs.writeFile(filePath, body);
  }

  buildPublicUrl(key: string): string {
    return `${LocalStorageService.uploadURL}/${key}`;
  }
}
