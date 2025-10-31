import { Fragments, SourceFragment } from '@/fragment';
import { Inject, Injectable } from '@nestjs/common';
import { OriginType, Source, SourceType } from '@snipet/schemas';

import { PDFProcessor } from './processors/pdf.processor';
import { SourceEntity } from '@/modules/knowledge/source/source.entity';

@Injectable()
export class ProcessorManager {
  @Inject() private readonly pdfProcessor!: PDFProcessor;

  async process(source: SourceEntity, input: Blob): Promise<Fragments<SourceFragment>> {
    if (source.metadata.type !== SourceType.DOC) throw new Error("Invalid file format");
    if (source.metadata.extension !== "pdf") throw new Error("Invalid file format");

    const fragments = await this.pdfProcessor.process(source, input,
      {
        contentType: source.metadata.contentType,
        extension: source.metadata.extension,
        name: source.originalName,
        size: source.metadata.size,
        type: OriginType.FILE,
        path: source.key
      }
    );

    return fragments;
  }
}