"use client";
import { CreateSourceDialog } from './create-source';

export enum DialogType {
  CREATE_SOURCE = "create-source"
}

export const dialogs = {
  [DialogType.CREATE_SOURCE]: (props: any) => <CreateSourceDialog {...props} /> 
}