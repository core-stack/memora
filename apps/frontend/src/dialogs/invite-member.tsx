"use client"

import { Loader2, MinusCircle, PlusCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useFieldArray, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { trpc } from '@/lib/trpc/client';
import { inviteMemberSchema, InviteMemberSchema } from '@/lib/trpc/schema';
import { zodResolver } from '@hookform/resolvers/zod';

interface InviteMemberDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InviteMemberDialog({ open, onOpenChange }: InviteMemberDialogProps) {
  const { slug } = useParams<{ slug: string }>();
  const form = useForm<InviteMemberSchema>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: {
      emails: [{ email: "", role: "WORKSPACE_MEMBER" }],
      slug
    },
  });

  const isLoading = form.formState.isSubmitting;

  const { fields, remove, insert } = useFieldArray({
    control: form.control,
    name: "emails"
  })
  const removeField = (index: number) => remove(index);
  const addField = (index: number) => insert(index + 1, { email: "", role: "WORKSPACE_MEMBER" });

  const utils = trpc.useUtils();
  const { mutate } = trpc.invite.invite.useMutation();
  async function onSubmit(data: InviteMemberSchema) {
    data.slug = slug;
    mutate(data, {
      onSuccess: () => {
        utils.invite.getByWorkspace.invalidate();
        form.reset();
        onOpenChange(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[565px]">
        <DialogHeader>
          <DialogTitle>Convidar membro</DialogTitle>
          <DialogDescription>Envie um convite por email para adicionar um novo membro ao workspace.</DialogDescription>
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
                            <SelectItem value="WORKSPACE_MEMBER">Membro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className='flex items-end gap-1'>
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
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
    </Dialog>
  )
}
