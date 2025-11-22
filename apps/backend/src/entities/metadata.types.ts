import { Field } from '@/shared/model';

export enum SourceType {
  TEXT = "TEXT",
  DOC = "DOC",
  LINK = "LINK",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  IMAGE = "IMAGE",
}

export class BaseFileMetadata {
  @Field({ type: "string" })
  extension: string;

  @Field({ type: "string" })
  contentType: string;

  @Field({ type: "number" })
  size: number;

  @Field({ type: "number", required: false })
  lastModified?: number;

  @Field({ type: "class", class: () => Object, required: false })
  exif?: Record<string, any>;
}

export class SourceDocMetadata extends BaseFileMetadata {
  @Field({ type: "enum", enum: SourceType })
  type: SourceType.DOC;
}

export class SourceVideoMetadata extends BaseFileMetadata {
  @Field({ type: "enum", enum: SourceType })
  type: SourceType.VIDEO;

  @Field({ type: "number", required: false })
  width?: number;

  @Field({ type: "number", required: false })
  height?: number;

  @Field({ type: "number", required: false })
  duration?: number;
}

export class SourceAudioMetadata extends BaseFileMetadata {
  @Field({ type: "enum", enum: SourceType })
  type: SourceType.AUDIO;

  @Field({ type: "number", required: false })
  duration?: number;
}

export class SourceImageMetadata extends BaseFileMetadata {
  @Field({ type: "enum", enum: SourceType })
  type: SourceType.IMAGE;

  @Field({ type: "number", required: false })
  width?: number;

  @Field({ type: "number", required: false })
  height?: number;
}
export type SourceMetadata =
  | SourceDocMetadata
  | SourceVideoMetadata
  | SourceAudioMetadata
  | SourceImageMetadata;
