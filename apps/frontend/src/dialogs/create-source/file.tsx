"use client"

import type { UploadedFile } from '@/components/file-uploader';

import { FileUploader } from '@/components/file-uploader';
import { useApiSourceCreate, useApiSourceUpload } from '@/gen';
import { useApiInvalidate } from '@/hooks/use-api-invalidate';
import { useDialog } from '@/hooks/use-dialog';
import { useKnowledge } from '@/hooks/use-knowledge';
import { useTenant } from '@/hooks/use-tenant';
import { useToast } from '@/hooks/use-toast';
import { getFileMetadata } from '@/lib/metadata';

import { DialogType } from '../';

import type { FileURLResponseDto } from '@/gen';

type Props = { folderId?: string; }

export const CreateSourceFile = ({ folderId }: Props) => {
  const { mutateAsync: generateUrl } = useApiSourceUpload();
  
  const { tenant } = useTenant();
  const { knowledge } = useKnowledge();

  const { closeDialog } = useDialog();
  const { toast } = useToast();

  const generateUploadUrl = async (info: UploadedFile): Promise<FileURLResponseDto> => {
    return await generateUrl({
      data: { fileName: info.name, contentType: info.type, fileSize: info.size },
      tenantId: tenant?.id ?? "",
      knowledgeId: knowledge?.id ?? ""
    });
  }

  const invalidate = useApiInvalidate();
  const { mutateAsync: createSource } = useApiSourceCreate();
  const onUploadComplete = async (f: UploadedFile) => {
    const metadata = await getFileMetadata(f.file);
    await createSource({ 
      knowledgeId: knowledge?.id ?? "",
      tenantId: tenant?.id ?? "",
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
    invalidate('/api/tenant/:tenantId/knowledge/:knowledgeSlug/folder');
    invalidate('/api/tenant/:tenantId/knowledge/:knowledgeSlug/source');
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