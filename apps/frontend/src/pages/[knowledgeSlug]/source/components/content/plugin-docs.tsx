import { MarkdownViewer } from '@/components/markdown-viewer';
import { env } from '@/env';

import { useSource } from '../../hooks/use-source';

export const PluginDocs = () => {
  const { plugin } = useSource();

  const url = `${env.STORAGE_URL}/plugins/${plugin!.name}/documentation.md`;
  
  return (
    <div className='overflow-y-auto h-full'>
      <MarkdownViewer url={url} />
    </div>
  )
}