"use client"

import type React from "react"
import { DialogType } from "@/dialogs";
import { useDialog } from "@/hooks/use-dialog";
import { createContext, useCallback, useEffect } from "react";

interface SearchContextType {
  openSearch: () => void
  closeSearch: () => void
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined)

interface SearchProviderProps {
  children: React.ReactNode
}

export function SearchProvider({ children }: SearchProviderProps) {
  const { openDialog, closeDialog } = useDialog();

  const openSearch = useCallback(() => openDialog({ type: DialogType.SEARCH }), [openDialog]);
  const closeSearch = useCallback(() => closeDialog(DialogType.SEARCH), [closeDialog]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        openSearch();
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [openSearch])

  return (
    <SearchContext.Provider value={{ openSearch, closeSearch }}>
      {children}
    </SearchContext.Provider>
  )
}
