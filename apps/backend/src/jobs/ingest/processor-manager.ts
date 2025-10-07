import { Fragments } from "@/fragment";
import { OriginType, Source, SourceType } from "@memora/schemas";
import { Inject, Injectable } from "@nestjs/common";
import { PDFProcessor } from "./processors/pdf.processor";

@Injectable()
export class ProcessorManager {
  @Inject() private readonly pdfProcessor!: PDFProcessor;

  async process(source: Source, input: Blob): Promise<Fragments> {
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