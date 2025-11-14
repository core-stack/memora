import { Fragments, SourceFragment } from '@/fragment';
import { SourceMetadata } from '@/modules/knowledge/source/metadata.types';
import { SourceEntity } from '@/modules/knowledge/source/source.entity';

export interface IProcessor {
  process(
    source: SourceEntity,
    pathOrBlob: string | Blob,
    metadata: SourceMetadata
  ): Promise<Fragments<SourceFragment>>
}