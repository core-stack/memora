"use client"

import { FileViewer } from '@/components/file-viewer';
import type { SourceEntity } from '@/gen';

type Props = {
  data?: SourceEntity;
  isLoading: boolean;
}
export function ContentPreview({ isLoading, data }: Props) {
  return (
    <FileViewer source={data} isLoading={isLoading} />
  )
}