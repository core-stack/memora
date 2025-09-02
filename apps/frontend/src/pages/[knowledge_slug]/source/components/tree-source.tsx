import { Button } from "@/components/ui/button";
import { DialogType } from "@/dialogs";
import { useDialog } from "@/hooks/use-dialog";
import { FilePlus2, FolderPlus, ListCollapse, Search } from "lucide-react";

export const TreeSource = () => {
  const { openDialog } = useDialog();

  return (
    <div className='divide-y divide-solid'>

      <div className='p-1 flex gap-2 justify-evenly'>
        <Button size="icon" variant="ghost" onClick={() => openDialog({ type: DialogType.CREATE_SOURCE })}>
          <Search />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => openDialog({ type: DialogType.CREATE_SOURCE })}>
          <FilePlus2 />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => openDialog({ type: DialogType.CREATE_SOURCE })}>
          <FolderPlus />
        </Button>
        <Button size="icon" variant="ghost" onClick={() => openDialog({ type: DialogType.CREATE_SOURCE })}>
          <ListCollapse />
        </Button>
      </div>
      <div>

      </div>
    </div>
  )
}