"use client";

import { ConfirmDialog } from './confirm';
import { CreateKnowledgeFolderDialog } from './create-folder';
import { CreateOrUpdateKnowledgeDialog } from './create-or-update-knowledge';
import { CreateSourceDialog } from './create-source';
import { InstallPluginDialog } from './install-plugin';
import { SearchDialog } from './search';

export enum DialogType {
  CREATE_SOURCE = "create-source",
  CREATE_FOLDER = "create-folder",
  CREATE_OR_UPDATE_KNOWLEDGE = "create-knowledge",
  INSTALL_PLUGIN = "install-plugin",
  SEARCH = "search",
  CONFIRM = "confirm",
}

export const dialogs = {
  [DialogType.CREATE_SOURCE]: (props: any) => <CreateSourceDialog {...props} />,
  [DialogType.CREATE_FOLDER]: (props: any) => <CreateKnowledgeFolderDialog {...props} />,
  [DialogType.CREATE_OR_UPDATE_KNOWLEDGE]: (props: any) => <CreateOrUpdateKnowledgeDialog {...props} />,
  [DialogType.INSTALL_PLUGIN]: (props: any) => <InstallPluginDialog {...props} />,
  [DialogType.SEARCH]: (props: any) => <SearchDialog {...props} />,
  [DialogType.CONFIRM]: (props: any) => <ConfirmDialog {...props} />,
}