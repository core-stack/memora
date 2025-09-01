"use client"

import type React from "react"

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Check, FileArchive, FileAudio, FileText, FileVideo, ImageIcon, Upload, X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";

interface FileUploadProps {
  uploadUrl: string
  multiple?: boolean
  maxSize?: number // em bytes
  acceptedTypes?: string
  onUploadComplete?: (files: UploadedFile[]) => void
  className?: string
}
enum FileStatus {
  UPLOADING = "uploading",
  SUCCESS = "success",
  ERROR = "error",
}
interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  url?: string
  progress: number
  status: FileStatus
  error?: string
}

export function FileUploader({
  uploadUrl,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB padrão
  acceptedTypes,
  onUploadComplete,
  className,
}: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }

  const processFiles = (selectedFiles: File[]) => {
    const newFiles = selectedFiles.map((file) => ({
      id: Math.random().toString(36).substring(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: FileStatus.UPLOADING,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Iniciar upload para cada arquivo
    selectedFiles.forEach((file, index) => {
      uploadFile(file, newFiles[index])
    })
  }

  const uploadFile = async (file: File, fileInfo: UploadedFile) => {
    try {
      // Criar um XMLHttpRequest para monitorar o progresso
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          updateFileProgress(fileInfo.id, progress)
        }
      })

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          let url
          try {
            const response = JSON.parse(xhr.responseText)
            url = response.url || response.downloadUrl
          } catch (e) {
            // Se não conseguir parsear a resposta, não define a URL
          }

          updateFileStatus(fileInfo.id, FileStatus.SUCCESS, url)

          // Verificar se todos os arquivos foram carregados
          const updatedFiles = [...files, { ...fileInfo, status: FileStatus.SUCCESS, progress: 100, url }]
          const completedFiles = updatedFiles.filter((f) => f.status === FileStatus.SUCCESS)

          if (completedFiles.length === updatedFiles.length && onUploadComplete) {
            onUploadComplete(completedFiles)
          }
        } else {
          updateFileStatus(fileInfo.id, FileStatus.ERROR, undefined, `Erro ${xhr.status}: ${xhr.statusText}`)
        }
      })

      xhr.addEventListener("error", () => {
        updateFileStatus(fileInfo.id, FileStatus.ERROR, undefined, "Erro na conexão")
      })

      xhr.addEventListener("abort", () => {
        updateFileStatus(fileInfo.id, FileStatus.ERROR, undefined, "Upload cancelado")
      })

      xhr.open("PUT", uploadUrl)
      xhr.setRequestHeader("Content-Type", file.type)
      xhr.send(file)
    } catch (error) {
      updateFileStatus(fileInfo.id, FileStatus.ERROR, undefined, "Erro ao fazer upload")
      console.error("Erro ao fazer upload:", error)
    }
  }

  const updateFileProgress = (id: string, progress: number) => {
    setFiles((prev) => prev.map((file) => (file.id === id ? { ...file, progress } : file)))
  }

  const updateFileStatus = (id: string, status: FileStatus, url?: string, error?: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === id ? { ...file, status, url, error, progress: status === "success" ? 100 : file.progress } : file,
      ),
    )
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== id))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      const droppedFiles = Array.from(e.dataTransfer.files)
      processFiles(droppedFiles)
    }
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-6 w-6" />
    if (fileType.startsWith("video/")) return <FileVideo className="h-6 w-6" />
    if (fileType.startsWith("audio/")) return <FileAudio className="h-6 w-6" />
    if (fileType.includes("zip") || fileType.includes("compressed")) return <FileArchive className="h-6 w-6" />
    return <FileText className="h-6 w-6" />
  }

  const canPreview = (fileType: string) => {
    return fileType.startsWith("image/")
  }

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
        <h3 className="text-lg font-medium">
          {multiple ? "Arraste arquivos ou clique para selecionar" : "Arraste um arquivo ou clique para selecionar"}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {acceptedTypes ? `Tipos aceitos: ${acceptedTypes}` : "Todos os tipos de arquivos são aceitos"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">Tamanho máximo: {(maxSize / (1024 * 1024)).toFixed(0)}MB</p>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple={multiple}
          accept={acceptedTypes}
          onChange={handleFileChange}
        />
      </div>

      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          {files.map((file) => (
            <div key={file.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {file.status === "success" && canPreview(file.type) && file.url ? (
                    <div className="h-10 w-10 rounded overflow-hidden">
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                      {getFileIcon(file.type)}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {file.status === "success" && <Check className="h-5 w-5 text-green-500" />}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(file.id)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {file.status === "uploading" && (
                <div className="space-y-1">
                  <Progress value={file.progress} className="h-2" />
                  <p className="text-xs text-right text-muted-foreground">{file.progress}%</p>
                </div>
              )}

              {file.status === "error" && (
                <p className="text-xs text-red-500 mt-1">{file.error || "Erro ao fazer upload"}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
