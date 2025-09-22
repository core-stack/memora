import type { PluginRegistry } from '@memora/schemas';
import React, { useState } from 'react';

export enum Tab {
  TREE_SOURCE,
  EXTERNAL_SOURCE,
  ADD_SOURCE,
  NONE
}

type TreeSourceContextProps = {
  selectedFolderId?: string;
  selectedFileId?: string;
  setSelectedFolderId: (id: string) => void;
  setSelectedFileId: (id: string) => void;
  tab: Tab;
  toggleTab: (tab: Tab) => void;
  plugin: PluginRegistry | undefined;
  setPlugin: (plugin?: PluginRegistry) => void;
}
export const SourceContext = React.createContext<TreeSourceContextProps>({} as TreeSourceContextProps);

export const SourceProvider = ({ children }: { children: React.ReactNode }) => {
  const [tab, setTab] = useState<Tab>(Tab.TREE_SOURCE);
  const [plugin, setPlugin] = useState<PluginRegistry>();
  const [selected, setSelected] = useState<{ folderId?: string; fileId?: string }>();
  const setSelectedFolderId = (id: string) => {
    setSelected((prev) => ({
      folderId: prev?.folderId === id ? undefined : id,
    }));
  }
  const setSelectedFileId = (fileId: string) => {
    setPlugin(undefined);
    setSelected((prev) => ({ ...prev, fileId: fileId, }));
  }

  const toggleTab = (newTab: Tab) => {
    if (newTab === tab) setTab(Tab.NONE);
    else setTab(newTab);
  }

  const handlePlugin = (plugin?: PluginRegistry) => {
    if (plugin) {
      setPlugin(plugin);
      setSelected((prev) => ({
        ...prev,
        fileId: undefined
      }))
    }
    else setPlugin(undefined);
  }

  const selectedFolderId = selected?.folderId;
  const selectedFileId = selected?.fileId;

  return (
    <SourceContext.Provider value={{ 
      selectedFolderId, selectedFileId,
      setSelectedFolderId, setSelectedFileId,
      tab, toggleTab,
      plugin, setPlugin: handlePlugin
    }}>
      {children}
    </SourceContext.Provider>
  );
}