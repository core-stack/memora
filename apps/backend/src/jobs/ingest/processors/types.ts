import { Fragments, SourceFragment } from '@/fragment';
import { SourceEntity } from '@/modules/knowledge/source/source.entity';
import { FragmentFileMetadata } from '@snipet/schemas';

export interface IProcessor {
  process(
    source: SourceEntity,
    pathOrBlob: string | Blob,
    metadata: FragmentFileMetadata
  ): Promise<Fragments<SourceFragment>>
}