export type GetPreSignedUploadUrlOptions = {
  publicAccess?: boolean;
  temp?: boolean
}

export abstract class StorageService {
  abstract getUploadUrl(
    key: string,
    contentType: string,
    opts?: GetPreSignedUploadUrlOptions
  ): Promise<{ url: string, key: string }> | { url: string, key: string };
  abstract getVisualizationUrl(key: string): Promise<{ url: string, key: string }> | { url: string, key: string };
  abstract confirmTempUpload(key: string): Promise<string> | string;
  abstract getPreSignedDownloadUrl(key: string): Promise<string> | string;
  abstract getObject(key: string): Promise<NodeJS.ReadableStream | null> | NodeJS.ReadableStream | null;
  abstract putObject(key: string, body: Buffer, contentType: string, opts?: { bucket?: string }): Promise<void>;

  abstract delete(key: string, isFolder?: boolean): Promise<void>;
}
