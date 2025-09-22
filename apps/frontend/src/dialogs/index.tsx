"use client";
import { CreateKnowledgeFolderDialog } from "./create-folder";
import { CreateKnowledgeDialog } from "./create-knowledge";
import { CreateSourceDialog } from "./create-source";
import { InstallPluginDialog } from "./install-plugin";

export enum DialogType {
  CREATE_SOURCE = "create-source",
  CREATE_FOLDER = "create-folder",
  CREATE_KNOWLEDGE = "create-knowledge",
  INSTALL_PLUGIN = "install-plugin"
}

export const dialogs = {
  [DialogType.CREATE_SOURCE]: (props: any) => <CreateSourceDialog {...props} />,
  [DialogType.CREATE_FOLDER]: (props: any) => <CreateKnowledgeFolderDialog {...props} />,
  [DialogType.CREATE_KNOWLEDGE]: (props: any) => <CreateKnowledgeDialog {...props} />,
  [DialogType.INSTALL_PLUGIN]: (props: any) => <InstallPluginDialog {...props} />
}