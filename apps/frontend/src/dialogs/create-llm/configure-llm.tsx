"use client"

import { useForm } from "react-hook-form";

import { FormInput } from "@/components/form/input";
import { Button } from "@/components/ui/button";
import {
  DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { createLLMDtoSchema, useApiLLMCreate } from "@/gen";
import { useApiInvalidate } from "@/hooks/use-api-invalidate";
import { useDialog } from "@/hooks/use-dialog";
import { useToast } from "@/hooks/use-toast";
import { capitalizeFirstLetter } from "@/lib/string";
import { zodResolver } from "@hookform/resolvers/zod";

import { DialogType } from "../";

import type { LLMPreset } from '@/gen';

export interface ConfigureLLDialogProps {
  preset: LLMPreset;
  tenantId: string;
}

export function ConfigureLLDialog({ preset, tenantId }: ConfigureLLDialogProps) {
  const { closeDialog } = useDialog();
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(createLLMDtoSchema),
    defaultValues: {
      ...preset.defaults,
      key: preset.key,
      type: preset.config?.type,
      model: preset.config?.model,
      config: {}
    }
  });

  const invalidate = useApiInvalidate();
  const { mutate } = useApiLLMCreate();
  const isLoading = form.formState.isSubmitting;

  const handleSubmit = form.handleSubmit((data) => {
    mutate({ data, tenantId }, {
      onSuccess: async () => {
        await invalidate("/api/tenant/:tenantId/llm");
        closeDialog(DialogType.CONFIGURE_LLM);
        toast({
          title: "LLM created",
          description: "The LLM has been created successfully"
        });
      }
    })
  })
  const handleCancel = () => closeDialog(DialogType.CONFIGURE_LLM);

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="relative h-10 w-10 shrink-0 rounded-lg flex items-center justify-center overflow-hidden">
            <img
              src={preset.iconPath || "/placeholder.svg"}
              alt={preset.name}
              width={32}
              height={32}
              className="object-cover"
            />
          </div>
          <div>
            <DialogTitle className="text-xl">{preset.name}</DialogTitle>
            <DialogDescription className="text-sm">{preset.description}</DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <FormInput
            name='name'
            label='Instance Name'
            placeholder="e.g., Production GPT-4"
            required
            autoFocus
          />
          <div className="space-y-4 py-4">
            {
              !preset.ignoreFields &&
              preset.fields &&
              Object.entries(preset.fields).map(([fieldName, fieldType]) => (
                <FormInput
                  type={fieldType === 'string' ? "text" : "password"}
                  key={fieldName}
                  name={`config.${fieldName}`}
                  label={capitalizeFirstLetter(fieldName, true)}
                />
              ))
            }
          </div>
          <DialogFooter>
            <Button onClick={handleCancel} variant="outline" type='button' disabled={isLoading}>
              Cancel
            </Button>
            <Button disabled={isLoading}>
              Create LLM
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
