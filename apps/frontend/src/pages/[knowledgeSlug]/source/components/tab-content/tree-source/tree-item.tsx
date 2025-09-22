import type { KnowledgeFolder, Source } from "@memora/schemas";
import { TreeItemFolder } from './tree-item-folder';
import { TreeItemSource } from './tree-item-source';

const isSource = (item: KnowledgeFolder | Source): item is Source => "folderId" in item;

type TreeItemProps =  {
  item: KnowledgeFolder | Source;
}
export const TreeItem = ({ item }: TreeItemProps) => {
  return (
    <div className="pl-3">
      { isSource(item) ? <TreeItemSource item={item} /> : <TreeItemFolder item={item} />}
    </div>
  )
}