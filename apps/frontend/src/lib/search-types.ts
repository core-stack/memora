export interface SearchResult {
  id: string
  title: string
  content: string
  filePath: string
  folder: string
  type: "file" | "folder"
  matches: SearchMatch[]
}

export interface SearchMatch {
  line: number
  text: string
  startIndex: number
  endIndex: number
}

export interface RecentSearch {
  id: string
  query: string
  timestamp: Date
  results: number
}

export interface SearchSuggestion {
  id: string
  text: string
  type: "recent" | "suggestion" | "file"
  icon?: string
}
