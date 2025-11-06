import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/input';
import { Button } from '@/components/ui/button';
import {
  DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useDialog } from '@/hooks/use-dialog';
import { useTenant } from '@/hooks/use-tenant';
import { zodResolver } from '@/utils/zod-resolver';
import { createTenantSchema } from '@snipet/schemas';

import { DialogType } from './';

export const CreateTenantDialog = () => {
  const { closeDialog } = useDialog();
  const { setTenant } = useTenant();
  const defaultValues = {
    name: "",
    description: "",
    backgroundImage: ""
  };

  const form = useForm({
    resolver: zodResolver(createTenantSchema),
    defaultValues
  });

  const { mutate, isPending } = useApiMutation('/api/tenant', { method: 'POST' });
  const onSubmit = form.handleSubmit(async (body) => {
    mutate({ body }, {
      onSuccess: ({ id }) => {
        setTenant(id);
        closeDialog(DialogType.CREATE_TENANT);
      }
    });
  });

  const isLoading = form.formState.isSubmitting || isPending;

  return (
    <DialogContent hideCloseButton disableOutsideClose>
      <DialogHeader>
        <DialogTitle>Create Tenant</DialogTitle>
        <DialogDescription>
          You don`t have any tenant. Create a new one to start using Snipet
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-6">
          <FormInput name='name' placeholder={'Eg: My Company'} label='Name' />
          <DialogFooter>
            <Button type="submit" isLoading={isLoading}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}