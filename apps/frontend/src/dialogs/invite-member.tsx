"use client"

import { Loader2, MinusCircle, PlusCircle } from 'lucide-react';
import { useCallback, useEffect, useMemo } from 'react';
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
import { sendInviteDtoSchema, useApiInviteSend, useApiRole } from '@/gen';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useDialog } from '@/hooks/use-dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { ROLES } from '@snipet/permission';

import { DialogType } from './';

import type { SendInviteDto } from "@/gen";

export type InviteMemberDialogProps = {
  tenantId: string;
}
export function InviteMemberDialog({ tenantId }: InviteMemberDialogProps) {
  const form = useForm({
    resolver: zodResolver(sendInviteDtoSchema),
    defaultValues: {
      emails: [],
    },
  });
  const { data: roles = [] } = useApiRole({ tenantId });

  const defaultEmail = useMemo(() => ({
    email: "",
    roleId: roles.find(role => role.key === ROLES.tenant.user.key)?.id
  } as SendInviteDto["emails"][0]), [roles]);

  const isLoading = form.formState.isSubmitting;
  const invalidate = useApiInvalidate();
  const { mutate } = useApiInviteSend();
  const { closeDialog } = useDialog();

  const { fields, remove, insert } = useFieldArray({ control: form.control, name: "emails" });
  const removeField = (index: number) => remove(index);
  const addField = useCallback((index: number) => insert(index + 1, defaultEmail), [defaultEmail, insert]);

  async function onSubmit(data: SendInviteDto) {
    mutate({ data, tenantId }, {
      onSuccess: async () => {
        await invalidate("/api/tenant/:tenantId/invite");
        form.reset();
        closeDialog(DialogType.INVITE_MEMBER);
      }
    });
  }

  useEffect(() => {
    if (fields.length === 0 && roles.length > 0) {
      addField(0);
    }
  }, [addField, fields.length, roles])

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
                  name={`emails.${index}.roleId`}
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
                          {roles.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}
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
