"use client"

import { Clock, File, Search } from 'lucide-react';
import { useEffect, useRef, useState, useTransition } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Spinner } from '@/components/ui/spinner';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useApiQuery } from '@/hooks/use-api-query';
import { useDebounce } from '@/hooks/use-debounce';
import { useDialog } from '@/hooks/use-dialog';

import { DialogType } from './';

import type { Fragment } from "@memora/schemas";

export function SearchDialog() {
  const [query, setQuery] = useState("");
  const { mutateAsync: search, data: results = [] } = useApiMutation("/api/knowledge/:knowledgeSlug/search", { method: "GET" });
  const { data: recent = [] } = useApiQuery("/api/knowledge/:knowledgeSlug/search/recent", { method: "GET" });
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const { closeDialog } = useDialog()

  // Focus input when modal opens
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [])

  const [isPending, startTransition] = useTransition();
  const debouncedQuery = useDebounce(query, 800);

  // Handle search
  useEffect(() => {
    startTransition(async () => {
      if (debouncedQuery.trim()) await search({ query: { text: debouncedQuery.trim() } });
      setSelectedIndex(0);
    })
  }, [debouncedQuery, search]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const totalItems = results.length

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex((prev) => (prev + 1) % Math.max(totalItems, 1))
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex((prev) => (prev - 1 + Math.max(totalItems, 1)) % Math.max(totalItems, 1))
          break
        case "Enter":          
          e.preventDefault()
          // Handle result selection
          if (results[selectedIndex]) {
            console.log(results[selectedIndex]);
            // onResultSelect(results[resultIndex]);
            closeDialog(DialogType.SEARCH);
          }
          break
        case "Escape":
          closeDialog(DialogType.SEARCH);
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIndex, results, closeDialog]);

  const handleRecentSearchClick = (text: string) => {
    setQuery(text)
  }

  const handleResultClick = (result: Fragment) => {
    console.log(result);

    // onResultSelect(result);
    closeDialog(DialogType.SEARCH);
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return [text];
  
    // Normaliza e separa as palavras da query
    const normalizedWords = query
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
  
    if (normalizedWords.length === 0) return [text];
  
    // Cria um regex único (todas as palavras)
    const regex = new RegExp(`(${normalizedWords.join("|")})`, "gi");
  
    // Vamos percorrer o texto original, mas comparar com a versão normalizada
    const normalizedText = text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  
    const parts: string[] = [];
    let lastIndex = 0;
  
    // Executa os matches no texto normalizado
    normalizedText.replace(regex, (match, _group, offset) => {
      // Adiciona o trecho não destacado
      if (lastIndex < offset) {
        parts.push(text.slice(lastIndex, offset));
      }
      // Adiciona o trecho destacado (mantendo acento e case originais)
      parts.push(text.slice(offset, offset + match.length));
      lastIndex = offset + match.length;
      return match;
    });
  
    // Resto do texto
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    console.log(parts);
    
    return parts;
  };
  

  return (
    <DialogContent className="max-w-2xl p-0 gap-0 bg-popover border-border">
      <DialogHeader className='hidden'>
        <DialogTitle>Seach</DialogTitle>
        <DialogDescription>Seach for files, functions, and content</DialogDescription>
      </DialogHeader>
      {/* Search Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Search className="w-5 h-5 text-muted-foreground" />
        <Input
          containerclassname='w-full'
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search files, functions, and content..."
          className="border-0 bg-transparent text-lg placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      <ScrollArea className="max-h-96">
        <div className="p-2">
          {/* Recent Searches */}
          {!query && recent.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-muted-foreground">
                <Clock className="w-3 h-3" />
                Recent searches
              </div>
              <div className="space-y-1">
                {recent.map((search) => (
                  <button
                    key={search.text}
                    onClick={() => handleRecentSearchClick(search.text)}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent text-left transition-colors"
                  >
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-sm">{search.text}</span>
                    <Badge variant="secondary" className="text-xs">{search.count}</Badge>
                  </button>
                ))}
              </div>
            </div>
          )}


          {/* Search Results */}
          {!isPending && results.length > 0 && (
            <div>
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Results ({results.length})</div>
              <div className="space-y-1">
                {results.map((result, index) => {
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`w-full flex items-start gap-3 px-2 py-3 rounded-md text-left transition-colors ${
                        index === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
                      }`}
                    >
                      <div className="mt-0.5">
                        <File className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{highlightText(result.content, query)}</span>
                          {/* <span className="text-xs text-muted-foreground">{result.folder}</span> */}
                        </div>
                        {/* {result.matches.length > 0 && (
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {highlightText(result.matches[0].text, query)}
                          </div>
                        )} */}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* No Results */}
          {!isPending && query && results.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          )}
          {
            isPending && (
              <div className="py-4 pb-8 text-muted-foreground flex flex-col items-center gap-3">
                <Spinner />
                <p className="text-sm">Searching...</p>
              </div>
            )
          }
        </div>
      </ScrollArea>
    </DialogContent>
  )
}
