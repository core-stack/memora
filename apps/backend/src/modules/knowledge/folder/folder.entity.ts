import { createKnowledgeFolderSchema, knowledgeFolderSchema, updateKnowledgeFolderSchema } from "@snipet/schemas";
import z from "zod";

export const folderEntity = knowledgeFolderSchema;
export type FolderEntity = z.infer<typeof folderEntity>;

export const createFolderEntity = folderEntity.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export type CreateFolderEntity = z.infer<typeof createFolderEntity>;

export const updateFolderEntity = updateKnowledgeFolderSchema;
export type UpdateFolderEntity = z.infer<typeof updateFolderEntity>;