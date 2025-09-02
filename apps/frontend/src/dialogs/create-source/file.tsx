"use client"

import type { UploadedFile } from '@/components/file-uploader';

import { FileUploader } from '@/components/file-uploader';

export const CreateSourceFile = () => {
  const generateUploadUrl = async (info: UploadedFile): Promise<{ url: string, key: string }> => {
    console.log(info);
    return { url: "", key: "" }
  }

  const onUploadComplete = async (f: UploadedFile) => {
    console.log(f);
    
  }

  const onFinish = () => { }

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