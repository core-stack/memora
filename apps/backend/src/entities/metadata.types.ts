export enum SourceType {
  TEXT = "TEXT",
  DOC = "DOC",
  LINK = "LINK",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  IMAGE = "IMAGE",
}

export class BaseFileMetadata {
  extension: string;
  contentType: string;
  size: number;
  lastModified?: number;
  exif?: Record<string, any>;
}

export class SourceDocMetadata extends BaseFileMetadata {
  type: SourceType.DOC;
}

export class SourceVideoMetadata extends BaseFileMetadata {
  type: SourceType.VIDEO;
  width?: number;
  height?: number;
  duration?: number;
}

export class SourceAudioMetadata extends BaseFileMetadata {
  type: SourceType.AUDIO;
  duration?: number;
}

export class SourceImageMetadata extends BaseFileMetadata {
  type: SourceType.IMAGE;
  width?: number;
  height?: number;
}

export type SourceMetadata =
  | SourceDocMetadata
  | SourceVideoMetadata
  | SourceAudioMetadata
  | SourceImageMetadata;
