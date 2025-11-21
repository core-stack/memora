import { SourceMetadata } from "@/entities/metadata.types";
import { SourceEntity } from "@/entities/source.entity";
import { Fragments, SourceFragment } from "@/fragment";

export interface IProcessor {
  process(
    source: SourceEntity,
    pathOrBlob: string | Blob,
    metadata: SourceMetadata
  ): Promise<Fragments<SourceFragment>>
}
