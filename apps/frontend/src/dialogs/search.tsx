"use client"

import { Clock, File, Folder, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import {
  DialogContent, DialogDescription, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDialog } from '@/hooks/use-dialog';
import {
  mockRecentSearches, mockSearchResults, mockSearchSuggestions
} from '@/lib/mock-search-data';

import { DialogType } from './';

import type { SearchResult, RecentSearch, SearchSuggestion } from '@/lib/search-types';

export function SearchDialog() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(mockRecentSearches)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const { closeDialog } = useDialog()
  // Focus input when modal opens
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Handle search
  useEffect(() => {
    if (query.trim()) {
      // Simulate search with mock data
      const filteredResults = mockSearchResults.filter(
        (result) =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.content.toLowerCase().includes(query.toLowerCase()),
      )
      setResults(filteredResults)

      // Generate suggestions based on query
      const filteredSuggestions = mockSearchSuggestions
        .filter(
          (suggestion) =>
            suggestion.text.toLowerCase().includes(query.toLowerCase()) &&
            suggestion.text.toLowerCase() !== query.toLowerCase(),
        )
        .slice(0, 3)
      setSuggestions(filteredSuggestions)
    } else {
      setResults([])
      setSuggestions([])
    }
    setSelectedIndex(0)
  }, [query])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const totalItems = suggestions.length + results.length

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
          if (selectedIndex < suggestions.length) {
            // Handle suggestion selection
            const suggestion = suggestions[selectedIndex]
            setQuery(suggestion.text)
          } else if (results.length > 0) {
            // Handle result selection
            const resultIndex = selectedIndex - suggestions.length
            if (results[resultIndex]) {
              console.log(results[resultIndex]);
              
              // onResultSelect(results[resultIndex]);
              closeDialog(DialogType.SEARCH);
            }
          }
          break
        case "Escape":
          closeDialog(DialogType.SEARCH);
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedIndex, suggestions, results])

  const handleRecentSearchClick = (search: RecentSearch) => {
    setQuery(search.query)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text)
  }

  const handleResultClick = (result: SearchResult) => {
    console.log(result);
    
    // onResultSelect(result);
    closeDialog(DialogType.SEARCH);
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text

    const regex = new RegExp(`(${query})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-primary/20 text-primary rounded px-0.5">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

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
          {!query && recentSearches.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-muted-foreground">
                <Clock className="w-3 h-3" />
                Recent searches
              </div>
              <div className="space-y-1">
                {recentSearches.map((search) => (
                  <button
                    key={search.id}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-md hover:bg-accent text-left transition-colors"
                  >
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span className="flex-1 text-sm">{search.query}</span>
                    <Badge variant="secondary" className="text-xs">
                      {search.results}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {query && suggestions.length > 0 && (
            <div className="mb-4">
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Suggestions</div>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-left transition-colors ${
                      index === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
                    }`}
                  >
                    <span className="text-sm">{suggestion.icon}</span>
                    <span className="flex-1 text-sm">{highlightText(suggestion.text, query)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {results.length > 0 && (
            <div>
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground">Results ({results.length})</div>
              <div className="space-y-1">
                {results.map((result, index) => {
                  const actualIndex = suggestions.length + index
                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`w-full flex items-start gap-3 px-2 py-3 rounded-md text-left transition-colors ${
                        actualIndex === selectedIndex ? "bg-accent" : "hover:bg-accent/50"
                      }`}
                    >
                      <div className="mt-0.5">
                        {result.type === "file" ? (
                          <File className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Folder className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{highlightText(result.title, query)}</span>
                          <span className="text-xs text-muted-foreground">{result.folder}</span>
                        </div>
                        {result.matches.length > 0 && (
                          <div className="text-xs text-muted-foreground line-clamp-2">
                            {highlightText(result.matches[0].text, query)}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* No Results */}
          {query && results.length === 0 && suggestions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </DialogContent>
  )
}
