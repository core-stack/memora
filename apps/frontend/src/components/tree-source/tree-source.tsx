import { Spinner } from "@/components/ui/spinner";
import { AlertOctagon, FileQuestion } from "lucide-react";

import { TreeSourceHeader } from "./header";
import { useExplore } from "./hooks/use-explore";
import { TreeItem } from "./tree-item";

export const TreeSource = () => {
  const { data, error, isLoading } = useExplore();

  return (
    <div className='divide-y divide-solid h-full flex flex-col'>
      <TreeSourceHeader />
      <div>
        {
          isLoading && (
            <div className='flex-1 flex items-center justify-center'>
              <Spinner variant="secondary" />
            </div>
          )
        }
        {
          error && (
            <div className='flex-1 flex items-center justify-center flex-col gap-4'>
              <AlertOctagon className='w-10 h-10 text-destructive opacity-50' />
              <p>{error?.message}</p>
            </div>
          )
        }
        {
          !isLoading && !error && (
            <>
              {
                data?.length === 0 && (
                  <div className='flex-1 flex items-center justify-center flex-col gap-4'>
                    <FileQuestion className='w-10 h-10 opacity-50' />
                    <p>No data</p>
                  </div>
                )
              }
              <div>
                {data?.map((item) => <TreeItem key={item.id} item={item} />)}
              </div>
            </>
          )
        }
      </div>
    </div>
  )
}