"use client"

import type React from "react"
import { createContext, useEffect } from 'react';

import { DialogType } from '@/dialogs';
import { useDialog } from '@/hooks/use-dialog';

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

  const openSearch = () => openDialog({ type: DialogType.SEARCH })
  const closeSearch = () => closeDialog(DialogType.SEARCH)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        openSearch()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <SearchContext.Provider value={{ openSearch, closeSearch }}>
      {children}
    </SearchContext.Provider>
  )
}
