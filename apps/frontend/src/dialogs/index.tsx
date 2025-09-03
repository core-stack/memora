"use client";
import { CreateKnowledgeDialog } from "./create-knowledge";
import { CreateSourceDialog } from "./create-source";

export enum DialogType {
  CREATE_SOURCE = "create-source",
  CREATE_KNOWLEDGE = "create-knowledge"
}

export const dialogs = {
  [DialogType.CREATE_SOURCE]: (props: any) => <CreateSourceDialog {...props} />,
  [DialogType.CREATE_KNOWLEDGE]: (props: any) => <CreateKnowledgeDialog {...props} />
}