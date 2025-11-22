"use client";

import { ConfirmDialog } from './confirm';
import { CreateFolderDialog } from './create-folder';
import { ConfigureLLDialog } from './create-llm/configure-llm';
import { SelectPresetDialog } from './create-llm/select-preset';
import { CreateOrUpdateKnowledgeDialog } from './create-or-update-knowledge';
import { CreateSourceDialog } from './create-source';
import { CreateTenantDialog } from './create-tenant';
import { InviteMemberDialog } from './invite-member';
import { SearchDialog } from './search';
import { SelectTenantDialog } from './select-tenant';

import type { SelectTenantDialogProps } from './select-tenant';
import type { SelectPresetDialogProps } from './create-llm/select-preset';
import type { ConfigureLLDialogProps } from './create-llm/configure-llm';
import type { ConfirmDialogProps } from "./confirm";
import type { CreateOrUpdateKnowledgeDialogProps } from "./create-or-update-knowledge";
import type { CreateFolderDialogProps } from "./create-folder";
import type { CreateSourceDialogProps } from "./create-source";

export enum DialogType {
  CREATE_SOURCE = "create-source",
  CREATE_FOLDER = "create-folder",
  CREATE_OR_UPDATE_KNOWLEDGE = "create-knowledge",
  SEARCH = "search",
  CONFIRM = "confirm",
  SELECT_LLM_PRESET = "select-llm-preset",
  CONFIGURE_LLM = "configure-llm",
  CREATE_TENANT = "create-tenant",
  INVITE_MEMBER = "invite-member",
  SELECT_TENANT = "select-tenant"
}

export const dialogs = {
  [DialogType.CREATE_SOURCE]: (props: CreateSourceDialogProps) => <CreateSourceDialog {...props} />,
  [DialogType.CREATE_FOLDER]: (props: CreateFolderDialogProps) => <CreateFolderDialog {...props} />,
  [DialogType.CREATE_OR_UPDATE_KNOWLEDGE]: (props: CreateOrUpdateKnowledgeDialogProps) => <CreateOrUpdateKnowledgeDialog {...props} />,
  [DialogType.SEARCH]: () => <SearchDialog />,
  [DialogType.CONFIRM]: (props: ConfirmDialogProps) => <ConfirmDialog {...props} />,
  [DialogType.CONFIGURE_LLM]: (props: ConfigureLLDialogProps) => <ConfigureLLDialog {...props} />,
  [DialogType.SELECT_LLM_PRESET]: (props: SelectPresetDialogProps) => <SelectPresetDialog {...props} />,
  [DialogType.CREATE_TENANT]: () => <CreateTenantDialog />,
  [DialogType.INVITE_MEMBER]: () => <InviteMemberDialog />,
  [DialogType.SELECT_TENANT]: (props: SelectTenantDialogProps) => <SelectTenantDialog {...props} />,
} as const;