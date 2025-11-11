"use client"

import { FileViewer } from '@/components/file-viewer';

import type { Source } from "@snipet/schemas";
type Props = {
  data?: Source;
  isLoading: boolean;
}
export function ContentPreview({ isLoading, data }: Props) {
  return (
    <FileViewer source={data} isLoading={isLoading} />
  )
}