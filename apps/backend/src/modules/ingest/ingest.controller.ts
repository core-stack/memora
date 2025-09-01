import { Body, Controller, Post } from "@nestjs/common";

import { IngestService } from "./ingest.service";

@Controller('ingest')
export class IngestController {
  constructor(private readonly ingestService: IngestService) {}

  @Post("iterate")
  async iterate(@Body() body: any) {
    return this.ingestService.iterate(body.tenantId, body.path);
  }
}
