"use client"

import type { UploadedFile } from '@/components/file-uploader';

import { FileUploader } from '@/components/file-uploader';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useApiMutation } from '@/hooks/use-api-mutation';
import { useDialog } from '@/hooks/use-dialog';
import { useToast } from '@/hooks/use-toast';
import { getFileMetadata } from '@/lib/metadata';

import { DialogType } from '../';

import type { CreateSource, GetFileUrlResponse, SourceType } from '@memora/schemas';

type Props = { folderId?: string; }

export const CreateSourceFile = ({ folderId }: Props) => {
  const { mutateAsync: generateUrl } = useApiMutation("/api/knowledge/:knowledgeSlug/source/upload-url", { method: "POST" });
  const { closeDialog } = useDialog();
  const { toast } = useToast();

  const generateUploadUrl = async (info: UploadedFile): Promise<GetFileUrlResponse> => {
    return await generateUrl({
      body: { fileName: info.name, contentType: info.type, fileSize: info.size }
    });
  }

  const invalidate = useApiInvalidate();
  const { mutate: createSource } = useApiMutation("/api/knowledge/:knowledgeSlug/source", { method: "POST" });
  const onUploadComplete = async (f: UploadedFile) => {
    const metadata = await getFileMetadata(f.file);
    const body: CreateSource = {
      metadata: metadata as any,
      sourceType: metadata.type,
      originalName: f.name,
      name: f.name,
      folderId,
      key: f.key,
    }
    createSource({ body }, {
      onError(error) {
        toast({ title:"Error processing source", description: error.message, variant: "destructive" });
      }
    });
  }

  const onFinish = () => {
    invalidate('/api/knowledge/:knowledgeSlug/folder');
    invalidate('/api/knowledge/:knowledgeSlug/source');
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