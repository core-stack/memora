import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/input';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { DialogType } from '@/dialogs';
import { useDialog } from '@/hooks/use-dialog';

export const TreeSource = () => {
  const form = useForm();
  const { openDialog } = useDialog();

  return (
    <div className='space-y-2 divide-y divide-solid'>
      <div className='p-2'>
        <Button className='w-full' variant="outline" onClick={() => openDialog({ type: DialogType.CREATE_SOURCE })}> 
          Add source
        </Button>
      </div>
      <Form {...form}>
        <form className='p-2'>
          <FormInput name="search" placeholder="Search" />
        </form>
      </Form>
      <div>
        
      </div>
    </div>
  )
}