"use client"

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogType } from "@/dialogs";
import { useDialog } from "@/hooks/use-dialog";
import { BookOpen, Brain, Clock, Database, FileText, Globe, PlusCircle, Star, Users } from "lucide-react";
import { useNavigate } from "react-router";

interface KnowledgeBase {
  id: string
  name: string
  description: string
  type: "documents" | "web" | "database" | "books" | "research"
  popularity: number
  lastUpdated: string
  size: string
  tags: string[]
}

const knowledgeBases: KnowledgeBase[] = [
  {
    id: "1",
    name: "Wikipedia Completa",
    description: "Base de conhecimento enciclopédica com milhões de artigos em português e outras línguas.",
    type: "web",
    popularity: 5,
    lastUpdated: "2024-01-15",
    size: "2.1 TB",
    tags: ["Enciclopédia", "Geral", "Multilíngue"],
  },
  {
    id: "2",
    name: "Documentação Técnica",
    description: "Coleção de documentações de frameworks, linguagens de programação e ferramentas de desenvolvimento.",
    type: "documents",
    popularity: 4,
    lastUpdated: "2024-01-20",
    size: "450 GB",
    tags: ["Programação", "Técnico", "Desenvolvimento"],
  },
  {
    id: "4",
    name: "Artigos Científicos",
    description: "Base de dados com milhares de artigos científicos revisados por pares de diversas áreas.",
    type: "research",
    popularity: 5,
    lastUpdated: "2024-01-22",
    size: "800 GB",
    tags: ["Ciência", "Pesquisa", "Acadêmico"],
  },
  {
    id: "5",
    name: "Base Corporativa",
    description: "Documentos internos, políticas e procedimentos da sua organização.",
    type: "database",
    popularity: 3,
    lastUpdated: "2024-01-18",
    size: "50 GB",
    tags: ["Corporativo", "Interno", "Políticas"],
  },
  {
    id: "6",
    name: "Notícias e Mídia",
    description: "Arquivo de notícias e artigos de mídia dos últimos 10 anos.",
    type: "web",
    popularity: 4,
    lastUpdated: "2024-01-23",
    size: "300 GB",
    tags: ["Notícias", "Atual", "Mídia"],
  },
]

const typeIcons = {
  documents: FileText,
  web: Globe,
  database: Database,
  books: BookOpen,
  research: Brain,
}

const typeLabels = {
  documents: "Documentos",
  web: "Web",
  database: "Base de Dados",
  books: "Livros",
  research: "Pesquisa",
}

export default function Home() {
  const navigate = useNavigate();
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-accent text-accent" : "text-muted-foreground"}`} />
    ))
  }
  const { openDialog } = useDialog();
  const handleSelect = (slug: string) => {
    navigate(`/${slug}`);
  }

  const handleCreateKnowledge = () => openDialog({ type: DialogType.CREATE_KNOWLEDGE });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Select a Knowledge Base</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose a knowledge base to get started
          </p>
        </div>

        {/* Knowledge Base Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {knowledgeBases.map((base) => {
            const Icon = typeIcons[base.type]
            return (
              <Card
                key={base.id}
                className="cursor-pointer transition-all duration-200 hover:shadow-lg"
                onClick={() => handleSelect(base.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{base.name}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {typeLabels[base.type]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <CardDescription className="text-sm leading-relaxed">{base.description}</CardDescription>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Popularidade:</span>
                    </div>
                    <div className="flex items-center gap-1">{renderStars(base.popularity)}</div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Database className="w-4 h-4" />
                      <span>{base.size}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(base.lastUpdated).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {base.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
          <Card
            className="group cursor-pointer transition-all duration-200 hover:shadow-lg"
            onClick={handleCreateKnowledge}
          >
            <CardContent className="text-lg flex items-center gap-2 flex-col justify-center h-full">
              <PlusCircle className="w-20 h-20 opacity-25 group-hover:text-primary group-hover:opacity-100 transition" />
              Create a new knowledge base
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
