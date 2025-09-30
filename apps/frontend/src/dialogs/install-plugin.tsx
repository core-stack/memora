import { useForm } from 'react-hook-form';

import { FormInput } from '@/components/form/input';
import { FormSwitch } from '@/components/form/switch';
import { Button } from '@/components/ui/button';
import {
  DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Form, FormError } from '@/components/ui/form';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useDialog } from '@/hooks/use-dialog';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { buildConfigObjectSchema, createPluginSchema } from '@memora/schemas';

import { DialogType } from './';

import type  { CreatePlugin, PluginRegistry } from "@memora/schemas";
import type z from 'zod';

type Props = {
  plugin: PluginRegistry;
}
export const InstallPluginDialog = ({ plugin }: Props) => {
  const defaultValues: CreatePlugin = {
    name: plugin.name,
    type: plugin.type,
    pluginRegistry: plugin.name,
    config: {
      ...Object.fromEntries(Object.entries(plugin.configSchema || {}).map(([key, value]) => [key, value.default])),
    }
  }
  const { toast } = useToast();
  const schema = createPluginSchema.extend({ config: buildConfigObjectSchema(plugin.configSchema || {}) });
  const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues });
  const { closeDialog } = useDialog();
  const { mutate: save }  = useApiMutation("/api/plugin", { method: "POST" });
  const handleSubmit = form.handleSubmit(async (body) => {
    save({ body }, { 
      onSuccess: () => {
        toast({
          title: "Plugin installed",
          description: "The plugin has been installed successfully",
        });
        closeDialog(DialogType.INSTALL_PLUGIN);
      },
      onError(error) {
        toast({ title:"Error installing plugin", description: error.message, variant: "destructive" });
      }
    })
  });
  const { mutate: test } = useApiMutation("/api/plugin/test", { method: 'POST' });
  const handleTest = () => {
    const data = form.getValues();
    test({ body: data }, {
      onSuccess: (res) => {
        if (res) {
          toast({
            title: "Test successful",
            description: "The plugin has been tested successfully",
          });
        } else {
          toast({
            title: "Test failed",
            description: "The plugin has failed the test",
            variant: "destructive",
          });
        }
      },
      onError(error) {
        toast({ title:"Error testing plugin", description: error.message, variant: "destructive" });
      }
    })
  }

  const isLoading = form.formState.isSubmitting;

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Install Plugin</DialogTitle>
        <DialogDescription>Install the {plugin.name} plugin</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="my-6">
          <FormInput name="name" label="Name" />
          <h3 className='font-bold pt-4'>Configuration</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(plugin.configSchema || {}).map(([key, value]) => {
              if (value.type === "string" || value.type === "number") {
                return (
                  <FormInput
                    label={value.label}
                    placeholder={value.placeholder}
                    key={key}
                    name={`config.${key}`}
                    type={value.type === "number" ? "number" : "text"}
                  />
                )
              }
              if (value.type === "boolean") {
                return <FormSwitch label={value.label} key={key} name={`config.${key}`} />
              }
              if (value.type === "secret-string" || value.type === "secret-number") {
                return (
                  <FormInput
                    label={value.label}
                    placeholder={value.placeholder}
                    key={key}
                    name={`config.${key}`}
                    type="password"
                  />
                )
              }
            })}
          </div>
          <FormError>{form.formState.errors.root?.message}</FormError>

          <DialogFooter className='mt-4'>
            <Button type="button" variant="secondary" onClick={handleTest}>Test</Button>
            <Button type="button" variant="destructive-outline" onClick={() => closeDialog(DialogType.INSTALL_PLUGIN)}>Cancel</Button>
            <Button type="submit" isLoading={isLoading}>Create</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}