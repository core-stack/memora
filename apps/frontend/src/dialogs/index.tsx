"use client";

import { ConfirmDialog } from './confirm';
import { CreateKnowledgeFolderDialog } from './create-folder';
import { ConfigureLLDialog } from './create-llm/configure-llm';
import { SelectPresetDialog } from './create-llm/select-preset';
import { CreateOrUpdateKnowledgeDialog } from './create-or-update-knowledge';
import { CreateSourceDialog } from './create-source';
import { InstallPluginDialog } from './install-plugin';
import { SearchDialog } from './search';

import type { InstallPluginProps } from './install-plugin';
import type { SelectPresetDialogProps } from './create-llm/select-preset';
import type { ConfigureLLDialogProps } from './create-llm/configure-llm';
import type { ConfirmDialogProps } from "./confirm";
import type { CreateOrUpdateKnowledgeDialogProps } from "./create-or-update-knowledge";
import type { CreateKnowledgeFolderDialogProps } from "./create-folder";
import type { CreateSourceDialogProps } from "./create-source";
import { CreateTenantDialog } from './create-tenant';

export enum DialogType {
  CREATE_SOURCE = "create-source",
  CREATE_FOLDER = "create-folder",
  CREATE_OR_UPDATE_KNOWLEDGE = "create-knowledge",
  INSTALL_PLUGIN = "install-plugin",
  SEARCH = "search",
  CONFIRM = "confirm",
  SELECT_LLM_PRESET = "select-llm-preset",
  CONFIGURE_LLM = "configure-llm",
  CREATE_TENANT = "create-tenant"
}

export const dialogs = {
  [DialogType.CREATE_SOURCE]: (props: CreateSourceDialogProps) => <CreateSourceDialog {...props} />,
  [DialogType.CREATE_FOLDER]: (props: CreateKnowledgeFolderDialogProps) => <CreateKnowledgeFolderDialog {...props} />,
  [DialogType.CREATE_OR_UPDATE_KNOWLEDGE]: (props: CreateOrUpdateKnowledgeDialogProps) => <CreateOrUpdateKnowledgeDialog {...props} />,
  [DialogType.INSTALL_PLUGIN]: (props: InstallPluginProps) => <InstallPluginDialog {...props} />,
  [DialogType.SEARCH]: () => <SearchDialog />,
  [DialogType.CONFIRM]: (props: ConfirmDialogProps) => <ConfirmDialog {...props} />,
  [DialogType.CONFIGURE_LLM]: (props: ConfigureLLDialogProps) => <ConfigureLLDialog {...props} />,
  [DialogType.SELECT_LLM_PRESET]: (props: SelectPresetDialogProps) => <SelectPresetDialog {...props} />,
  [DialogType.CREATE_TENANT]: () => <CreateTenantDialog />
} as const;