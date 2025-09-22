import { FormInput } from "@/components/form/input";
import { FormSwitch } from "@/components/form/switch";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { useDialog } from "@/hooks/use-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPluginSchema } from "@memora/schemas";
import { useForm } from "react-hook-form";

import { DialogType } from "./";

import type  { CreatePlugin, PluginRegistry } from "@memora/schemas";


type Props = {
  plugin: PluginRegistry;
}
export const InstallPluginDialog = ({ plugin }: Props) => {
  const form = useForm<CreatePlugin>({ resolver: zodResolver(createPluginSchema) });
  const { closeDialog } = useDialog();
  const handleSubmit = form.handleSubmit(console.log);

  const isLoading = form.formState.isSubmitting;

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Install Plugin</DialogTitle>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4 my-6">
          <FormInput name="name" label="Name" />
          {Object.entries(plugin.configSchema || {}).map(([key, value]) => {
            if (value.type === "string" || value.type === "number") {
              return (
                <FormInput
                  label={value.label}
                  placeholder={value.placeholder}
                  key={key}
                  name={key}
                  type={value.type === "number" ? "number" : "text"}
                />
              )
            }
            if (value.type === "boolean") {
              return <FormSwitch label={value.label} key={key} name={key} />
            }
            if (value.type === "secret-string" || value.type === "secret-number") {
              return (
                <FormInput
                  label={value.label}
                  placeholder={value.placeholder}
                  key={key}
                  name={key}
                  type="password"
                />
              )
            }
          })}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => closeDialog(DialogType.INSTALL_PLUGIN)}
            >Cancel</Button>
            <Button type="submit" isLoading={isLoading}>
              Create
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  )
}