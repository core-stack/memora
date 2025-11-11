import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Fragments, SourceFragment } from '@/fragment';
import { SourceEntity } from '@/modules/knowledge/source/source.entity';
import { FragmentFileMetadata, SourceType } from '@snipet/schemas';
import { IProcessor } from './types';

export abstract class BaseProcessor implements IProcessor {
  protected splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  protected createFragments(
    docs: { pageContent: string }[],
    source: SourceEntity,
    metadata: FragmentFileMetadata,
    type: SourceType
  ): Fragments<SourceFragment> {
    const fragmentsArray = docs.map((chunk, seqId) => {
      return new SourceFragment({
        content: chunk.pageContent,
        sourceId: source.id,
        knowledgeId: source.knowledgeId,
        tenantId: source.tenantId,
        seqId,
        metadata,
        sourceType: type,
      });
    });

    return Fragments.fromFragmentArray(fragmentsArray);
  }

  abstract process(
    source: SourceEntity,
    pathOrBlob: string | Blob,
    metadata: FragmentFileMetadata
  ): Promise<Fragments<SourceFragment>>;
}

