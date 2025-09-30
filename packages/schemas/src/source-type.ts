import z from 'zod';

export enum SourceType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  DOC = "DOC",
  LINK = "LINK"
}

export const sourceTypeSchema = z.nativeEnum(SourceType);