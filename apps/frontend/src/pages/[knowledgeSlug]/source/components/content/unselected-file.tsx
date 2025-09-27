"use client"

import { FileText } from 'lucide-react';

export function UnselectedFile() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-4 max-w-md">
        <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">No file selected</h3>
          <p className="text-muted-foreground">Select a file from the sidebar to view its content</p>
        </div>
      </div>
    </div>
  )
}
