import { WifiOff } from 'lucide-react';

export type TreeItemEmptyProps = {
  message: string;
}

export const TreeItemError = ({ message }: TreeItemEmptyProps) => {
  return (
    <div className="text-destructive text-sm flex gap-1 items-center">
      <WifiOff className="w-3 h-3" />
      {message}
      </div>
  )
}