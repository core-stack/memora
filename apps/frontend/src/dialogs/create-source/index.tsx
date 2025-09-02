import { DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { TabsList } from '@radix-ui/react-tabs';

import { CreateSourceFile } from './file';
import { CreateSourceLink } from './link';

export const CreateSourceDialog = () => {
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
          <CreateSourceFile/>
        </TabsContent>
        <TabsContent value='link'>
          <CreateSourceLink />
        </TabsContent>
      </Tabs>
    </div>
  )
}