"use client"

import type { UploadedFile } from '@/components/file-uploader';

import { FileUploader } from '@/components/file-uploader';
import { folderQueryKeyFn, sourceQueryKeyFn, useApiSourceCreate, useApiSourceUpload } from '@/gen';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useDialog } from '@/hooks/use-dialog';
import { useToast } from '@/hooks/use-toast';
import { getFileMetadata } from '@/lib/metadata';

import { DialogType } from '../';

import type { FileURLResponseDto } from '@/gen';

export type CreateSourceFileProps = {
  folderId?: string;
  tenantId: string;
  knowledgeId: string;
}

export const CreateSourceFile = ({ folderId, knowledgeId, tenantId }: CreateSourceFileProps) => {
  const { mutateAsync: generateUrl } = useApiSourceUpload();

  const { closeDialog } = useDialog();
  const { toast } = useToast();

  const generateUploadUrl = async (info: UploadedFile): Promise<FileURLResponseDto> => {
    return await generateUrl({
      data: { fileName: info.name, contentType: info.type, fileSize: info.size },
      tenantId,
      knowledgeId
    });
  }

  const invalidate = useApiInvalidate();
  const { mutateAsync: createSource } = useApiSourceCreate();
  const onUploadComplete = async (f: UploadedFile) => {
    const metadata = await getFileMetadata(f.file);
    await createSource({ 
      knowledgeId,
      tenantId,
      data: {
        originalName: f.name,
        name: f.name,
        key: f.key,
        folderId,
        metadata,
        sourceType: metadata.type,
      }
     }, {
      onError(error) {
        toast({ title:"Error processing source", description: error.message, variant: "destructive" });
      }
    });
  }

  const onFinish = () => {
    invalidate(
      folderQueryKeyFn({ knowledgeId, tenantId }),
      sourceQueryKeyFn({ knowledgeId, tenantId }),
    )
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