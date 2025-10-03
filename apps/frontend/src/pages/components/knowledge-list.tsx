"use client"

import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';

import { KnowledgeCard } from './knowledge-card';

import type { Knowledge } from '@memora/schemas';

interface KnowledgeListProps {
  knowledges: Knowledge[]
}

export function KnowledgeList({ knowledges }: KnowledgeListProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const sortedAndFilteredKnowledgeBases = useMemo(() => {
    let filtered = knowledges

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = knowledges.filter((kb) => kb.title.toLowerCase().includes(query) || kb.description.toLowerCase().includes(query))
    }

    return filtered;
  }, [knowledges, searchQuery])

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search knowledge bases..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {sortedAndFilteredKnowledgeBases.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery ? "No knowledge bases found matching your search" : "No knowledge bases yet"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {sortedAndFilteredKnowledgeBases.map((kb) => <KnowledgeCard key={kb.id} knowledge={kb} />)}
        </div>
      )}
    </div>
  )
}
