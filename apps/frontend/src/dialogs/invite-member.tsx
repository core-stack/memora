"use client"

import { Loader2, MinusCircle, PlusCircle } from 'lucide-react';
import { useFieldArray, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useDialog } from '@/hooks/use-dialog';
import { useTenant } from '@/hooks/use-tenant';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROLES } from '@snipet/permission';
import { createInviteSchema } from '@snipet/schemas';

import { DialogType } from './';

import type { CreateInviteSchema } from "@snipet/schemas";
export function InviteMemberDialog() {
  const { tenant } = useTenant();
  const defaultEmail = { email: "", tenantId: tenant?.id ?? '', role: ROLES.tenant.user.key };
  const form = useForm<CreateInviteSchema>({
    resolver: zodResolver(createInviteSchema),
    defaultValues: {
      emails: [defaultEmail]
    },
  });

  const isLoading = form.formState.isSubmitting;
  const invalidate = useApiInvalidate();
  const { mutate } = useApiMutation("/api/tenant/:tenantId/invite", { method: "POST" });
  const { closeDialog } = useDialog();

  const { fields, remove, insert } = useFieldArray({
    control: form.control,
    name: "emails"
  })
  const removeField = (index: number) => remove(index);
  const addField = (index: number) => insert(index + 1, defaultEmail);

  async function onSubmit(body: CreateInviteSchema) {
    mutate({ body }, {
      onSuccess: async () => {
        await invalidate("/api/tenant/:tenantId/invite");
        form.reset();
        closeDialog(DialogType.INVITE_MEMBER);
      }
    });
  }

  return (
    <DialogContent className="sm:max-w-[565px]">
      <DialogHeader>
        <DialogTitle>Invite Member</DialogTitle>
        <DialogDescription>Invite members to your workspace.</DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {
            fields.map((field, index) => (
              <div className='grid grid-cols-5 gap-2' key={field.id}>
                <FormField
                  control={form.control}
                  name={`emails.${index}.email`}
                  render={({ field }) => (
                    <FormItem className='col-span-3'>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`emails.${index}.role`}
                  render={({ field }) => (
                    <FormItem className='col-span-1'>
                      <FormLabel>Função</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma função" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="WORKSPACE_ADMIN">Admin</SelectItem>
                          <SelectItem value="WORKSPACE_MEMBER">Member</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex items-end gap-1 pb-2'>
                  <Button type="button" size="icon" variant="outline" onClick={() => addField(index)}>
                    <PlusCircle />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    disabled={index === 0 && fields.length === 1}
                    variant="destructive-outline"
                    onClick={() => removeField(index)}
                  >
                    <MinusCircle />
                  </Button>
                </div>
              </div>
            ))
          }

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => closeDialog(DialogType.INVITE_MEMBER)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar convite
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
