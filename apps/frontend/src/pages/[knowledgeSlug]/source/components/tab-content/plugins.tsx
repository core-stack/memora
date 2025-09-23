import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DialogType } from "@/dialogs";
import { env } from "@/env";
import { useApiQuery } from "@/hooks/use-api-query";
import { useDialog } from "@/hooks/use-dialog";
import { cn } from "@/lib/utils";

import { useSource } from "../../hooks/use-source";

import type { PluginRegistry } from '@memora/schemas';

export const Plugins = () => {
  const { data: plugins, isLoading } = useApiQuery(
    "/api/plugin-registry", { method: "GET", query: { filter: { type: "source" } } }
  );
  return (
    <ul className='flex flex-col gap-2'>
      {
        !isLoading && plugins?.map((plugin) => (
          <SourceItem key={plugin.name} plugin={plugin} />
        ))
      }
    </ul>
  )
}

const SourceItem = ({ plugin }: { plugin: PluginRegistry }) => {
  const { setPlugin, plugin: selectedPlugin } = useSource();
  const { openDialog } = useDialog();
  const isSelected = selectedPlugin?.name === plugin.name;
  const handleInstall = (event: React.MouseEvent) => {
    event.stopPropagation()
    openDialog({ type: DialogType.INSTALL_PLUGIN, props: { plugin } });
  }

  return (
    <li className={cn('flex gap-2 w-full p-2 hover:bg-accent/40 cursor-pointer', isSelected && "bg-accent/30")} onClick={() => setPlugin(plugin)}>
      <Avatar className="w-14 h-14">
        <AvatarImage src={`${env.STORAGE_URL}/plugins/${plugin.name}/${plugin.iconPath ?? "icon.png"}`} />
        <AvatarFallback>{plugin.name?.[0]}</AvatarFallback>
      </Avatar>
      <div className='text-sm w-[calc(100%-4rem)] flex flex-col'>
        <span className='font-bold'>{plugin.displayName}</span>
        <span className='text-xs truncate'>{plugin.description}</span>
        <div className='flex justify-between w-full'>
          <span>v{plugin.version.startsWith("v") ? plugin.version.slice(1) : plugin.version}</span>
          <button
            onClick={handleInstall}
            className='rounded-sm cursor-pointer text-xs py-0.5 px-2 bg-primary hover:brightness-150'
          >Install</button>
        </div>
      </div>
    </li>
  )
}