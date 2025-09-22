import { FileQuestion } from 'lucide-react';

export const TreeItemEmpty = () => {
  return (
    <div className="text-muted-foreground text-sm flex gap-1 items-center pl-3">
      <FileQuestion className="w-3 h-3" />
      No data
    </div>
  )
}