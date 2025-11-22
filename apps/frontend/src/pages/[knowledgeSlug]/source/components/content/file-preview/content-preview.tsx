"use client"

import { FileViewer } from '@/components/file-viewer';

import type { SourceEntity } from '@/gen';

type Props = {
  data?: SourceEntity;
}
export function ContentPreview({ data }: Props) {
  return (
    <FileViewer source={data} />
  )
}