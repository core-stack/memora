import { SourceEntity } from "@/entities/source.entity";
import { Fragments, SourceFragment } from "@/fragment";
import { Inject, Injectable, Logger } from "@nestjs/common";

import {
  CSVProcessor, DocxProcessor, JSONLProcessor, JSONProcessor, PDFProcessor, PPTProcessor,
  TextProcessor
} from "./processors";
import { IProcessor } from "./processors/types";

@Injectable()
export class ProcessorManager {
  private readonly logger = new Logger(ProcessorManager.name);

  @Inject() private readonly pdfProcessor!: PDFProcessor;
  @Inject() private readonly docxProcessor!: DocxProcessor;
  @Inject() private readonly pptProcessor!: PPTProcessor;
  @Inject() private readonly textProcessor!: TextProcessor;
  @Inject() private readonly csvProcessor!: CSVProcessor;
  @Inject() private readonly jsonProcessor!: JSONProcessor;
  @Inject() private readonly jsonlProcessor!: JSONLProcessor;

  private getProcessor(extension: string): IProcessor {
    const ext = extension.toLowerCase();

    if ([ "pdf" ].includes(ext)) return this.pdfProcessor;
    if ([ "doc", "docx" ].includes(ext)) return this.docxProcessor;
    if ([ "ppt", "pptx" ].includes(ext)) return this.pptProcessor;
    if ([ "txt", "md", "log" ].includes(ext)) return this.textProcessor;
    if ([ "csv" ].includes(ext)) return this.csvProcessor;
    if ([ "json" ].includes(ext)) return this.jsonProcessor;
    if ([ "jsonl", "ndjson" ].includes(ext)) return this.jsonlProcessor;

    throw new Error(`Unsupported file extension: ${extension}`);
  }

  async process(source: SourceEntity, input: Blob): Promise<Fragments<SourceFragment>> {
    const ext = source.metadata.extension?.toLowerCase();
    if (!ext) throw new Error("Missing file extension");

    const processor = this.getProcessor(ext);

    this.logger.debug(`Processing file "${source.name}" with ${processor.constructor.name}`);

    return processor.process(source, input, source.metadata);
  }
}
