import z from 'zod';

export enum SourceType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  FILE = "FILE",
  LINK = "LINK"
}

export const sourceTypeSchema = z.nativeEnum(SourceType);