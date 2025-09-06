import React, { useState } from 'react';

type TreeSourceContextProps = {
  selectedFolderId?: string
  selectedFileId?: string
  setSelectedFolderId: (id: string) => void
  setSelectedFileId: (id: string) => void
}
export const TreeSourceContext = React.createContext<TreeSourceContextProps>({} as TreeSourceContextProps);

export const TreeSourceProvider = ({ children }: { children: React.ReactNode }) => {
  const [selected, setSelected] = useState<{ folderId?: string; fileId?: string }>();
  const setSelectedFolderId = (id: string) => {
    setSelected((prev) => ({
      folderId: prev?.folderId === id ? undefined : id,
    }));
  }
  const setSelectedFileId = (id: string) => {
    setSelected((prev) => ({
      fileId: prev?.fileId === id ? undefined : id,
    }));
  }
  const selectedFolderId = selected?.folderId;
  const selectedFileId = selected?.fileId;
  return (
    <TreeSourceContext.Provider value={{ selectedFolderId, selectedFileId, setSelectedFolderId, setSelectedFileId }}>
      {children}
    </TreeSourceContext.Provider>
  );
}