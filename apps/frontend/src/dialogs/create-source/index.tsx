import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { TabsList } from '@radix-ui/react-tabs';

import { CreateSourceFile } from './file';
import { CreateSourceLink } from './link';

type Props = {
  folderId?: string;
  slug: string;
}

export const CreateSourceDialog = ({ slug, folderId }: Props) => {
  return (
    <div>
      <DialogHeader>
        <DialogTitle>{"Create Source"}</DialogTitle>
        <DialogDescription>
          {"Create a new source"}
        </DialogDescription>
      </DialogHeader>
      <Tabs>
        <TabsList>
          <TabsTrigger value='file'>{"File"}</TabsTrigger>
          <TabsTrigger value='link'>{"Link"}</TabsTrigger>
        </TabsList>
        <TabsContent value='file'>
          <CreateSourceFile slug={slug} folderId={folderId} />
        </TabsContent>
        <TabsContent value='link'>
          <CreateSourceLink />
        </TabsContent>
      </Tabs>
    </div>
  )
}