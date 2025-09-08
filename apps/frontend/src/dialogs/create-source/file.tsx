"use client"

import type { UploadedFile } from '@/components/file-uploader';

import { FileUploader } from "@/components/file-uploader";
import { useApiMutation } from "@/hooks/use-api-mutation";
import { useDialog } from "@/hooks/use-dialog";
import { useToast } from "@/hooks/use-toast";
import { getFileMetadata } from "@/lib/metadata";

import { DialogType } from "../";

import type { MutationVariables } from '@/hooks/use-api-mutation';

import type { CreateSource, GetUploadUrl, GetUploadUrlResponse } from '@memora/schemas';
type Props = {
  folderId?: string;
  slug: string;
}

export const CreateSourceFile = ({ slug, folderId }: Props) => {
  const { mutateAsync: generateUrl } = useApiMutation<
    MutationVariables<GetUploadUrl>, GetUploadUrlResponse
  >(`/api/knowledge/${slug}/source/upload-url`);
  const { closeDialog } = useDialog();
  const { toast } = useToast();

  const generateUploadUrl = async (info: UploadedFile): Promise<{ url: string, key: string }> => {
    return await generateUrl({
      body: { fileName: info.name, contentType: info.type, fileSize: info.size }
    });
  }
  console.log(folderId, slug);

  const { mutate: createSource } = useApiMutation<MutationVariables<CreateSource>>(`/api/knowledge/${slug}/source`);
  const onUploadComplete = async (f: UploadedFile) => {
    const metadata = await getFileMetadata(f.file);
    const sourceType = f.type.startsWith("image") ? "IMAGE" : f.type.startsWith("audio") ? "AUDIO" : f.type.startsWith("video") ? "VIDEO" : "FILE";
    const body: CreateSource = {
      ...metadata,
      metadata,
      contentType: f.type,
      sourceType,
      extension: f.name.split('.').pop(),
      originalName: f.name,
      name: f.name,
      folderId,
      key: f.key,
      size: f.size,
    }
    createSource({ body }, {
      onError(error) {
        toast({ title:"Error processing source", description: error.message, variant: "destructive" });
      }
    });
  }

  const onFinish = () => {
    closeDialog(DialogType.CREATE_SOURCE);
  }

  return (
    <div>
      <FileUploader
        generateUploadUrl={generateUploadUrl}
        onUploadComplete={onUploadComplete}
        onFinish={onFinish}
        multiple
      />
    </div>
  )
}